import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tache, StatutTache } from './entities/tache.entity';
import { Projet } from '../projets/entities/projet.entity';
import { CreateTacheDto } from './dto/create-tache.dto';
import { UpdateTacheDto } from './dto/update-tache.dto';
import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';

@Injectable()
export class TachesService {
  constructor(
    @InjectRepository(Tache)
    private tacheRepository: Repository<Tache>,
    @InjectRepository(Projet)
    private projetRepository: Repository<Projet>,
  ) {}

  async create(createTacheDto: CreateTacheDto, utilisateur: Utilisateur) {
    const projet = await this.projetRepository.findOne({
      where: { id: createTacheDto.projet_id },
    });

    if (!projet) {
      throw new NotFoundException('Projet non trouvé');
    }

    if (projet.proprietaire_id !== utilisateur.id) {
      throw new ForbiddenException('Vous n\'avez pas accès à ce projet');
    }

    const nouvelleTache = this.tacheRepository.create({
      ...createTacheDto,
      cree_par: utilisateur.id,
    });

    return await this.tacheRepository.save(nouvelleTache);
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

    return await this.tacheRepository.find({
      where: { projet_id: projetId },
      relations: ['utilisateur_assigne', 'createur'],
      order: { position: 'ASC', date_creation: 'DESC' },
    });
  }

  async findOne(id: string, utilisateur: Utilisateur) {
    const tache = await this.tacheRepository.findOne({
      where: { id },
      relations: ['projet', 'utilisateur_assigne', 'createur'],
    });

    if (!tache) {
      throw new NotFoundException('Tâche non trouvée');
    }

    if (tache.projet.proprietaire_id !== utilisateur.id) {
      throw new ForbiddenException('Vous n\'avez pas accès à cette tâche');
    }

    return tache;
  }

  async update(id: string, updateTacheDto: UpdateTacheDto, utilisateur: Utilisateur) {
    const tache = await this.findOne(id, utilisateur);

    Object.assign(tache, updateTacheDto);

    if (updateTacheDto.statut === StatutTache.TERMINEE && !tache.date_completion) {
      tache.date_completion = new Date();
    }

    if (updateTacheDto.statut && updateTacheDto.statut !== StatutTache.TERMINEE) {
      tache.date_completion = null as any;
    }

    return await this.tacheRepository.save(tache);
  }

  async remove(id: string, utilisateur: Utilisateur) {
    const tache = await this.findOne(id, utilisateur);

    await this.tacheRepository.remove(tache);

    return { message: 'Tâche supprimée avec succès' };
  }

  async completer(id: string, utilisateur: Utilisateur) {
    const tache = await this.findOne(id, utilisateur);

    tache.statut = StatutTache.TERMINEE;
    tache.date_completion = new Date();

    await this.tacheRepository.save(tache);

    return { message: 'Tâche marquée comme terminée', tache };
  }

  async assigner(id: string, utilisateurId: string, utilisateur: Utilisateur) {
    const tache = await this.findOne(id, utilisateur);

    tache.assigne_a = utilisateurId;

    await this.tacheRepository.save(tache);

    return { message: 'Tâche assignée avec succès', tache };
  }

  async addEtiquette(tacheId: string, etiquetteId: string, utilisateur: Utilisateur) {
    const tache = await this.tacheRepository.findOne({
      where: { id: tacheId },
      relations: ['projet', 'etiquettes'],
    });

    if (!tache) {
      throw new NotFoundException('Tâche non trouvée');
    }

    if (tache.projet.proprietaire_id !== utilisateur.id) {
      throw new ForbiddenException('Vous n\'avez pas accès à cette tâche');
    }

    const etiquetteRepository = this.tacheRepository.manager.getRepository('etiquettes');
    
    const etiquette = await etiquetteRepository.findOne({
      where: { id: etiquetteId },
    });

    if (!etiquette) {
      throw new NotFoundException('Étiquette non trouvée');
    }

    if ((etiquette as any).projet_id !== tache.projet_id) {
      throw new ForbiddenException('L\'étiquette n\'appartient pas au même projet que la tâche');
    }

    const dejaAssignee = tache.etiquettes.some(e => e.id === etiquetteId);
    if (dejaAssignee) {
      throw new ConflictException('Cette étiquette est déjà assignée à la tâche');
    }

    tache.etiquettes.push(etiquette as any);
    await this.tacheRepository.save(tache);

    return { message: 'Étiquette ajoutée à la tâche avec succès', tache };
  }

  async removeEtiquette(tacheId: string, etiquetteId: string, utilisateur: Utilisateur) {
    const tache = await this.tacheRepository.findOne({
      where: { id: tacheId },
      relations: ['projet', 'etiquettes'],
    });

    if (!tache) {
      throw new NotFoundException('Tâche non trouvée');
    }

    if (tache.projet.proprietaire_id !== utilisateur.id) {
      throw new ForbiddenException('Vous n\'avez pas accès à cette tâche');
    }

    tache.etiquettes = tache.etiquettes.filter(e => e.id !== etiquetteId);
    await this.tacheRepository.save(tache);

    return { message: 'Étiquette retirée de la tâche avec succès', tache };
  }

  async getEtiquettes(tacheId: string, utilisateur: Utilisateur) {
    const tache = await this.tacheRepository.findOne({
      where: { id: tacheId },
      relations: ['projet', 'etiquettes'],
    });

    if (!tache) {
      throw new NotFoundException('Tâche non trouvée');
    }

    if (tache.projet.proprietaire_id !== utilisateur.id) {
      throw new ForbiddenException('Vous n\'avez pas accès à cette tâche');
    }

    return tache.etiquettes;
  }
}