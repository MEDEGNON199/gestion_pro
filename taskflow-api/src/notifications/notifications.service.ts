import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, TypeNotification } from './entities/notification.entity';
import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async createNotification(
    utilisateurId: string,
    type: TypeNotification,
    message: string,
    projetId?: string,
    tacheId?: string,
    invitationId?: string,
  ) {
    const notification = this.notificationRepository.create({
      utilisateur_id: utilisateurId,
      type,
      message,
      projet_id: projetId,
      tache_id: tacheId,
      invitation_id: invitationId,
      est_lue: false,
    });

    return await this.notificationRepository.save(notification);
  }

  async findAllByUtilisateur(utilisateur: Utilisateur) {
    return await this.notificationRepository.find({
      where: { utilisateur_id: utilisateur.id },
      relations: ['projet', 'tache'],
      order: { date_creation: 'DESC' },
      take: 50, // Limite à 50 dernières notifications
    });
  }

  async findUnreadCount(utilisateur: Utilisateur) {
    return await this.notificationRepository.count({
      where: {
        utilisateur_id: utilisateur.id,
        est_lue: false,
      },
    });
  }

  async markAsRead(notificationId: string, utilisateur: Utilisateur) {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, utilisateur_id: utilisateur.id },
    });

    if (!notification) {
      throw new NotFoundException('Notification non trouvée');
    }

    notification.est_lue = true;
    return await this.notificationRepository.save(notification);
  }

  async markAllAsRead(utilisateur: Utilisateur) {
    await this.notificationRepository.update(
      {
        utilisateur_id: utilisateur.id,
        est_lue: false,
      },
      {
        est_lue: true,
      },
    );

    return { message: 'Toutes les notifications ont été marquées comme lues' };
  }
}
