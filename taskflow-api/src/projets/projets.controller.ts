import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProjetsService } from './projets.service';
import { CreateProjetDto } from './dto/create-projet.dto';
import { UpdateProjetDto } from './dto/update-projet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';

@Controller('projets')
@UseGuards(JwtAuthGuard)
export class ProjetsController {
  constructor(private readonly projetsService: ProjetsService) {}

  @Post()
  create(@Body() createProjetDto: CreateProjetDto, @CurrentUser() user: Utilisateur) {
    return this.projetsService.create(createProjetDto, user);
  }

  @Get()
  findAll(@CurrentUser() user: Utilisateur) {
    return this.projetsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: Utilisateur) {
    return this.projetsService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjetDto: UpdateProjetDto,
    @CurrentUser() user: Utilisateur,
  ) {
    return this.projetsService.update(id, updateProjetDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: Utilisateur) {
    return this.projetsService.remove(id, user);
  }

  @Patch(':id/archiver')
  archiver(@Param('id') id: string, @CurrentUser() user: Utilisateur) {
    return this.projetsService.archiver(id, user);
  }

  @Patch(':id/desarchiver')
  desarchiver(@Param('id') id: string, @CurrentUser() user: Utilisateur) {
    return this.projetsService.desarchiver(id, user);
  }
}