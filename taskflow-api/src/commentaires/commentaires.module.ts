import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentairesService } from './commentaires.service';
import { CommentairesController } from './commentaires.controller';
import { Commentaire } from './entities/commentaire.entity';
import { Tache } from '../taches/entities/tache.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Commentaire, Tache]),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [CommentairesController],
  providers: [CommentairesService],
  exports: [CommentairesService],
})
export class CommentairesModule {}