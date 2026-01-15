import { IsString, IsOptional, MaxLength, Matches } from 'class-validator';

export class UpdateEtiquetteDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  nom?: string;

  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-F]{6}$/i, { message: 'La couleur doit être au format hexadécimal (ex: #6B7280)' })
  couleur?: string;
}