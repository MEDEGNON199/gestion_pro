import { IsNotEmpty, IsString, IsOptional, MaxLength, Matches } from 'class-validator';

export class CreateProjetDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nom: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-F]{6}$/i, { message: 'La couleur doit être au format hexadécimal (ex: #3B82F6)' })
  couleur?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  icone?: string;
}