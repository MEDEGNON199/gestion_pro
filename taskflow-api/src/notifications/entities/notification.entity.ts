import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Utilisateur } from '../../utilisateurs/entities/utilisateur.entity';
import { Projet } from '../../projets/entities/projet.entity';
import { Tache } from '../../taches/entities/tache.entity';

export enum TypeNotification {
  INVITATION = 'INVITATION',
  TACHE_ASSIGNEE = 'TACHE_ASSIGNEE',
  COMMENTAIRE = 'COMMENTAIRE',
  TACHE_TERMINEE = 'TACHE_TERMINEE',
  MEMBRE_AJOUTE = 'MEMBRE_AJOUTE',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  utilisateur_id: string;

  @ManyToOne(() => Utilisateur)
  @JoinColumn({ name: 'utilisateur_id' })
  utilisateur: Utilisateur;

  @Column({
    type: 'enum',
    enum: TypeNotification,
  })
  type: TypeNotification;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'boolean', default: false })
  est_lue: boolean;

  @Column({ type: 'uuid', nullable: true })
  projet_id: string;

  @ManyToOne(() => Projet, { nullable: true })
  @JoinColumn({ name: 'projet_id' })
  projet: Projet;

  @Column({ type: 'uuid', nullable: true })
  tache_id: string;

  @ManyToOne(() => Tache, { nullable: true })
  @JoinColumn({ name: 'tache_id' })
  tache: Tache;

  @Column({ type: 'uuid', nullable: true })
  invitation_id: string;

  @CreateDateColumn()
  date_creation: Date;
}
