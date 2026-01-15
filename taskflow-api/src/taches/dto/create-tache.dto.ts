import { IsNotEmpty, IsString, IsOptional, IsUUID, IsEnum, IsDateString, IsInt } from 'class-validator';
import { StatutTache, PrioriteTache } from '../entities/tache.entity';

export class CreateTacheDto {
  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsNotEmpty()
  projet_id: string;

  @IsUUID()
  @IsOptional()
  assigne_a?: string;

  @IsEnum(StatutTache)
  @IsOptional()
  statut?: StatutTache;

  @IsEnum(PrioriteTache)
  @IsOptional()
  priorite?: PrioriteTache;

  @IsDateString()
  @IsOptional()
  date_echeance?: string;

  @IsInt()
  @IsOptional()
  position?: number;
}