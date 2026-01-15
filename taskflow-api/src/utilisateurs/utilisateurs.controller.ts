import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UtilisateursService } from './utilisateurs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Utilisateur } from './entities/utilisateur.entity';

@Controller('utilisateurs')
@UseGuards(JwtAuthGuard)
export class UtilisateursController {
  constructor(private readonly utilisateursService: UtilisateursService) {}

  @Patch('profil')
  async updateProfil(
    @Body() updateData: { prenom?: string; nom?: string; email?: string },
    @CurrentUser() user: Utilisateur,
  ) {
    return this.utilisateursService.updateProfil(user.id, updateData);
  }

  @Patch('mot-de-passe')
  async changePassword(
    @Body() passwordData: { ancien_mot_de_passe: string; nouveau_mot_de_passe: string },
    @CurrentUser() user: Utilisateur,
  ) {
    return this.utilisateursService.changePassword(user.id, passwordData);
  }
}