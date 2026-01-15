import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projet } from './entities/projet.entity';
import { CreateProjetDto } from './dto/create-projet.dto';
import { UpdateProjetDto } from './dto/update-projet.dto';
import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';

@Injectable()
export class ProjetsService {
  constructor(
    @InjectRepository(Projet)
    private projetRepository: Repository<Projet>,
  ) {}

  async create(createProjetDto: CreateProjetDto, utilisateur: Utilisateur) {
    const nouveauProjet = this.projetRepository.create({
      ...createProjetDto,
      proprietaire_id: utilisateur.id,
    });

    return await this.projetRepository.save(nouveauProjet);
  }

  async findAll(utilisateur: Utilisateur) {
    return await this.projetRepository.find({
      where: { proprietaire_id: utilisateur.id },
      order: { date_creation: 'DESC' },
    });
  }

  async findOne(id: string, utilisateur: Utilisateur) {
    const projet = await this.projetRepository.findOne({
      where: { id },
      relations: ['proprietaire'],
    });

    if (!projet) {
      throw new NotFoundException('Projet non trouvé');
    }

    if (projet.proprietaire_id !== utilisateur.id) {
      throw new ForbiddenException('Vous n\'avez pas accès à ce projet');
    }

    return projet;
  }

  async update(id: string, updateProjetDto: UpdateProjetDto, utilisateur: Utilisateur) {
    const projet = await this.findOne(id, utilisateur);

    Object.assign(projet, updateProjetDto);

    return await this.projetRepository.save(projet);
  }

  async remove(id: string, utilisateur: Utilisateur) {
    const projet = await this.findOne(id, utilisateur);

    await this.projetRepository.remove(projet);

    return { message: 'Projet supprimé avec succès' };
  }

  async archiver(id: string, utilisateur: Utilisateur) {
    const projet = await this.findOne(id, utilisateur);

    projet.est_archive = true;

    await this.projetRepository.save(projet);

    return { message: 'Projet archivé avec succès', projet };
  }

  async desarchiver(id: string, utilisateur: Utilisateur) {
    const projet = await this.findOne(id, utilisateur);

    projet.est_archive = false;

    await this.projetRepository.save(projet);

    return { message: 'Projet désarchivé avec succès', projet };
  }
}