import { useEffect, useState, useCallback, useRef } from 'react';
import { websocketService, TaskEvent, UserPresence, ToastNotification } from '../services/websocket.service';

export interface WebSocketState {
  connected: boolean;
  connecting: boolean;
  error: string | null;
  socketId: string | undefined;
  currentProject: string | null;
  activeUsers: UserPresence[];
  reconnectAttempts: number;
}

export interface WebSocketActions {
  connect: (token: string) => Promise<void>;
  disconnect: () => void;
  joinProject: (projectId: string) => void;
  leaveProject: (projectId: string) => void;
  emitUserTyping: (taskId: string) => void;
  emitUserStoppedTyping: () => void;
}

export interface WebSocketEvents {
  onTaskCreated: (callback: (data: TaskEvent) => void) => void;
  onTaskUpdated: (callback: (data: TaskEvent) => void) => void;
  onTaskDeleted: (callback: (data: TaskEvent) => void) => void;
  onTaskMoved: (callback: (data: TaskEvent) => void) => void;
  onTaskAssigned: (callback: (data: TaskEvent) => void) => void;
  onUserJoined: (callback: (data: any) => void) => void;
  onUserLeft: (callback: (data: any) => void) => void;
  onUserTyping: (callback: (data: any) => void) => void;
  onUserStoppedTyping: (callback: (data: any) => void) => void;
  onNotificationReceived: (callback: (data: ToastNotification) => void) => void;
  onActiveUsersChanged: (callback: (users: UserPresence[]) => void) => void;
}

export function useWebSocket(): [WebSocketState, WebSocketActions, WebSocketEvents] {
  const [state, setState] = useState<WebSocketState>({
    connected: false,
    connecting: false,
    error: null,
    socketId: undefined,
    currentProject: null,
    activeUsers: [],
    reconnectAttempts: 0,
  });

  const callbacksRef = useRef<Map<string, Function[]>>(new Map());

  // Fonction pour mettre à jour l'état
  const updateState = useCallback((updates: Partial<WebSocketState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Actions
  const connect = useCallback(async (token: string) => {
    try {
      updateState({ connecting: true, error: null });
      await websocketService.connect(token);
      updateState({ 
        connected: true, 
        connecting: false,
        socketId: websocketService.getSocketId(),
      });
    } catch (error) {
      updateState({ 
        connected: false, 
        connecting: false, 
        error: error instanceof Error ? error.message : 'Connection error'
      });
      throw error;
    }
  }, [updateState]);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
    updateState({ 
      connected: false, 
      connecting: false,
      socketId: undefined,
      currentProject: null,
      activeUsers: [],
      reconnectAttempts: 0,
    });
  }, [updateState]);

  const joinProject = useCallback((projectId: string) => {
    websocketService.joinProject(projectId);
    updateState({ currentProject: projectId });
  }, [updateState]);

  const leaveProject = useCallback((projectId: string) => {
    websocketService.leaveProject(projectId);
    updateState({ currentProject: null, activeUsers: [] });
  }, [updateState]);

  const emitUserTyping = useCallback((taskId: string) => {
    websocketService.emitUserTyping(taskId);
  }, []);

  const emitUserStoppedTyping = useCallback(() => {
    websocketService.emitUserStoppedTyping();
  }, []);

  // Fonction helper pour gérer les callbacks
  const addCallback = useCallback((event: string, callback: Function) => {
    if (!callbacksRef.current.has(event)) {
      callbacksRef.current.set(event, []);
    }
    callbacksRef.current.get(event)!.push(callback);
    websocketService.on(event, callback);
  }, []);

  // Events
  const onTaskCreated = useCallback((callback: (data: TaskEvent) => void) => {
    addCallback('task-created', callback);
  }, [addCallback]);

  const onTaskUpdated = useCallback((callback: (data: TaskEvent) => void) => {
    addCallback('task-updated', callback);
  }, [addCallback]);

  const onTaskDeleted = useCallback((callback: (data: TaskEvent) => void) => {
    addCallback('task-deleted', callback);
  }, [addCallback]);

  const onTaskMoved = useCallback((callback: (data: TaskEvent) => void) => {
    addCallback('task-moved', callback);
  }, [addCallback]);

  const onTaskAssigned = useCallback((callback: (data: TaskEvent) => void) => {
    addCallback('task-assigned', callback);
  }, [addCallback]);

  const onUserJoined = useCallback((callback: (data: any) => void) => {
    addCallback('user-joined', callback);
  }, [addCallback]);

  const onUserLeft = useCallback((callback: (data: any) => void) => {
    addCallback('user-left', callback);
  }, [addCallback]);

  const onUserTyping = useCallback((callback: (data: any) => void) => {
    addCallback('user-typing', callback);
  }, [addCallback]);

  const onUserStoppedTyping = useCallback((callback: (data: any) => void) => {
    addCallback('user-stopped-typing', callback);
  }, [addCallback]);

  const onNotificationReceived = useCallback((callback: (data: ToastNotification) => void) => {
    addCallback('notification-received', callback);
  }, [addCallback]);

  const onActiveUsersChanged = useCallback((callback: (users: UserPresence[]) => void) => {
    addCallback('active-users', callback);
  }, [addCallback]);

  // Effet pour configurer les listeners de base
  useEffect(() => {
    // Listeners pour les événements de connexion
    const handleConnect = () => {
      updateState({ 
        connected: true, 
        connecting: false,
        error: null,
        socketId: websocketService.getSocketId(),
        reconnectAttempts: 0,
      });
    };

    const handleDisconnect = () => {
      updateState({ 
        connected: false,
        socketId: undefined,
      });
    };

    const handleReconnect = (data: { attemptNumber: number }) => {
      updateState({ 
        connected: true,
        reconnectAttempts: data.attemptNumber,
        error: null,
      });
    };

    const handleError = (error: any) => {
      updateState({ 
        error: error.message || 'WebSocket error',
        connecting: false,
      });
    };

    const handleActiveUsers = (users: UserPresence[]) => {
      updateState({ activeUsers: users });
    };

    // Ajouter les listeners
    websocketService.on('connect', handleConnect);
    websocketService.on('disconnect', handleDisconnect);
    websocketService.on('reconnect', handleReconnect);
    websocketService.on('error', handleError);
    websocketService.on('active-users', handleActiveUsers);

    // Cleanup
    return () => {
      websocketService.off('connect', handleConnect);
      websocketService.off('disconnect', handleDisconnect);
      websocketService.off('reconnect', handleReconnect);
      websocketService.off('error', handleError);
      websocketService.off('active-users', handleActiveUsers);

      // Nettoyer tous les callbacks enregistrés
      for (const [event, callbacks] of callbacksRef.current.entries()) {
        callbacks.forEach(callback => {
          websocketService.off(event, callback);
        });
      }
      callbacksRef.current.clear();
    };
  }, [updateState]);

  // Effet pour synchroniser l'état avec le service
  useEffect(() => {
    const interval = setInterval(() => {
      const stats = websocketService.getConnectionStats();
      setState(prev => ({
        ...prev,
        connected: stats.connected,
        socketId: stats.socketId,
        currentProject: stats.currentProject,
        reconnectAttempts: stats.reconnectAttempts,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const actions: WebSocketActions = {
    connect,
    disconnect,
    joinProject,
    leaveProject,
    emitUserTyping,
    emitUserStoppedTyping,
  };

  const events: WebSocketEvents = {
    onTaskCreated,
    onTaskUpdated,
    onTaskDeleted,
    onTaskMoved,
    onTaskAssigned,
    onUserJoined,
    onUserLeft,
    onUserTyping,
    onUserStoppedTyping,
    onNotificationReceived,
    onActiveUsersChanged,
  };

  return [state, actions, events];
}

export default useWebSocket;