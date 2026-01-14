import axios from 'axios';

const API_URL = 'http://localhost:3000';

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
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};