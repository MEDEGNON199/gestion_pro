import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { Projet } from '../../projets/entities/projet.entity';
import { Utilisateur } from '../../utilisateurs/entities/utilisateur.entity';
import { Etiquette } from '../../etiquettes/entities/etiquette.entity';

export enum StatutTache {
  A_FAIRE = 'A_FAIRE',
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE',
}

export enum PrioriteTache {
  BASSE = 'BASSE',
  MOYENNE = 'MOYENNE',
  HAUTE = 'HAUTE',
}

@Entity('taches')
export class Tache {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  titre: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid' })
  projet_id: string;

  @ManyToOne(() => Projet)
  @JoinColumn({ name: 'projet_id' })
  projet: Projet;

  @Column({ type: 'uuid', nullable: true })
  assigne_a: string;

  @ManyToOne(() => Utilisateur)
  @JoinColumn({ name: 'assigne_a' })
  utilisateur_assigne: Utilisateur;

  @Column({ type: 'uuid' })
  cree_par: string;

  @ManyToOne(() => Utilisateur)
  @JoinColumn({ name: 'cree_par' })
  createur: Utilisateur;

  @Column({
    type: 'enum',
    enum: StatutTache,
    default: StatutTache.A_FAIRE,
  })
  statut: StatutTache;

  @Column({
    type: 'enum',
    enum: PrioriteTache,
    default: PrioriteTache.MOYENNE,
  })
  priorite: PrioriteTache;

  @Column({ type: 'timestamp', nullable: true })
  date_echeance: Date;

  @Column({ type: 'timestamp', nullable: true })
  date_completion: Date;

  @Column({ type: 'integer', default: 0 })
  position: number;

  @ManyToMany(() => Etiquette)
  @JoinTable({
    name: 'taches_etiquettes',
    joinColumn: { name: 'tache_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'etiquette_id', referencedColumnName: 'id' },
  })
  etiquettes: Etiquette[];

  @CreateDateColumn()
  date_creation: Date;

  @UpdateDateColumn()
  date_modification: Date;
}