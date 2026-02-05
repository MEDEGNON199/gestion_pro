import api from './api';
import { Utilisateur } from '../types';

export interface MembreProjet {
  id: string;
  projet_id: string;
  utilisateur_id: string;
  role: 'PROPRIETAIRE' | 'ADMIN' | 'MEMBRE';
  date_ajout: string;
  utilisateur: Utilisateur;
}

export const membresProjetsService = {
  async getByProjet(projetId: string): Promise<MembreProjet[]> {
    const response = await api.get(`/membres-projets?projet_id=${projetId}`);
    return response.data;
  },
};