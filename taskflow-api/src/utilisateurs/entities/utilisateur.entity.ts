import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('utilisateurs')
export class Utilisateur {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255, nullable: true })
  mot_de_passe: string;

  @Column({ length: 100, nullable: true })
  prenom: string;

  @Column({ length: 100, nullable: true })
  nom: string;

  @Column({ type: 'text', nullable: true })
  avatar_url: string;

  @Column({ length: 50, nullable: true })
  provider: string; // 'google', 'github', 'local'

  @Column({ length: 255, nullable: true })
  provider_id: string; // ID from OAuth provider

  @Column({ type: 'text', nullable: true })
  avatar: string; // OAuth avatar URL

  @Column({ default: true })
  est_actif: boolean;

  @CreateDateColumn()
  date_creation: Date;

  @UpdateDateColumn()
  date_modification: Date;
}