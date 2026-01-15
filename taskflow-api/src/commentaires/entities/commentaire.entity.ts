import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tache } from '../../taches/entities/tache.entity';
import { Utilisateur } from '../../utilisateurs/entities/utilisateur.entity';

@Entity('commentaires')
export class Commentaire {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  contenu: string;

  @Column({ type: 'uuid' })
  tache_id: string;

  @ManyToOne(() => Tache)
  @JoinColumn({ name: 'tache_id' })
  tache: Tache;

  @Column({ type: 'uuid' })
  utilisateur_id: string;

  @ManyToOne(() => Utilisateur)
  @JoinColumn({ name: 'utilisateur_id' })
  utilisateur: Utilisateur;

  @CreateDateColumn()
  date_creation: Date;

  @UpdateDateColumn()
  date_modification: Date;
}