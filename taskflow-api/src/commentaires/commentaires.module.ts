import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentairesService } from './commentaires.service';
import { CommentairesController } from './commentaires.controller';
import { Commentaire } from './entities/commentaire.entity';
import { Tache } from '../taches/entities/tache.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Commentaire, Tache])],
  controllers: [CommentairesController],
  providers: [CommentairesService],
  exports: [CommentairesService],
})
export class CommentairesModule {}