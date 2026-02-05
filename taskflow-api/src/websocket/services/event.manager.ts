import { Injectable, Logger } from '@nestjs/common';

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

export interface ProjectEvent {
  id: string;
  type: 'member_joined' | 'member_left' | 'member_invited';
  projectId: string;
  userId: string;
  targetUserId?: string;
  userName: string;
  targetUserName?: string;
  timestamp: Date;
  data?: Record<string, any>;
}

export interface CommentEvent {
  id: string;
  type: 'comment_added' | 'comment_updated' | 'comment_deleted';
  taskId: string;
  projectId: string;
  commentId: string;
  userId: string;
  userName: string;
  timestamp: Date;
  data: {
    content?: string;
    previousContent?: string;
  };
}

@Injectable()
export class EventManager {
  private readonly logger = new Logger(EventManager.name);
  private eventHistory: Map<string, (TaskEvent | ProjectEvent | CommentEvent)[]> = new Map(); // projectId -> events
  private readonly MAX_HISTORY_SIZE = 100;

  // Événements de tâches
  createTaskEvent(eventData: Omit<TaskEvent, 'id' | 'timestamp'>): TaskEvent {
    const event: TaskEvent = {
      ...eventData,
      id: this.generateEventId(),
      timestamp: new Date(),
    };

    this.addEventToHistory(event.projectId, event);
    this.logger.log(`Événement tâche créé: ${event.type} pour la tâche ${event.taskId}`);
    
    return event;
  }

  createProjectEvent(eventData: Omit<ProjectEvent, 'id' | 'timestamp'>): ProjectEvent {
    const event: ProjectEvent = {
      ...eventData,
      id: this.generateEventId(),
      timestamp: new Date(),
    };

    this.addEventToHistory(event.projectId, event);
    this.logger.log(`Événement projet créé: ${event.type} pour le projet ${event.projectId}`);
    
    return event;
  }

  createCommentEvent(eventData: Omit<CommentEvent, 'id' | 'timestamp'>): CommentEvent {
    const event: CommentEvent = {
      ...eventData,
      id: this.generateEventId(),
      timestamp: new Date(),
    };

    this.addEventToHistory(event.projectId, event);
    this.logger.log(`Événement commentaire créé: ${event.type} pour la tâche ${event.taskId}`);
    
    return event;
  }

  // Méthodes pour créer des événements spécifiques
  handleTaskCreated(taskData: {
    taskId: string;
    projectId: string;
    userId: string;
    userName: string;
    title: string;
    status: string;
    assigneeId?: string;
    assigneeName?: string;
  }): TaskEvent {
    return this.createTaskEvent({
      type: 'created',
      taskId: taskData.taskId,
      projectId: taskData.projectId,
      userId: taskData.userId,
      userName: taskData.userName,
      data: {
        title: taskData.title,
        status: taskData.status,
        assigneeId: taskData.assigneeId,
        assigneeName: taskData.assigneeName,
      },
    });
  }

  handleTaskUpdated(taskData: {
    taskId: string;
    projectId: string;
    userId: string;
    userName: string;
    changes: Record<string, any>;
  }): TaskEvent {
    return this.createTaskEvent({
      type: 'updated',
      taskId: taskData.taskId,
      projectId: taskData.projectId,
      userId: taskData.userId,
      userName: taskData.userName,
      data: {
        changes: taskData.changes,
        ...taskData.changes, // Inclure les changements directement
      },
    });
  }

  handleTaskDeleted(taskData: {
    taskId: string;
    projectId: string;
    userId: string;
    userName: string;
    title: string;
  }): TaskEvent {
    return this.createTaskEvent({
      type: 'deleted',
      taskId: taskData.taskId,
      projectId: taskData.projectId,
      userId: taskData.userId,
      userName: taskData.userName,
      data: {
        title: taskData.title,
      },
    });
  }

  handleTaskMoved(taskData: {
    taskId: string;
    projectId: string;
    userId: string;
    userName: string;
    newStatus: string;
    newPosition: number;
    previousStatus: string;
    previousPosition: number;
    title: string;
  }): TaskEvent {
    return this.createTaskEvent({
      type: 'moved',
      taskId: taskData.taskId,
      projectId: taskData.projectId,
      userId: taskData.userId,
      userName: taskData.userName,
      data: {
        title: taskData.title,
        status: taskData.newStatus,
        position: taskData.newPosition,
        previousStatus: taskData.previousStatus,
        previousPosition: taskData.previousPosition,
      },
    });
  }

  handleTaskAssigned(taskData: {
    taskId: string;
    projectId: string;
    userId: string;
    userName: string;
    assigneeId: string;
    assigneeName: string;
    previousAssigneeId?: string;
    title: string;
  }): TaskEvent {
    return this.createTaskEvent({
      type: 'assigned',
      taskId: taskData.taskId,
      projectId: taskData.projectId,
      userId: taskData.userId,
      userName: taskData.userName,
      data: {
        title: taskData.title,
        assigneeId: taskData.assigneeId,
        assigneeName: taskData.assigneeName,
        previousAssigneeId: taskData.previousAssigneeId,
      },
    });
  }

  handleMemberJoined(projectData: {
    projectId: string;
    userId: string;
    userName: string;
    targetUserId: string;
    targetUserName: string;
  }): ProjectEvent {
    return this.createProjectEvent({
      type: 'member_joined',
      projectId: projectData.projectId,
      userId: projectData.userId,
      userName: projectData.userName,
      targetUserId: projectData.targetUserId,
      targetUserName: projectData.targetUserName,
    });
  }

  handleMemberLeft(projectData: {
    projectId: string;
    userId: string;
    userName: string;
    targetUserId: string;
    targetUserName: string;
  }): ProjectEvent {
    return this.createProjectEvent({
      type: 'member_left',
      projectId: projectData.projectId,
      userId: projectData.userId,
      userName: projectData.userName,
      targetUserId: projectData.targetUserId,
      targetUserName: projectData.targetUserName,
    });
  }

  handleCommentAdded(commentData: {
    taskId: string;
    projectId: string;
    commentId: string;
    userId: string;
    userName: string;
    content: string;
  }): CommentEvent {
    return this.createCommentEvent({
      type: 'comment_added',
      taskId: commentData.taskId,
      projectId: commentData.projectId,
      commentId: commentData.commentId,
      userId: commentData.userId,
      userName: commentData.userName,
      data: {
        content: commentData.content,
      },
    });
  }

  // Méthodes utilitaires
  getProjectEventHistory(projectId: string, limit: number = 50): (TaskEvent | ProjectEvent | CommentEvent)[] {
    if (!this.eventHistory.has(projectId)) {
      return [];
    }

    const events = this.eventHistory.get(projectId);
    if (!events) {
      return [];
    }
    
    return events.slice(-limit).reverse(); // Les plus récents en premier
  }

  getTaskEventHistory(projectId: string, taskId: string, limit: number = 20): TaskEvent[] {
    const allEvents = this.getProjectEventHistory(projectId, this.MAX_HISTORY_SIZE);
    return allEvents
      .filter((event): event is TaskEvent => 'taskId' in event && event.taskId === taskId)
      .slice(0, limit);
  }

  clearProjectHistory(projectId: string): void {
    this.eventHistory.delete(projectId);
    this.logger.log(`Historique effacé pour le projet ${projectId}`);
  }

  getEventStats(): { totalProjects: number; totalEvents: number; averageEventsPerProject: number } {
    const totalProjects = this.eventHistory.size;
    const totalEvents = Array.from(this.eventHistory.values())
      .reduce((total, events) => total + events.length, 0);
    const averageEventsPerProject = totalProjects > 0 ? totalEvents / totalProjects : 0;

    return { totalProjects, totalEvents, averageEventsPerProject };
  }

  // Méthodes privées
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private addEventToHistory(projectId: string, event: TaskEvent | ProjectEvent | CommentEvent): void {
    if (!this.eventHistory.has(projectId)) {
      this.eventHistory.set(projectId, []);
    }

    const events = this.eventHistory.get(projectId);
    if (!events) return;
    
    events.push(event);

    // Limiter la taille de l'historique
    if (events.length > this.MAX_HISTORY_SIZE) {
      events.splice(0, events.length - this.MAX_HISTORY_SIZE);
    }
  }

  // Méthode de nettoyage périodique
  cleanupOldEvents(): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7); // Garder 7 jours d'historique

    for (const [projectId, events] of this.eventHistory.entries()) {
      const filteredEvents = events.filter(event => event.timestamp > cutoffDate);
      
      if (filteredEvents.length === 0) {
        this.eventHistory.delete(projectId);
      } else {
        this.eventHistory.set(projectId, filteredEvents);
      }
    }

    this.logger.log('Nettoyage des anciens événements effectué');
  }
}