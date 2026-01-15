import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TachesService } from './taches.service';
import { CreateTacheDto } from './dto/create-tache.dto';
import { UpdateTacheDto } from './dto/update-tache.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';

@Controller('taches')
@UseGuards(JwtAuthGuard)
export class TachesController {
  constructor(private readonly tachesService: TachesService) {}

  @Post()
  create(@Body() createTacheDto: CreateTacheDto, @CurrentUser() user: Utilisateur) {
    return this.tachesService.create(createTacheDto, user);
  }

  @Get()
  findAllByProjet(@Query('projet_id') projetId: string, @CurrentUser() user: Utilisateur) {
    return this.tachesService.findAllByProjet(projetId, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: Utilisateur) {
    return this.tachesService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTacheDto: UpdateTacheDto,
    @CurrentUser() user: Utilisateur,
  ) {
    return this.tachesService.update(id, updateTacheDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: Utilisateur) {
    return this.tachesService.remove(id, user);
  }

  @Patch(':id/completer')
  completer(@Param('id') id: string, @CurrentUser() user: Utilisateur) {
    return this.tachesService.completer(id, user);
  }

  @Patch(':id/assigner')
  assigner(
    @Param('id') id: string,
    @Body('utilisateur_id') utilisateurId: string,
    @CurrentUser() user: Utilisateur,
  ) {
    return this.tachesService.assigner(id, utilisateurId, user);
  }
  @Post(':id/etiquettes/:etiquetteId')
  addEtiquette(
    @Param('id') id: string,
    @Param('etiquetteId') etiquetteId: string,
    @CurrentUser() user: Utilisateur,
  ) {
    return this.tachesService.addEtiquette(id, etiquetteId, user);
  }

  @Delete(':id/etiquettes/:etiquetteId')
  removeEtiquette(
    @Param('id') id: string,
    @Param('etiquetteId') etiquetteId: string,
    @CurrentUser() user: Utilisateur,
  ) {
    return this.tachesService.removeEtiquette(id, etiquetteId, user);
  }

  @Get(':id/etiquettes')
  getEtiquettes(@Param('id') id: string, @CurrentUser() user: Utilisateur) {
    return this.tachesService.getEtiquettes(id, user);
  }
}