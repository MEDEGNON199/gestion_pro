import { io, Socket } from 'socket.io-client';

export interface TaskEvent {
  id: string;
  type: 'created' | 'updated' | 'deleted' | 'moved' | 'assigned';
  taskId: string;
  projectId: string;
  userId: string;
  userName: string;
  timestamp: Date;
  data: {
    title?: string;
    description?: string;
    status?: string;
    assigneeId?: string;
    assigneeName?: string;
    position?: number;
    previousStatus?: string;
    previousPosition?: number;
    previousAssigneeId?: string;
    changes?: Record<string, any>;
  };
}

export interface UserPresence {
  userId: string;
  username: string;
  prenom: string;
  nom: string;
  avatar?: string;
  status: 'online' | 'idle' | 'offline';
  lastActivity: Date;
  currentTask?: string;
  isTyping: boolean;
  typingTaskId?: string;
}

export interface ToastNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  duration: number;
  actions?: any[];
}

export interface UserTypingEvent {
  userId: string;
  taskId: string;
  user: {
    prenom: string;
    nom: string;
  };
  timestamp: Date;
}

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // 1 seconde
  private isConnecting = false;
  private currentProjectId: string | null = null;

  // Callbacks pour les événements
  private eventCallbacks: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeEventCallbacks();
  }

  private initializeEventCallbacks() {
    // Initialiser les callbacks pour tous les événements
    const events = [
      'task-updated',
      'task-created', 
      'task-deleted',
      'task-moved',
      'task-assigned',
      'user-presence-changed',
      'notification-received',
      'user-joined',
      'user-left',
      'user-typing',
      'user-stopped-typing',
      'active-users',
      'error',
      'connect',
      'disconnect',
      'reconnect',
    ];

    events.forEach(event => {
      this.eventCallbacks.set(event, []);
    });
  }

  async connect(token: string): Promise<void> {
    if (this.socket?.connected || this.isConnecting) {
      console.log('WebSocket déjà connecté ou en cours de connexion');
      return;
    }

    this.isConnecting = true;

    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      this.socket = io(backendUrl, {
        auth: {
          token: token,
        },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        reconnectionDelayMax: 5000,
      });

      this.setupEventListeners();

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout de connexion WebSocket'));
        }, 10000);

        this.socket!.on('connect', () => {
          clearTimeout(timeout);
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          console.log('✅ WebSocket connecté:', this.socket!.id);
          this.triggerCallbacks('connect', { socketId: this.socket!.id });
          resolve();
        });

        this.socket!.on('connect_error', (error) => {
          clearTimeout(timeout);
          this.isConnecting = false;
          console.error('❌ WebSocket connection error:', error);
          reject(error);
        });
      });

    } catch (error) {
      this.isConnecting = false;
      console.error('❌ Error creating socket:', error);
      throw error;
    }
  }

  disconnect(): void {
    if (this.socket) {
      console.log('🔌 Déconnexion WebSocket');
      this.socket.disconnect();
      this.socket = null;
      this.currentProjectId = null;
      this.isConnecting = false;
    }
  }

  async reconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Nombre maximum de tentatives de reconnexion atteint');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 5000);
    
    console.log(`🔄 Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts} dans ${delay}ms`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await this.connect(token);
      }
    } catch (error) {
      console.error('❌ Échec de la reconnexion:', error);
      // La reconnexion automatique continuera via les événements Socket.IO
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Événements de connexion
    this.socket.on('disconnect', (reason) => {
      console.log('🔌 WebSocket déconnecté:', reason);
      this.triggerCallbacks('disconnect', { reason });
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 WebSocket reconnecté après', attemptNumber, 'tentatives');
      this.triggerCallbacks('reconnect', { attemptNumber });
      
      // Rejoindre le projet actuel si on était dans un projet
      if (this.currentProjectId) {
        this.joinProject(this.currentProjectId);
      }
    });

    // Événements de tâches
    this.socket.on('task-created', (data: TaskEvent) => {
      console.log('📝 Tâche créée:', data);
      this.triggerCallbacks('task-created', data);
    });

    this.socket.on('task-updated', (data: TaskEvent) => {
      console.log('✏️ Tâche mise à jour:', data);
      this.triggerCallbacks('task-updated', data);
    });

    this.socket.on('task-deleted', (data: TaskEvent) => {
      console.log('🗑️ Tâche supprimée:', data);
      this.triggerCallbacks('task-deleted', data);
    });

    this.socket.on('task-moved', (data: TaskEvent) => {
      console.log('🔄 Tâche déplacée:', data);
      this.triggerCallbacks('task-moved', data);
    });

    this.socket.on('task-assigned', (data: TaskEvent) => {
      console.log('👤 Tâche assignée:', data);
      this.triggerCallbacks('task-assigned', data);
    });

    // Événements de présence
    this.socket.on('user-joined', (data) => {
      console.log('👋 Utilisateur rejoint:', data);
      this.triggerCallbacks('user-joined', data);
    });

    this.socket.on('user-left', (data) => {
      console.log('👋 Utilisateur parti:', data);
      this.triggerCallbacks('user-left', data);
    });

    this.socket.on('active-users', (data: UserPresence[]) => {
      console.log('👥 Utilisateurs actifs:', data);
      this.triggerCallbacks('active-users', data);
    });

    this.socket.on('user-typing', (data: UserTypingEvent) => {
      console.log('⌨️ Utilisateur tape:', data);
      this.triggerCallbacks('user-typing', data);
    });

    this.socket.on('user-stopped-typing', (data) => {
      console.log('⌨️ Utilisateur arrêté de taper:', data);
      this.triggerCallbacks('user-stopped-typing', data);
    });

    // Événements de notifications
    this.socket.on('notification-received', (data: ToastNotification) => {
      console.log('🔔 Notification reçue:', data);
      this.triggerCallbacks('notification-received', data);
    });

    // Error handling
    this.socket.on('error', (error) => {
      console.error('❌ WebSocket error:', error);
      this.triggerCallbacks('error', error);
    });
  }

  // Méthodes pour rejoindre/quitter des projets
  joinProject(projectId: string): void {
    if (!this.socket?.connected) {
      console.warn('⚠️ Socket non connecté, impossible de rejoindre le projet');
      return;
    }

    this.currentProjectId = projectId;
    this.socket.emit('join-project', { projectId });
    console.log('🏠 Rejoint le projet:', projectId);
  }

  leaveProject(projectId: string): void {
    if (!this.socket?.connected) return;

    this.socket.emit('leave-project', { projectId });
    if (this.currentProjectId === projectId) {
      this.currentProjectId = null;
    }
    console.log('🚪 Quitté le projet:', projectId);
  }

  // Méthodes pour émettre des événements
  emitUserTyping(taskId: string): void {
    if (!this.socket?.connected || !this.currentProjectId) return;

    this.socket.emit('user-typing', {
      projectId: this.currentProjectId,
      taskId,
    });
  }

  emitUserStoppedTyping(): void {
    if (!this.socket?.connected || !this.currentProjectId) return;

    this.socket.emit('user-stopped-typing', {
      projectId: this.currentProjectId,
    });
  }

  // Méthodes pour s'abonner aux événements
  on(event: string, callback: Function): void {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, []);
    }
    this.eventCallbacks.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    if (this.eventCallbacks.has(event)) {
      const callbacks = this.eventCallbacks.get(event)!;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private triggerCallbacks(event: string, data: any): void {
    if (this.eventCallbacks.has(event)) {
      this.eventCallbacks.get(event)!.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in callback ${event}:`, error);
        }
      });
    }
  }

  // Méthodes utilitaires
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }

  getCurrentProject(): string | null {
    return this.currentProjectId;
  }

  getConnectionStats() {
    return {
      connected: this.isConnected(),
      socketId: this.getSocketId(),
      currentProject: this.currentProjectId,
      reconnectAttempts: this.reconnectAttempts,
    };
  }
}

// Instance singleton
export const websocketService = new WebSocketService();
export default websocketService;