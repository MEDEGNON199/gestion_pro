import axios from 'axios';

const API_URL = 'http://localhost:3000';

export interface Invitation {
  id: string;
  projet_id: string;
  email: string;
  role: string;
  statut: string;
  date_creation: string;
  date_expiration: string;
  projet?: {
    id: string;
    nom: string;
  };
  inviteur?: {
    prenom: string;
    nom: string;
  };
}

export const invitationsService = {
  // Inviter un membre
  inviter: async (projetId: string, email: string, role: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/invitations/projets/${projetId}/inviter`,
      { email, role },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Récupérer les invitations d'un projet
  getInvitationsByProjet: async (projetId: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_URL}/invitations/projets/${projetId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Récupérer mes invitations
  getMesInvitations: async (): Promise<Invitation[]> => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/invitations/mes-invitations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Accepter une invitation
  accepter: async (token: string) => {
    const authToken = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/invitations/${token}/accepter`,
      {},
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    return response.data;
  },

  // Refuser une invitation
  refuser: async (token: string) => {
    const authToken = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/invitations/${token}/refuser`,
      {},
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    return response.data;
  },

  // Annuler une invitation (propriétaire)
  annuler: async (invitationId: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(
      `${API_URL}/invitations/${invitationId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
};