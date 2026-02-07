import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Utilisateur } from '../../utilisateurs/entities/utilisateur.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  utilisateur_id: string;

  @ManyToOne(() => Utilisateur, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'utilisateur_id' })
  utilisateur: Utilisateur;

  @Column()
  action: string; // LOGIN, LOGOUT, CREATE_PROJECT, DELETE_TASK, etc.

  @Column({ nullable: true })
  ressource_type: string; // projet, tache, utilisateur, etc.

  @Column({ nullable: true })
  ressource_id: string;

  @Column({ type: 'jsonb', nullable: true })
  details: any; // Détails supplémentaires de l'action

  @Column({ nullable: true })
  ip_address: string;

  @Column({ nullable: true })
  user_agent: string;

  @Column({ default: 'success' })
  status: string; // success, failed

  @CreateDateColumn()
  date_action: Date;
}
