import { IsString, IsOptional, IsUUID, IsEnum, IsDateString, IsInt } from 'class-validator';
import { StatutTache, PrioriteTache } from '../entities/tache.entity';

export class UpdateTacheDto {
  @IsString()
  @IsOptional()
  titre?: string;

  @IsString()
  @IsOptional()
  description?: string;

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