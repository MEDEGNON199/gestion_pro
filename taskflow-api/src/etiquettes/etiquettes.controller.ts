import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { EtiquettesService } from './etiquettes.service';
import { CreateEtiquetteDto } from './dto/create-etiquette.dto';
import { UpdateEtiquetteDto } from './dto/update-etiquette.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';

@Controller('etiquettes')
@UseGuards(JwtAuthGuard)
export class EtiquettesController {
  constructor(private readonly etiquettesService: EtiquettesService) {}

  @Post()
  create(@Body() createEtiquetteDto: CreateEtiquetteDto, @CurrentUser() user: Utilisateur) {
    return this.etiquettesService.create(createEtiquetteDto, user);
  }

  @Get()
  findAllByProjet(@Query('projet_id') projetId: string, @CurrentUser() user: Utilisateur) {
    return this.etiquettesService.findAllByProjet(projetId, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: Utilisateur) {
    return this.etiquettesService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEtiquetteDto: UpdateEtiquetteDto,
    @CurrentUser() user: Utilisateur,
  ) {
    return this.etiquettesService.update(id, updateEtiquetteDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: Utilisateur) {
    return this.etiquettesService.remove(id, user);
  }
}