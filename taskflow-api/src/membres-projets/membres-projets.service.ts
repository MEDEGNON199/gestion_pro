import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembreProjet, RoleProjet } from './entities/membre-projet.entity';
import { Projet } from '../projets/entities/projet.entity';
import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';
import { AddMembreDto } from './dto/add-membre.dto';
import { UpdateMembreDto } from './dto/update-membre.dto';

@Injectable()
export class MembresProjetsService {
  constructor(
    @InjectRepository(MembreProjet)
    private membreProjetRepository: Repository<MembreProjet>,
    @InjectRepository(Projet)
    private projetRepository: Repository<Projet>,
    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>,
  ) {}

  async addMembre(addMembreDto: AddMembreDto, utilisateur: Utilisateur) {
    const projet = await this.projetRepository.findOne({
      where: { id: addMembreDto.projet_id },
    });

    if (!projet) {
      throw new NotFoundException('Projet non trouvé');
    }

    if (projet.proprietaire_id !== utilisateur.id) {
      throw new ForbiddenException('Seul le propriétaire peut ajouter des membres');
    }

    const utilisateurAjouter = await this.utilisateurRepository.findOne({
      where: { id: addMembreDto.utilisateur_id },
    });

    if (!utilisateurAjouter) {
      throw new NotFoundException('Utilisateur à ajouter non trouvé');
    }

    const membreExistant = await this.membreProjetRepository.findOne({
      where: {
        projet_id: addMembreDto.projet_id,
        utilisateur_id: addMembreDto.utilisateur_id,
      },
    });

    if (membreExistant) {
      throw new ConflictException('Cet utilisateur est déjà membre du projet');
    }

    const nouveauMembre = this.membreProjetRepository.create({
      projet_id: addMembreDto.projet_id,
      utilisateur_id: addMembreDto.utilisateur_id,
      role: addMembreDto.role || RoleProjet.MEMBRE,
    });

    return await this.membreProjetRepository.save(nouveauMembre);
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

    return await this.membreProjetRepository.find({
      where: { projet_id: projetId },
      relations: ['utilisateur'],
      order: { date_ajout: 'DESC' },
    });
  }

  async findOne(id: string, utilisateur: Utilisateur) {
    const membre = await this.membreProjetRepository.findOne({
      where: { id },
      relations: ['projet', 'utilisateur'],
    });

    if (!membre) {
      throw new NotFoundException('Membre non trouvé');
    }

    if (membre.projet.proprietaire_id !== utilisateur.id) {
      throw new ForbiddenException('Vous n\'avez pas accès à ce membre');
    }

    return membre;
  }

  async updateRole(id: string, updateMembreDto: UpdateMembreDto, utilisateur: Utilisateur) {
    const membre = await this.findOne(id, utilisateur);

    if (membre.role === RoleProjet.PROPRIETAIRE) {
      throw new ForbiddenException('Impossible de modifier le rôle du propriétaire');
    }

    membre.role = updateMembreDto.role;

    return await this.membreProjetRepository.save(membre);
  }

  async remove(id: string, utilisateur: Utilisateur) {
    const membre = await this.findOne(id, utilisateur);

    if (membre.role === RoleProjet.PROPRIETAIRE) {
      throw new ForbiddenException('Impossible de retirer le propriétaire du projet');
    }

    await this.membreProjetRepository.remove(membre);

    return { message: 'Membre retiré du projet avec succès' };
  }
}