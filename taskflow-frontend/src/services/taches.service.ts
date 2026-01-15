import api from './api';

// ✅ Remplacer enum par const
export const StatutTache = {
  A_FAIRE: 'A_FAIRE',
  EN_COURS: 'EN_COURS',
  TERMINEE: 'TERMINEE',
} as const;

export type StatutTache = typeof StatutTache[keyof typeof StatutTache];

export const PrioriteTache = {
  BASSE: 'BASSE',
  MOYENNE: 'MOYENNE',
  HAUTE: 'HAUTE',
} as const;

export type PrioriteTache = typeof PrioriteTache[keyof typeof PrioriteTache];

export interface Tache {
  id: string;
  titre: string;
  description?: string;
  projet_id: string;
  assigne_a?: string;
  cree_par: string;
  statut: StatutTache;
  priorite: PrioriteTache;
  date_echeance?: string;
  date_completion?: string;
  position: number;
  date_creation: string;
  date_modification: string;
}

export interface CreateTacheDto {
  titre: string;
  description?: string;
  projet_id: string;
  assigne_a?: string;
  statut?: StatutTache;
  priorite?: PrioriteTache;
  date_echeance?: string;
  position?: number;
}

export interface UpdateTacheDto {
  titre?: string;
  description?: string;
  assigne_a?: string;
  statut?: StatutTache;
  priorite?: PrioriteTache;
  date_echeance?: string;
  position?: number;
}

export const tachesService = {
  getAllByProjet: async (projetId: string): Promise<Tache[]> => {
    const response = await api.get(`/taches?projet_id=${projetId}`);
    return response.data;
  },

  getOne: async (id: string): Promise<Tache> => {
    const response = await api.get(`/taches/${id}`);
    return response.data;
  },

  create: async (data: CreateTacheDto): Promise<Tache> => {
    const response = await api.post('/taches', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTacheDto): Promise<Tache> => {
    const response = await api.patch(`/taches/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/taches/${id}`);
  },

  completer: async (id: string): Promise<Tache> => {
    const response = await api.patch(`/taches/${id}/completer`);
    return response.data;
  },

  assigner: async (id: string, utilisateurId: string): Promise<Tache> => {
    const response = await api.patch(`/taches/${id}/assigner`, {
      utilisateur_id: utilisateurId,
    });
    return response.data;
  },
};