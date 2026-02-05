import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useWebSocket, WebSocketState, WebSocketActions, WebSocketEvents } from '../hooks/useWebSocket';
import { useToast, ToastContainer } from '../components/ToastNotification';

interface WebSocketContextType {
  state: WebSocketState;
  actions: WebSocketActions;
  events: WebSocketEvents;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [state, actions, events] = useWebSocket();
  const toast = useToast();

  // Connexion automatique quand l'utilisateur est authentifié
  useEffect(() => {
    if (user && !state.connected && !state.connecting) {
      const token = localStorage.getItem('token');
      if (token) {
        actions.connect(token).catch((error) => {
          console.error('Erreur de connexion WebSocket:', error);
          toast.showError(
            'Connexion temps réel échouée',
            'Impossible de se connecter au serveur temps réel. Certaines fonctionnalités peuvent être limitées.'
          );
        });
      }
    }
  }, [user, state.connected, state.connecting, actions, toast]);

  // Déconnexion quand l'utilisateur se déconnecte
  useEffect(() => {
    if (!user && state.connected) {
      actions.disconnect();
    }
  }, [user, state.connected, actions]);

  // Configuration des notifications automatiques
  useEffect(() => {
    // Notifications pour les événements de tâches
    events.onTaskCreated((data) => {
      if (data.userId !== user?.id) {
        toast.showInfo(
          'Nouvelle tâche',
          `${data.userName} a créé la tâche "${data.data.title}"`
        );
      }
    });

    events.onTaskUpdated((data) => {
      if (data.userId !== user?.id) {
        toast.showInfo(
          'Tâche modifiée',
          `${data.userName} a modifié la tâche "${data.data.title || data.taskId}"`
        );
      }
    });

    events.onTaskDeleted((data) => {
      if (data.userId !== user?.id) {
        toast.showWarning(
          'Tâche supprimée',
          `${data.userName} a supprimé la tâche "${data.data.title}"`
        );
      }
    });

    events.onTaskMoved((data) => {
      if (data.userId !== user?.id) {
        toast.showInfo(
          'Tâche déplacée',
          `${data.userName} a déplacé "${data.data.title}" vers ${data.data.status}`
        );
      }
    });

    events.onTaskAssigned((data) => {
      if (data.data.assigneeId === user?.id) {
        toast.showSuccess(
          'Nouvelle assignation',
          `Vous avez été assigné à la tâche "${data.data.title}"`,
          {
            duration: 8000,
            actions: [
              {
                label: 'Voir la tâche',
                onClick: () => {
                  // TODO: Navigation vers la tâche
                  console.log('Navigation vers tâche:', data.taskId);
                },
                variant: 'primary',
              },
            ],
          }
        );
      } else if (data.userId !== user?.id) {
        toast.showInfo(
          'Tâche assignée',
          `${data.userName} a assigné "${data.data.title}" à ${data.data.assigneeName}`
        );
      }
    });

    // Notifications pour les événements de projet
    events.onUserJoined((data) => {
      if (data.userId !== user?.id) {
        toast.showInfo(
          'Nouveau membre',
          `${data.user.prenom} ${data.user.nom} a rejoint le projet`
        );
      }
    });

    events.onUserLeft((data) => {
      if (data.userId !== user?.id) {
        toast.showInfo(
          'Membre parti',
          `Un membre a quitté le projet`
        );
      }
    });

    // Notifications personnalisées du serveur
    events.onNotificationReceived((notification) => {
      toast.addNotification(notification);
    });

    // Notifications de connexion
    events.onActiveUsersChanged((users) => {
      console.log(`👥 ${users.length} utilisateur(s) actif(s) dans le projet`);
    });

  }, [events, user, toast]);

  // Gestion des erreurs de connexion
  useEffect(() => {
    if (state.error) {
      toast.showError(
        'Erreur de connexion',
        state.error,
        { duration: 8000 }
      );
    }
  }, [state.error, toast]);

  // Notification de reconnexion
  useEffect(() => {
    if (state.reconnectAttempts > 0) {
      toast.showSuccess(
        'Reconnecté',
        'La connexion temps réel a été rétablie',
        { duration: 3000 }
      );
    }
  }, [state.reconnectAttempts, toast]);

  const contextValue: WebSocketContextType = {
    state,
    actions,
    events,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
      <ToastContainer 
        notifications={toast.notifications} 
        onClose={toast.removeNotification} 
      />
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};

export default WebSocketContext;