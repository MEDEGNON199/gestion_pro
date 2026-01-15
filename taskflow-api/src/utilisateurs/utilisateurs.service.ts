import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utilisateur } from './entities/utilisateur.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilisateursService {
  constructor(
    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>,
  ) {}

  async updateProfil(
    userId: string,
    updateData: { prenom?: string; nom?: string; email?: string },
  ) {
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { id: userId },
    });

    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (updateData.email && updateData.email !== utilisateur.email) {
      const emailExiste = await this.utilisateurRepository.findOne({
        where: { email: updateData.email },
      });

      if (emailExiste) {
        throw new BadRequestException('Cet email est déjà utilisé');
      }
    }

    // Mettre à jour les champs
    if (updateData.prenom) utilisateur.prenom = updateData.prenom;
    if (updateData.nom) utilisateur.nom = updateData.nom;
    if (updateData.email) utilisateur.email = updateData.email;

    await this.utilisateurRepository.save(utilisateur);

    // Retourner sans le mot de passe
    const { mot_de_passe, ...result } = utilisateur;
    return result;
  }

  async changePassword(
    userId: string,
    passwordData: { ancien_mot_de_passe: string; nouveau_mot_de_passe: string },
  ) {
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { id: userId },
    });

    if (!utilisateur) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Vérifier l'ancien mot de passe
    const isValidPassword = await bcrypt.compare(
      passwordData.ancien_mot_de_passe,
      utilisateur.mot_de_passe,
    );

    if (!isValidPassword) {
      throw new BadRequestException('Mot de passe actuel incorrect');
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(passwordData.nouveau_mot_de_passe, 10);
    utilisateur.mot_de_passe = hashedPassword;

    await this.utilisateurRepository.save(utilisateur);

    return { message: 'Mot de passe modifié avec succès' };
  }
}