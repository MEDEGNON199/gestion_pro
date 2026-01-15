import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TachesService } from './taches.service';
import { TachesController } from './taches.controller';
import { Tache } from './entities/tache.entity';
import { Projet } from '../projets/entities/projet.entity';
import { Etiquette } from '../etiquettes/entities/etiquette.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tache, Projet, Etiquette])],
  controllers: [TachesController],
  providers: [TachesService],
  exports: [TachesService],
})
export class TachesModule {}
