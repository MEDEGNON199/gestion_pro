import { IsNotEmpty, IsString, IsOptional, IsUUID, MaxLength, Matches } from 'class-validator';

export class CreateEtiquetteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nom: string;

  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-F]{6}$/i, { message: 'La couleur doit être au format hexadécimal (ex: #6B7280)' })
  couleur?: string;

  @IsUUID()
  @IsNotEmpty()
  projet_id: string;
}