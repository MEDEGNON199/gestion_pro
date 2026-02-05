import { Injectable, NotFoundException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commentaire } from './entities/commentaire.entity';
import { Tache } from '../taches/entities/tache.entity';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';
import { UpdateCommentaireDto } from './dto/update-commentaire.dto';
import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { TypeNotification } from '../notifications/entities/notification.entity';

@Injectable()
export class CommentairesService {
  constructor(
    @InjectRepository(Commentaire)
    private commentaireRepository: Repository<Commentaire>,
    @InjectRepository(Tache)
    private tacheRepository: Repository<Tache>,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
  ) {}

  async create(createCommentaireDto: CreateCommentaireDto, utilisateur: Utilisateur) {
    const tache = await this.tacheRepository.findOne({
      where: { id: createCommentaireDto.tache_id },
      relations: ['projet'],
    });

    if (!tache) {
      throw new NotFoundException('Tâche non trouvée');
    }

    if (tache.projet.proprietaire_id !== utilisateur.id) {
      throw new ForbiddenException('Vous n\'avez pas accès à cette tâche');
    }

    const nouveauCommentaire = this.commentaireRepository.create({
      ...createCommentaireDto,
      utilisateur_id: utilisateur.id,
    });

    const commentaireSauvegarde = await this.commentaireRepository.save(nouveauCommentaire);

    // Créer une notification pour l'utilisateur assigné à la tâche (s'il existe et n'est pas le créateur du commentaire)
    if (tache.assigne_a && tache.assigne_a !== utilisateur.id) {
      await this.notificationsService.createNotification(
        tache.assigne_a,
        TypeNotification.COMMENTAIRE,
        `${utilisateur.prenom} ${utilisateur.nom} a commenté la tâche "${tache.titre}"`,
        tache.projet_id,
        tache.id,
      );
    }

    return commentaireSauvegarde;
  }

  async findAllByTache(tacheId: string, utilisateur: Utilisateur) {
    const tache = await this.tacheRepository.findOne({
      where: { id: tacheId },
      relations: ['projet'],
    });

    if (!tache) {
      throw new NotFoundException('Tâche non trouvée');
    }

    if (tache.projet.proprietaire_id !== utilisateur.id) {
      throw new ForbiddenException('Vous n\'avez pas accès à cette tâche');
    }

    return await this.commentaireRepository.find({
      where: { tache_id: tacheId },
      relations: ['utilisateur'],
      order: { date_creation: 'ASC' },
    });
  }

  async findOne(id: string, utilisateur: Utilisateur) {
    const commentaire = await this.commentaireRepository.findOne({
      where: { id },
      relations: ['tache', 'tache.projet', 'utilisateur'],
    });

    if (!commentaire) {
      throw new NotFoundException('Commentaire non trouvé');
    }

    if (commentaire.tache.projet.proprietaire_id !== utilisateur.id) {
      throw new ForbiddenException('Vous n\'avez pas accès à ce commentaire');
    }

    return commentaire;
  }

  async update(id: string, updateCommentaireDto: UpdateCommentaireDto, utilisateur: Utilisateur) {
    const commentaire = await this.findOne(id, utilisateur);

    if (commentaire.utilisateur_id !== utilisateur.id) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres commentaires');
    }

    Object.assign(commentaire, updateCommentaireDto);

    return await this.commentaireRepository.save(commentaire);
  }

  async remove(id: string, utilisateur: Utilisateur) {
    const commentaire = await this.findOne(id, utilisateur);

    if (commentaire.utilisateur_id !== utilisateur.id) {
      throw new ForbiddenException('Vous ne pouvez supprimer que vos propres commentaires');
    }

    await this.commentaireRepository.remove(commentaire);

    return { message: 'Commentaire supprimé avec succès' };
  }
}