import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCommentaireDto {
  @IsString()
  @IsNotEmpty()
  contenu: string;

  @IsUUID()
  @IsNotEmpty()
  tache_id: string;
}