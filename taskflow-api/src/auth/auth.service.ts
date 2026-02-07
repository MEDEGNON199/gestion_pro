import { Injectable, UnauthorizedException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>,
    private jwtService: JwtService,
    @Inject(forwardRef(() => AuditService))
    private auditService: AuditService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, mot_de_passe, prenom, nom } = registerDto;

    // Check if user already exists
    const utilisateurExistant = await this.utilisateurRepository.findOne({
      where: { email },
    });

    if (utilisateurExistant) {
      throw new ConflictException('This email is already in use');
    }

    // Hash the password
    const motDePasseHash = await bcrypt.hash(mot_de_passe, 10);

    // Create new user
    const nouvelUtilisateur = this.utilisateurRepository.create({
      email,
      mot_de_passe: motDePasseHash,
      prenom,
      nom,
    });

    await this.utilisateurRepository.save(nouvelUtilisateur);

    // 📝 LOG: Inscription
    await this.auditService.log({
      utilisateurId: nouvelUtilisateur.id,
      action: 'USER_REGISTER',
      details: { email, prenom, nom },
      status: 'success',
    });

    // Generate JWT token
    const payload = { sub: nouvelUtilisateur.id, email: nouvelUtilisateur.email };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      utilisateur: {
        id: nouvelUtilisateur.id,
        email: nouvelUtilisateur.email,
        prenom: nouvelUtilisateur.prenom,
        nom: nouvelUtilisateur.nom,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, mot_de_passe } = loginDto;

    // Find user
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { email },
    });

    if (!utilisateur) {
      // 📝 LOG: Tentative de connexion échouée
      console.log('❌ LOGIN FAILED: User not found -', email);
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);

    if (!motDePasseValide) {
      // 📝 LOG: Tentative de connexion échouée
      await this.auditService.log({
        utilisateurId: utilisateur.id,
        action: 'USER_LOGIN_FAILED',
        details: { email, reason: 'Invalid password' },
        status: 'failed',
      });
      throw new UnauthorizedException('Invalid email or password');
    }

    // 📝 LOG: Connexion réussie
    await this.auditService.log({
      utilisateurId: utilisateur.id,
      action: 'USER_LOGIN',
      details: { email },
      status: 'success',
    });

    // Generate JWT token
    const payload = { sub: utilisateur.id, email: utilisateur.email };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      utilisateur: {
        id: utilisateur.id,
        email: utilisateur.email,
        prenom: utilisateur.prenom,
        nom: utilisateur.nom,
      },
    };
  }

  async validateUser(userId: string) {
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { id: userId },
    });

    if (!utilisateur) {
      throw new UnauthorizedException('User not found');
    }

    return utilisateur;
  }

  async validateOAuthUser(oauthUser: any) {
    const { email, prenom, nom, avatar, provider, providerId } = oauthUser;

    // Look for existing user with this email
    let utilisateur = await this.utilisateurRepository.findOne({
      where: { email },
    });

    if (!utilisateur) {
      // Create new OAuth user
      utilisateur = this.utilisateurRepository.create({
        email,
        prenom,
        nom,
        avatar,
        provider,
        provider_id: providerId,
        mot_de_passe: null as any, // No password for OAuth
      });

      await this.utilisateurRepository.save(utilisateur);
    } else {
      // Update OAuth info if user exists
      utilisateur.provider = provider;
      utilisateur.provider_id = providerId;
      if (avatar) utilisateur.avatar = avatar;
      
      await this.utilisateurRepository.save(utilisateur);
    }

    return utilisateur;
  }

  async generateJwtFromUser(utilisateur: Utilisateur) {
    const payload = { sub: utilisateur.id, email: utilisateur.email };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      utilisateur: {
        id: utilisateur.id,
        email: utilisateur.email,
        prenom: utilisateur.prenom,
        nom: utilisateur.nom,
      },
    };
  }
}