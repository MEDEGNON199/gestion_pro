import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CommentairesService } from './commentaires.service';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';
import { UpdateCommentaireDto } from './dto/update-commentaire.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';

@Controller('commentaires')
@UseGuards(JwtAuthGuard)
export class CommentairesController {
  constructor(private readonly commentairesService: CommentairesService) {}

  @Post()
  create(@Body() createCommentaireDto: CreateCommentaireDto, @CurrentUser() user: Utilisateur) {
    return this.commentairesService.create(createCommentaireDto, user);
  }

  @Get()
  findAllByTache(@Query('tache_id') tacheId: string, @CurrentUser() user: Utilisateur) {
    return this.commentairesService.findAllByTache(tacheId, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: Utilisateur) {
    return this.commentairesService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentaireDto: UpdateCommentaireDto,
    @CurrentUser() user: Utilisateur,
  ) {
    return this.commentairesService.update(id, updateCommentaireDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: Utilisateur) {
    return this.commentairesService.remove(id, user);
  }
}