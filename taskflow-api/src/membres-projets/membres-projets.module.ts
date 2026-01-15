import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembresProjetsService } from './membres-projets.service';
import { MembresProjetsController } from './membres-projets.controller';
import { MembreProjet } from './entities/membre-projet.entity';
import { Projet } from '../projets/entities/projet.entity';
import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MembreProjet, Projet, Utilisateur])],
  controllers: [MembresProjetsController],
  providers: [MembresProjetsService],
  exports: [MembresProjetsService],
})
export class MembresProjetsModule {}