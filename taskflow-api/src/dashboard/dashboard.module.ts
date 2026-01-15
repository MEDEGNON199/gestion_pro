import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Projet } from '../projets/entities/projet.entity';
import { Tache } from '../taches/entities/tache.entity';
import { MembreProjet } from '../membres-projets/entities/membre-projet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Projet, 
      Tache, 
      MembreProjet,  // ⬅️ C'était ça qui manquait !
    ])
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}