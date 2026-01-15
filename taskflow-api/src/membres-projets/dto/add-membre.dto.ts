import { IsNotEmpty, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { RoleProjet } from '../entities/membre-projet.entity';

export class AddMembreDto {
  @IsUUID()
  @IsNotEmpty()
  projet_id: string;

  @IsUUID()
  @IsNotEmpty()
  utilisateur_id: string;

  @IsEnum(RoleProjet)
  @IsOptional()
  role?: RoleProjet;
}