import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TachesService } from './taches.service';
import { TachesController } from './taches.controller';
import { Tache } from './entities/tache.entity';
import { Projet } from '../projets/entities/projet.entity';
import { Etiquette } from '../etiquettes/entities/etiquette.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tache, Projet, Etiquette]),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [TachesController],
  providers: [TachesService],
  exports: [TachesService],
})
export class TachesModule {}
