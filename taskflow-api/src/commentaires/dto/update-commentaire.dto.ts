import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateCommentaireDto {
  @IsString()
  @IsNotEmpty()
  contenu: string;
}