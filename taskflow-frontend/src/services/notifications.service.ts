import api from './api';

export interface Notification {
  id: string;
  type: 'INVITATION' | 'TACHE_ASSIGNEE' | 'COMMENTAIRE' | 'TACHE_TERMINEE' | 'MEMBRE_AJOUTE';
  message: string;
  est_lue: boolean;
  projet_id?: string;
  tache_id?: string;
  invitation_id?: string;
  date_creation: string;
  projet?: {
    id: string;
    nom: string;
  };
  tache?: {
    id: string;
    titre: string;
  };
}

export const notificationsService = {
  async getAll(): Promise<Notification[]> {
    const response = await api.get('/notifications');
    return response.data;
  },

  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  async markAsRead(notificationId: string): Promise<void> {
    await api.patch(`/notifications/${notificationId}/lire`);
  },

  async markAllAsRead(): Promise<void> {
    await api.patch('/notifications/tout-lire');
  },
};
