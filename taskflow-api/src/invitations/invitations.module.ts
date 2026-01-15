import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { Invitation } from './entities/invitation.entity';
import { Projet } from '../projets/entities/projet.entity';
import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';
import { MembreProjet } from '../membres-projets/entities/membre-projet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invitation, Projet, Utilisateur, MembreProjet]),
  ],
  controllers: [InvitationsController],
  providers: [InvitationsService],
  exports: [InvitationsService],
})
export class InvitationsModule {}