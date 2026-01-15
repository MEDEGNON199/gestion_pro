import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Utilisateur } from '../../utilisateurs/entities/utilisateur.entity';

@Entity('projets')
export class Projet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  nom: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 7, default: '#3B82F6' })
  couleur: string;

  @Column({ length: 50, default: 'folder' })
  icone: string;

  @Column({ type: 'uuid' })
  proprietaire_id: string;

  @ManyToOne(() => Utilisateur)
  @JoinColumn({ name: 'proprietaire_id' })
  proprietaire: Utilisateur;

  @Column({ default: false })
  est_archive: boolean;

  @CreateDateColumn()
  date_creation: Date;

  @UpdateDateColumn()
  date_modification: Date;
}