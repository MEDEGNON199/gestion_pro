import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Projet } from '../../projets/entities/projet.entity';
import { Utilisateur } from '../../utilisateurs/entities/utilisateur.entity';
import { RoleProjet } from '../../membres-projets/entities/membre-projet.entity';

export enum StatutInvitation {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTEE = 'ACCEPTEE',
  REFUSEE = 'REFUSEE',
  EXPIREE = 'EXPIREE',
}

@Entity('invitations')
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  projet_id: string;

  @ManyToOne(() => Projet)
  @JoinColumn({ name: 'projet_id' })
  projet: Projet;

  @Column({ length: 255 })
  email: string;

  @Column({
    type: 'enum',
    enum: RoleProjet,
    default: RoleProjet.MEMBRE,
  })
  role: RoleProjet;

  @Column({ type: 'uuid' })
  invite_par: string;

  @ManyToOne(() => Utilisateur)
  @JoinColumn({ name: 'invite_par' })
  inviteur: Utilisateur;

  @Column({ length: 255, unique: true })
  token: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: StatutInvitation.EN_ATTENTE,
  })
  statut: string;

  @CreateDateColumn()
  date_creation: Date;

  @Column({ type: 'timestamp', nullable: true })
  date_expiration: Date;
}