import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projet } from '../projets/entities/projet.entity';
import { Tache } from '../taches/entities/tache.entity';
import { MembreProjet } from '../membres-projets/entities/membre-projet.entity';
import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';

export interface ProgressionMensuelle {
  mois: string;
  taches: number;
  completees: number;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Projet)
    private projetRepository: Repository<Projet>,
    @InjectRepository(Tache)
    private tacheRepository: Repository<Tache>,
    @InjectRepository(MembreProjet)
    private membreProjetRepository: Repository<MembreProjet>,
  ) {}

  async getStats(utilisateur: Utilisateur) {
    try {
      // Projets dont l'utilisateur est propriétaire (non archivés)
      const projetsProprietaire = await this.projetRepository.count({
        where: { 
          proprietaire_id: utilisateur.id,
          est_archive: false,
        },
      });

      // Projets dont l'utilisateur est membre
      const membresProjets = await this.membreProjetRepository.find({
        where: { utilisateur_id: utilisateur.id },
        relations: ['projet'],
      });

      // Filtrer les projets non archivés
      const projetsMembre = membresProjets.filter(m => m.projet && !m.projet.est_archive).length;

      const projetsActifs = projetsProprietaire + projetsMembre;

      // Récupérer les IDs des projets de l'utilisateur
      const projetsIds = await this.getProjetIdsForUser(utilisateur.id);

      // Tâches de l'utilisateur
      let tachesUtilisateur: Tache[] = [];
      if (projetsIds.length > 0) {
        tachesUtilisateur = await this.tacheRepository
          .createQueryBuilder('tache')
          .where('tache.projet_id IN (:...projetsIds)', { projetsIds })
          .getMany();
      }

      // Répartition des tâches
      const tachesEnCours = tachesUtilisateur.filter(t => t.statut === 'EN_COURS').length;
      const tachesTerminees = tachesUtilisateur.filter(t => t.statut === 'TERMINEE').length;
      const tachesAFaire = tachesUtilisateur.filter(t => t.statut === 'A_FAIRE').length;

      // Taux de complétion
      const totalTaches = tachesUtilisateur.length;
      const tauxCompletion = totalTaches > 0 
        ? Math.round((tachesTerminees / totalTaches) * 100) 
        : 0;

      // Progression mensuelle (6 derniers mois)
      const progressionMensuelle = await this.getProgressionMensuelle(projetsIds);

      // Tâches à venir (avec échéance dans les 7 prochains jours)
      const maintenant = new Date();
      const dans7Jours = new Date();
      dans7Jours.setDate(maintenant.getDate() + 7);

      let tachesProchaines: any[] = [];
      if (projetsIds.length > 0) {
        const tachesProches = await this.tacheRepository
          .createQueryBuilder('tache')
          .leftJoinAndSelect('tache.projet', 'projet')
          .where('tache.projet_id IN (:...projetsIds)', { projetsIds })
          .andWhere('tache.date_echeance IS NOT NULL')
          .andWhere('tache.date_echeance BETWEEN :maintenant AND :dans7Jours', {
            maintenant,
            dans7Jours,
          })
          .andWhere('tache.statut != :statut', { statut: 'TERMINEE' })
          .orderBy('tache.date_echeance', 'ASC')
          .limit(5)
          .getMany();

        tachesProchaines = tachesProches.map(tache => ({
          id: tache.id,
          titre: tache.titre,
          projet: tache.projet?.nom || 'Projet inconnu',
          echeance: this.getEcheanceRelative(tache.date_echeance),
          priorite: tache.priorite,
        }));
      }

      // Activités récentes (dernières tâches créées/modifiées)
      let activitesRecentes: any[] = [];
      if (projetsIds.length > 0) {
        const dernieresTaches = await this.tacheRepository
          .createQueryBuilder('tache')
          .leftJoinAndSelect('tache.projet', 'projet')
          .where('tache.projet_id IN (:...projetsIds)', { projetsIds })
          .orderBy('tache.date_modification', 'DESC')
          .limit(5)
          .getMany();

        activitesRecentes = dernieresTaches.map(tache => ({
          id: tache.id,
          action: this.getActionText(tache),
          projet: tache.projet?.nom || 'Projet inconnu',
          temps: this.getTempsRelatif(tache.date_modification),
          type: this.getActionType(tache),
        }));
      }

      return {
        projetsActifs,
        tachesEnCours,
        tachesTerminees,
        tauxCompletion,
        progressionMensuelle,
        repartitionTaches: {
          aFaire: tachesAFaire,
          enCours: tachesEnCours,
          terminees: tachesTerminees,
        },
        activitesRecentes,
        tachesProchaines,
      };
    } catch (error) {
      console.error('Erreur dans getStats:', error);
      throw error;
    }
  }

  private async getProjetIdsForUser(userId: string): Promise<string[]> {
    // Projets dont l'utilisateur est propriétaire
    const projetsProprietaire = await this.projetRepository.find({
      where: { proprietaire_id: userId },
      select: ['id'],
    });

    // Projets dont l'utilisateur est membre
    const projetsMembre = await this.membreProjetRepository.find({
      where: { utilisateur_id: userId },
      select: ['projet_id'],
    });

    const idsProprietaire = projetsProprietaire.map(p => p.id);
    const idsMembre = projetsMembre.map(m => m.projet_id);

    // Combiner et dédupliquer
    return [...new Set([...idsProprietaire, ...idsMembre])];
  }

  private async getProgressionMensuelle(projetsIds: string[]): Promise<ProgressionMensuelle[]> {
    const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const maintenant = new Date();
    const progression: ProgressionMensuelle[] = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(maintenant.getFullYear(), maintenant.getMonth() - i, 1);
      const moisSuivant = new Date(maintenant.getFullYear(), maintenant.getMonth() - i + 1, 1);

      let taches: Tache[] = [];
      if (projetsIds.length > 0) {
        taches = await this.tacheRepository
          .createQueryBuilder('tache')
          .where('tache.projet_id IN (:...projetsIds)', { projetsIds })
          .andWhere('tache.date_creation >= :debut', { debut: date })
          .andWhere('tache.date_creation < :fin', { fin: moisSuivant })
          .getMany();
      }

      const completees = taches.filter(t => t.statut === 'TERMINEE').length;

      progression.push({
        mois: mois[date.getMonth()],
        taches: taches.length,
        completees,
      });
    }

    return progression;
  }

  private getActionText(tache: any): string {
    const maintenant = new Date();
    const creation = new Date(tache.date_creation);

    if (tache.statut === 'TERMINEE') {
      return 'a complété une tâche';
    } else if (maintenant.getTime() - creation.getTime() < 3600000) { // moins d'1h
      return 'a créé une tâche';
    } else {
      return 'a modifié une tâche';
    }
  }

  private getActionType(tache: any): string {
    if (tache.statut === 'TERMINEE') return 'complete';
    const maintenant = new Date();
    const creation = new Date(tache.date_creation);
    if (maintenant.getTime() - creation.getTime() < 3600000) {
      return 'create';
    }
    return 'comment';
  }

  private getTempsRelatif(date: Date): string {
    const maintenant = new Date();
    const diff = maintenant.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const heures = Math.floor(diff / 3600000);
    const jours = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (heures < 24) return `Il y a ${heures}h`;
    return `Il y a ${jours} jour${jours > 1 ? 's' : ''}`;
  }

  private getEcheanceRelative(date: Date): string {
    const maintenant = new Date();
    const echeance = new Date(date);
    const diff = echeance.getTime() - maintenant.getTime();
    const jours = Math.ceil(diff / 86400000);

    if (jours === 0) return 'Aujourd\'hui';
    if (jours === 1) return 'Demain';
    if (jours < 0) return 'En retard';
    return `${jours} jours`;
  }
}