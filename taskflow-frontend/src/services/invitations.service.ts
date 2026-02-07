import api from './api';

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
    const response = await api.post(
      `/invitations/projets/${projetId}/inviter`,
      { email, role }
    );
    return response.data;
  },

  // Récupérer les invitations d'un projet
  getInvitationsByProjet: async (projetId: string) => {
    const response = await api.get(`/invitations/projets/${projetId}`);
    return response.data;
  },

  // Récupérer mes invitations
  getMesInvitations: async (): Promise<Invitation[]> => {
    const response = await api.get('/invitations/mes-invitations');
    return response.data;
  },

  // Accepter une invitation
  accepter: async (token: string) => {
    const response = await api.post(`/invitations/${token}/accepter`, {});
    return response.data;
  },

  // Refuser une invitation
  refuser: async (token: string) => {
    const response = await api.post(`/invitations/${token}/refuser`, {});
    return response.data;
  },

  // Annuler une invitation (propriétaire)
  annuler: async (invitationId: string) => {
    const response = await api.delete(`/invitations/${invitationId}`);
    return response.data;
  },
};