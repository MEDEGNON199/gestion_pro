import api from './api';

export interface Projet {
  id: string;
  nom: string;
  description?: string;
  couleur: string;
  icone: string;
  proprietaire_id: string;
  est_archive: boolean;
  date_creation: string;
  date_modification: string;
}

export interface CreateProjetDto {
  nom: string;
  description?: string;
  couleur?: string;
  icone?: string;
}

export interface UpdateProjetDto {
  nom?: string;
  description?: string;
  couleur?: string;
  icone?: string;
  est_archive?: boolean;
}

export const projetsService = {
  getAll: async (): Promise<Projet[]> => {
    const response = await api.get('/projets');
    return response.data;
  },

  getOne: async (id: string): Promise<Projet> => {
    const response = await api.get(`/projets/${id}`);
    return response.data;
  },

  create: async (data: CreateProjetDto): Promise<Projet> => {
    const response = await api.post('/projets', data);
    return response.data;
  },

  update: async (id: string, data: UpdateProjetDto): Promise<Projet> => {
    const response = await api.patch(`/projets/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projets/${id}`);
  },

  archiver: async (id: string): Promise<Projet> => {
    const response = await api.patch(`/projets/${id}/archiver`);
    return response.data;
  },

  desarchiver: async (id: string): Promise<Projet> => {
    const response = await api.patch(`/projets/${id}/desarchiver`);
    return response.data;
  },
};