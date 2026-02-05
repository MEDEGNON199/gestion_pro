import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utilisateur } from '../../utilisateurs/entities/utilisateur.entity';

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
  socketId?: string;
}

export interface UserActivity {
  type: 'task_view' | 'task_edit' | 'typing' | 'idle';
  taskId?: string;
  timestamp: Date;
}

@Injectable()
export class PresenceManager {
  private readonly logger = new Logger(PresenceManager.name);
  private userPresences: Map<string, UserPresence> = new Map(); // userId -> presence
  private projectPresences: Map<string, Set<string>> = new Map(); // projectId -> userIds
  private typingTimeouts: Map<string, NodeJS.Timeout> = new Map(); // userId -> timeout
  private idleTimeouts: Map<string, NodeJS.Timeout> = new Map(); // userId -> timeout

  private readonly IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes
  private readonly TYPING_TIMEOUT = 3 * 1000; // 3 secondes

  constructor(
    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>,
  ) {}

  async setUserOnline(userId: string, socketId: string): Promise<void> {
    try {
      const user = await this.utilisateurRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        this.logger.error(`Utilisateur non trouvé: ${userId}`);
        return;
      }

      const presence: UserPresence = {
        userId,
        username: user.email,
        prenom: user.prenom,
        nom: user.nom,
        avatar: user.avatar || user.avatar_url,
        status: 'online',
        lastActivity: new Date(),
        isTyping: false,
        socketId,
      };

      this.userPresences.set(userId, presence);

      // Démarrer le timer d'inactivité
      this.startIdleTimer(userId);

      this.logger.log(`Utilisateur ${userId} (${user.email}) marqué comme en ligne`);
      
    } catch (error) {
      this.logger.error(`Erreur setUserOnline: ${error.message}`);
    }
  }

  async setUserOffline(userId: string): Promise<void> {
    if (this.userPresences.has(userId)) {
      const presence = this.userPresences.get(userId);
      if (presence) {
        presence.status = 'offline';
        presence.lastActivity = new Date();
        presence.isTyping = false;
        presence.typingTaskId = undefined;
      }

      // Nettoyer les timers
      this.clearIdleTimer(userId);
      this.clearTypingTimer(userId);

      this.logger.log(`Utilisateur ${userId} marqué comme hors ligne`);
    }
  }

  async setUserIdle(userId: string): Promise<void> {
    if (this.userPresences.has(userId)) {
      const presence = this.userPresences.get(userId);
      if (presence) {
        presence.status = 'idle';
        presence.lastActivity = new Date();
      }

      this.logger.log(`Utilisateur ${userId} marqué comme inactif`);
    }
  }

  async updateUserActivity(userId: string, projectId: string, activity: UserActivity): Promise<void> {
    if (this.userPresences.has(userId)) {
      const presence = this.userPresences.get(userId);
      if (presence) {
        presence.lastActivity = activity.timestamp;
        presence.status = 'online';

        if (activity.type === 'task_view' || activity.type === 'task_edit') {
          presence.currentTask = activity.taskId;
        }
      }

      // Redémarrer le timer d'inactivité
      this.startIdleTimer(userId);

      // Ajouter l'utilisateur au projet s'il n'y est pas déjà
      if (!this.projectPresences.has(projectId)) {
        this.projectPresences.set(projectId, new Set());
      }
      const projectUsers = this.projectPresences.get(projectId);
      if (projectUsers) {
        projectUsers.add(userId);
      }
    }
  }

  async setUserTyping(userId: string, projectId: string, taskId: string): Promise<void> {
    if (this.userPresences.has(userId)) {
      const presence = this.userPresences.get(userId);
      if (presence) {
        presence.isTyping = true;
        presence.typingTaskId = taskId;
        presence.lastActivity = new Date();
        presence.status = 'online';
      }

      // Redémarrer le timer d'inactivité
      this.startIdleTimer(userId);

      // Démarrer le timer pour arrêter automatiquement le statut "en train de taper"
      this.startTypingTimer(userId, projectId);

      this.logger.log(`Utilisateur ${userId} tape sur la tâche ${taskId}`);
    }
  }

  async clearUserTyping(userId: string, projectId: string): Promise<void> {
    if (this.userPresences.has(userId)) {
      const presence = this.userPresences.get(userId);
      if (presence) {
        presence.isTyping = false;
        presence.typingTaskId = undefined;
      }

      // Nettoyer le timer de frappe
      this.clearTypingTimer(userId);

      this.logger.log(`Utilisateur ${userId} a arrêté de taper`);
    }
  }

  getUserPresence(userId: string): UserPresence | undefined {
    return this.userPresences.get(userId);
  }

  async getActiveUsersInProject(projectId: string): Promise<UserPresence[]> {
    if (!this.projectPresences.has(projectId)) {
      return [];
    }

    const userIds = this.projectPresences.get(projectId);
    if (!userIds) {
      return [];
    }

    const activeUsers: UserPresence[] = [];

    for (const userId of Array.from(userIds)) {
      const presence = this.userPresences.get(userId);
      if (presence && presence.status !== 'offline') {
        activeUsers.push({ ...presence }); // Copie pour éviter les mutations
      }
    }

    return activeUsers;
  }

  getAllUserPresences(): UserPresence[] {
    return Array.from(this.userPresences.values());
  }

  // Méthodes privées pour gérer les timers
  private startIdleTimer(userId: string): void {
    // Nettoyer le timer existant
    this.clearIdleTimer(userId);

    // Démarrer un nouveau timer
    const timeout = setTimeout(() => {
      this.setUserIdle(userId);
    }, this.IDLE_TIMEOUT);

    this.idleTimeouts.set(userId, timeout);
  }

  private clearIdleTimer(userId: string): void {
    if (this.idleTimeouts.has(userId)) {
      clearTimeout(this.idleTimeouts.get(userId));
      this.idleTimeouts.delete(userId);
    }
  }

  private startTypingTimer(userId: string, projectId: string): void {
    // Nettoyer le timer existant
    this.clearTypingTimer(userId);

    // Démarrer un nouveau timer
    const timeout = setTimeout(() => {
      this.clearUserTyping(userId, projectId);
    }, this.TYPING_TIMEOUT);

    this.typingTimeouts.set(userId, timeout);
  }

  private clearTypingTimer(userId: string): void {
    if (this.typingTimeouts.has(userId)) {
      clearTimeout(this.typingTimeouts.get(userId));
      this.typingTimeouts.delete(userId);
    }
  }

  // Méthode de nettoyage pour les utilisateurs déconnectés
  cleanupOfflineUsers(): void {
    const now = new Date();
    const offlineThreshold = 10 * 60 * 1000; // 10 minutes

    for (const [userId, presence] of this.userPresences.entries()) {
      if (presence.status === 'offline' && 
          (now.getTime() - presence.lastActivity.getTime()) > offlineThreshold) {
        
        this.userPresences.delete(userId);
        this.clearIdleTimer(userId);
        this.clearTypingTimer(userId);

        // Retirer de tous les projets
        for (const [projectId, userIds] of this.projectPresences.entries()) {
          userIds.delete(userId);
          if (userIds.size === 0) {
            this.projectPresences.delete(projectId);
          }
        }

        this.logger.log(`Nettoyage de l'utilisateur hors ligne: ${userId}`);
      }
    }
  }

  getPresenceStats(): { totalOnline: number; totalIdle: number; totalOffline: number } {
    let totalOnline = 0;
    let totalIdle = 0;
    let totalOffline = 0;

    for (const presence of this.userPresences.values()) {
      switch (presence.status) {
        case 'online':
          totalOnline++;
          break;
        case 'idle':
          totalIdle++;
          break;
        case 'offline':
          totalOffline++;
          break;
      }
    }

    return { totalOnline, totalIdle, totalOffline };
  }
}