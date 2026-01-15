import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Projet } from '../../projets/entities/projet.entity';
import { Utilisateur } from '../../utilisateurs/entities/utilisateur.entity';

export enum RoleProjet {
  PROPRIETAIRE = 'PROPRIETAIRE',
  ADMIN = 'ADMIN',
  MEMBRE = 'MEMBRE',
}

@Entity('membres_projets')
@Unique(['projet_id', 'utilisateur_id'])
export class MembreProjet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  projet_id: string;

  @ManyToOne(() => Projet)
  @JoinColumn({ name: 'projet_id' })
  projet: Projet;

  @Column({ type: 'uuid' })
  utilisateur_id: string;

  @ManyToOne(() => Utilisateur)
  @JoinColumn({ name: 'utilisateur_id' })
  utilisateur: Utilisateur;

  @Column({
    type: 'enum',
    enum: RoleProjet,
    default: RoleProjet.MEMBRE,
  })
  role: RoleProjet;

  @CreateDateColumn()
  date_ajout: Date;
}