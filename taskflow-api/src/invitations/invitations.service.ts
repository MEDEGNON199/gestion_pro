import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation, StatutInvitation } from './entities/invitation.entity';
import { Projet } from '../projets/entities/projet.entity';
import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';
import { MembreProjet } from '../membres-projets/entities/membre-projet.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation)
    private invitationRepository: Repository<Invitation>,
    @InjectRepository(Projet)
    private projetRepository: Repository<Projet>,
    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>,
    @InjectRepository(MembreProjet)
    private membreProjetRepository: Repository<MembreProjet>,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async inviter(
    projetId: string,
    email: string,
    role: string,
    utilisateur: Utilisateur,
  ) {
    // Vérifier que le projet existe et que l'utilisateur est propriétaire/admin
    const projet = await this.projetRepository.findOne({
      where: { id: projetId },
    });

    if (!projet) {
      throw new NotFoundException('Projet non trouvé');
    }

    if (projet.proprietaire_id !== utilisateur.id) {
      throw new ForbiddenException('Seul le propriétaire peut inviter des membres');
    }

    // Vérifier si l'email n'est pas déjà membre
    const utilisateurExistant = await this.utilisateurRepository.findOne({
      where: { email },
    });

    if (utilisateurExistant) {
      const dejaMembre = await this.membreProjetRepository.findOne({
        where: {
          projet_id: projetId,
          utilisateur_id: utilisateurExistant.id,
        },
      });

      if (dejaMembre) {
        throw new BadRequestException('Cet utilisateur est déjà membre du projet');
      }
    }

    // Vérifier s'il y a déjà une invitation en attente
    let invitation = await this.invitationRepository.findOne({
      where: {
        projet_id: projetId,
        email,
        statut: StatutInvitation.EN_ATTENTE,
      },
    });

    let isNewInvitation = false;

    if (invitation) {
      // Invitation existante : régénérer le token et prolonger la date d'expiration
      invitation.token = crypto.randomBytes(32).toString('hex');
      invitation.role = role as any;
      const dateExpiration = new Date();
      dateExpiration.setDate(dateExpiration.getDate() + 7);
      invitation.date_expiration = dateExpiration;
      
      await this.invitationRepository.save(invitation);
    } else {
      // Nouvelle invitation
      isNewInvitation = true;
      const token = crypto.randomBytes(32).toString('hex');
      const dateExpiration = new Date();
      dateExpiration.setDate(dateExpiration.getDate() + 7);

      invitation = this.invitationRepository.create({
        projet_id: projetId,
        email,
        role: role as any,
        invite_par: utilisateur.id,
        token,
        date_expiration: dateExpiration,
      });

      await this.invitationRepository.save(invitation);
    }

    // Envoyer l'email
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const invitationUrl = `${frontendUrl}/invitations/${invitation.token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: isNewInvitation 
        ? `Invitation au projet ${projet.nom}` 
        : `Rappel: Invitation au projet ${projet.nom}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e293b;">${isNewInvitation ? 'Invitation à rejoindre un projet' : 'Rappel d\'invitation'}</h2>
          <p>Bonjour,</p>
          <p><strong>${utilisateur.prenom} ${utilisateur.nom}</strong> vous ${isNewInvitation ? 'a invité' : 'vous rappelle son invitation'} à rejoindre le projet <strong>${projet.nom}</strong> sur TaskFlow.</p>
          <p>Vous avez été invité en tant que <strong>${role}</strong>.</p>
          <div style="margin: 30px 0;">
            <a href="${invitationUrl}" 
               style="background-color: #1e293b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Accepter l'invitation
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">Cette invitation expire dans 7 jours.</p>
          <p style="color: #666; font-size: 14px;">Si vous n'avez pas de compte, vous pourrez en créer un en cliquant sur le lien.</p>
        </div>
      `,
    });

    return {
      message: isNewInvitation 
        ? 'Invitation envoyée avec succès' 
        : 'Invitation renvoyée avec succès',
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
      },
    };
  }

  async getInvitationsByProjet(projetId: string, utilisateur: Utilisateur) {
    const projet = await this.projetRepository.findOne({
      where: { id: projetId },
    });

    if (!projet || projet.proprietaire_id !== utilisateur.id) {
      throw new ForbiddenException('Accès refusé');
    }

    return await this.invitationRepository.find({
      where: { projet_id: projetId },
      order: { date_creation: 'DESC' },
    });
  }

  async getMyInvitations(utilisateur: Utilisateur) {
    return await this.invitationRepository.find({
      where: { 
        email: utilisateur.email,
        statut: StatutInvitation.EN_ATTENTE,
      },
      relations: ['projet', 'inviteur'],
      order: { date_creation: 'DESC' },
    });
  }

  async accepterInvitation(token: string, utilisateur: Utilisateur) {
    const invitation = await this.invitationRepository.findOne({
      where: { token },
      relations: ['projet'],
    });

    if (!invitation) {
      throw new NotFoundException('Invitation non trouvée');
    }

    if (invitation.email !== utilisateur.email) {
      throw new ForbiddenException('Cette invitation ne vous est pas destinée');
    }

    if (invitation.statut !== StatutInvitation.EN_ATTENTE) {
      throw new BadRequestException('Cette invitation a déjà été traitée');
    }

    if (new Date() > invitation.date_expiration) {
      invitation.statut = StatutInvitation.EXPIREE;
      await this.invitationRepository.save(invitation);
      throw new BadRequestException('Cette invitation a expiré');
    }

    // Vérifier si pas déjà membre
    const dejaMembre = await this.membreProjetRepository.findOne({
      where: {
        projet_id: invitation.projet_id,
        utilisateur_id: utilisateur.id,
      },
    });

    if (dejaMembre) {
      throw new BadRequestException('Vous êtes déjà membre de ce projet');
    }

    // Ajouter comme membre
    const membre = this.membreProjetRepository.create({
      projet_id: invitation.projet_id,
      utilisateur_id: utilisateur.id,
      role: invitation.role as any,
    });

    await this.membreProjetRepository.save(membre);

    // Marquer l'invitation comme acceptée
    invitation.statut = StatutInvitation.ACCEPTEE;
    await this.invitationRepository.save(invitation);

    return {
      message: 'Invitation acceptée avec succès',
      projet: invitation.projet,
    };
  }

  async refuserInvitation(token: string, utilisateur: Utilisateur) {
    const invitation = await this.invitationRepository.findOne({
      where: { token },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation non trouvée');
    }

    if (invitation.email !== utilisateur.email) {
      throw new ForbiddenException('Cette invitation ne vous est pas destinée');
    }

    invitation.statut = StatutInvitation.REFUSEE;
    await this.invitationRepository.save(invitation);

    return { message: 'Invitation refusée' };
  }

  async annulerInvitation(invitationId: string, utilisateur: Utilisateur) {
    const invitation = await this.invitationRepository.findOne({
      where: { id: invitationId },
      relations: ['projet'],
    });

    if (!invitation) {
      throw new NotFoundException('Invitation non trouvée');
    }

    if (invitation.projet.proprietaire_id !== utilisateur.id) {
      throw new ForbiddenException('Seul le propriétaire peut annuler une invitation');
    }

    await this.invitationRepository.remove(invitation);

    return { message: 'Invitation annulée' };
  }
}