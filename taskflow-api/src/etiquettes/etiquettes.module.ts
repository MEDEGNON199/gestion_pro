import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtiquettesService } from './etiquettes.service';
import { EtiquettesController } from './etiquettes.controller';
import { Etiquette } from './entities/etiquette.entity';
import { Projet } from '../projets/entities/projet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Etiquette, Projet])],
  controllers: [EtiquettesController],
  providers: [EtiquettesService],
  exports: [EtiquettesService],
})
export class EtiquettesModule {}