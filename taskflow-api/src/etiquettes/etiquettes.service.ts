import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Etiquette } from './entities/etiquette.entity';
import { Projet } from '../projets/entities/projet.entity';
import { CreateEtiquetteDto } from './dto/create-etiquette.dto';
import { UpdateEtiquetteDto } from './dto/update-etiquette.dto';
import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';

@Injectable()
export class EtiquettesService {
  constructor(
    @InjectRepository(Etiquette)
    private etiquetteRepository: Repository<Etiquette>,
    @InjectRepository(Projet)
    private projetRepository: Repository<Projet>,
  ) {}

  async create(createEtiquetteDto: CreateEtiquetteDto, utilisateur: Utilisateur) {
    const projet = await this.projetRepository.findOne({
      where: { id: createEtiquetteDto.projet_id },
    });

    if (!projet) {
      throw new NotFoundException('Projet non trouvé');
    }

    if (projet.proprietaire_id !== utilisateur.id) {
      throw new ForbiddenException('Vous n\'avez pas accès à ce projet');
    }

    const nouvelleEtiquette = this.etiquetteRepository.create(createEtiquetteDto);

    return await this.etiquetteRepository.save(nouvelleEtiquette);
  }

  async findAllByProjet(projetId: string, utilisateur: Utilisateur) {
    const projet = await this.projetRepository.findOne({
      where: { id: projetId },
    });

    if (!projet) {
      throw new NotFoundException('Projet non trouvé');
    }

    if (projet.proprietaire_id !== utilisateur.id) {
      throw new ForbiddenException('Vous n\'avez pas accès à ce projet');
    }

    return await this.etiquetteRepository.find({
      where: { projet_id: projetId },
      order: { nom: 'ASC' },
    });
  }

  async findOne(id: string, utilisateur: Utilisateur) {
    const etiquette = await this.etiquetteRepository.findOne({
      where: { id },
      relations: ['projet'],
    });

    if (!etiquette) {
      throw new NotFoundException('Étiquette non trouvée');
    }

    if (etiquette.projet.proprietaire_id !== utilisateur.id) {
      throw new ForbiddenException('Vous n\'avez pas accès à cette étiquette');
    }

    return etiquette;
  }

  async update(id: string, updateEtiquetteDto: UpdateEtiquetteDto, utilisateur: Utilisateur) {
    const etiquette = await this.findOne(id, utilisateur);

    Object.assign(etiquette, updateEtiquetteDto);

    return await this.etiquetteRepository.save(etiquette);
  }

  async remove(id: string, utilisateur: Utilisateur) {
    const etiquette = await this.findOne(id, utilisateur);

    await this.etiquetteRepository.remove(etiquette);

    return { message: 'Étiquette supprimée avec succès' };
  }
}