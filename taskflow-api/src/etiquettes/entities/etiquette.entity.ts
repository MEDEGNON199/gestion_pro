import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Projet } from '../../projets/entities/projet.entity';

@Entity('etiquettes')
export class Etiquette {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nom: string;

  @Column({ length: 7, default: '#6B7280' })
  couleur: string;

  @Column({ type: 'uuid' })
  projet_id: string;

  @ManyToOne(() => Projet)
  @JoinColumn({ name: 'projet_id' })
  projet: Projet;

  @CreateDateColumn()
  date_creation: Date;
}