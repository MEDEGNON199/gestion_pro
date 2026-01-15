import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { MembresProjetsService } from './membres-projets.service';
import { AddMembreDto } from './dto/add-membre.dto';
import { UpdateMembreDto } from './dto/update-membre.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';

@Controller('membres-projets')
@UseGuards(JwtAuthGuard)
export class MembresProjetsController {
  constructor(private readonly membresProjetsService: MembresProjetsService) {}

  @Post()
  addMembre(@Body() addMembreDto: AddMembreDto, @CurrentUser() user: Utilisateur) {
    return this.membresProjetsService.addMembre(addMembreDto, user);
  }

  @Get()
  findAllByProjet(@Query('projet_id') projetId: string, @CurrentUser() user: Utilisateur) {
    return this.membresProjetsService.findAllByProjet(projetId, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: Utilisateur) {
    return this.membresProjetsService.findOne(id, user);
  }

  @Patch(':id')
  updateRole(
    @Param('id') id: string,
    @Body() updateMembreDto: UpdateMembreDto,
    @CurrentUser() user: Utilisateur,
  ) {
    return this.membresProjetsService.updateRole(id, updateMembreDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: Utilisateur) {
    return this.membresProjetsService.remove(id, user);
  }
}