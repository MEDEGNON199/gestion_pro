import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, mot_de_passe, prenom, nom } = registerDto;

    // Vérifier si l'utilisateur existe déjà
    const utilisateurExistant = await this.utilisateurRepository.findOne({
      where: { email },
    });

    if (utilisateurExistant) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Hasher le mot de passe
    const motDePasseHash = await bcrypt.hash(mot_de_passe, 10);

    // Créer le nouvel utilisateur
    const nouvelUtilisateur = this.utilisateurRepository.create({
      email,
      mot_de_passe: motDePasseHash,
      prenom,
      nom,
    });

    await this.utilisateurRepository.save(nouvelUtilisateur);

    // Générer le token JWT
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

    // Trouver l'utilisateur
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { email },
    });

    if (!utilisateur) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);

    if (!motDePasseValide) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Générer le token JWT
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
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    return utilisateur;
  }
}