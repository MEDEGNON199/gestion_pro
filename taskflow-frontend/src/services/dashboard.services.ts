import api from './api';

export interface DashboardStats {
  projetsActifs: number;
  tachesEnCours: number;
  tachesTerminees: number;
  tauxCompletion: number;
  progressionMensuelle: {
    mois: string;
    taches: number;
    completees: number;
  }[];
  repartitionTaches: {
    aFaire: number;
    enCours: number;
    terminees: number;
  };
  activitesRecentes: any[];
  tachesProchaines: any[];
}

export const dashboardService = {
  // Récupérer toutes les stats du dashboard
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};