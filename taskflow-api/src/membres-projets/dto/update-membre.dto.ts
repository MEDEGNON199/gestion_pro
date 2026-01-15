import { IsEnum, IsNotEmpty } from 'class-validator';
import { RoleProjet } from '../entities/membre-projet.entity';

export class UpdateMembreDto {
  @IsEnum(RoleProjet)
  @IsNotEmpty()
  role: RoleProjet;
}