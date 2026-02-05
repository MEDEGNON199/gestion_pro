import { Injectable, Logger } from '@nestjs/common';

interface UserRoom {
  userId: string;
  projectId: string;
  socketId: string;
  joinedAt: Date;
}

@Injectable()
export class RoomManager {
  private readonly logger = new Logger(RoomManager.name);
  private userRooms: Map<string, UserRoom[]> = new Map(); // userId -> rooms
  private projectUsers: Map<string, Set<string>> = new Map(); // projectId -> userIds
  private userSockets: Map<string, Set<string>> = new Map(); // userId -> socketIds

  async addUserToRoom(userId: string, projectId: string, socketId: string): Promise<void> {
    // Ajouter à la map des salles utilisateur
    if (!this.userRooms.has(userId)) {
      this.userRooms.set(userId, []);
    }
    
    const userRoomsList = this.userRooms.get(userId);
    if (!userRoomsList) return;
    
    const existingRoom = userRoomsList.find(room => room.projectId === projectId);
    
    if (!existingRoom) {
      userRoomsList.push({
        userId,
        projectId,
        socketId,
        joinedAt: new Date(),
      });
    }

    // Ajouter à la map des utilisateurs par projet
    if (!this.projectUsers.has(projectId)) {
      this.projectUsers.set(projectId, new Set());
    }
    const projectUserSet = this.projectUsers.get(projectId);
    if (projectUserSet) {
      projectUserSet.add(userId);
    }

    // Ajouter à la map des sockets utilisateur
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    const userSocketSet = this.userSockets.get(userId);
    if (userSocketSet) {
      userSocketSet.add(socketId);
    }

    this.logger.log(`Utilisateur ${userId} ajouté à la salle du projet ${projectId}`);
  }

  async removeUserFromRoom(userId: string, projectId: string): Promise<void> {
    // Retirer de la map des salles utilisateur
    if (this.userRooms.has(userId)) {
      const userRoomsList = this.userRooms.get(userId);
      if (userRoomsList) {
        const roomIndex = userRoomsList.findIndex(room => room.projectId === projectId);
        
        if (roomIndex !== -1) {
          userRoomsList.splice(roomIndex, 1);
          
          if (userRoomsList.length === 0) {
            this.userRooms.delete(userId);
          }
        }
      }
    }

    // Retirer de la map des utilisateurs par projet
    if (this.projectUsers.has(projectId)) {
      const projectUserSet = this.projectUsers.get(projectId);
      if (projectUserSet) {
        projectUserSet.delete(userId);
        
        if (projectUserSet.size === 0) {
          this.projectUsers.delete(projectId);
        }
      }
    }

    this.logger.log(`Utilisateur ${userId} retiré de la salle du projet ${projectId}`);
  }

  async removeUserFromAllRooms(userId: string): Promise<void> {
    if (this.userRooms.has(userId)) {
      const userRoomsList = this.userRooms.get(userId);
      if (userRoomsList) {
        // Retirer l'utilisateur de tous ses projets
        for (const room of userRoomsList) {
          if (this.projectUsers.has(room.projectId)) {
            const projectUserSet = this.projectUsers.get(room.projectId);
            if (projectUserSet) {
              projectUserSet.delete(userId);
              
              if (projectUserSet.size === 0) {
                this.projectUsers.delete(room.projectId);
              }
            }
          }
        }
      }
      
      this.userRooms.delete(userId);
    }

    // Nettoyer les sockets de l'utilisateur
    this.userSockets.delete(userId);

    this.logger.log(`Utilisateur ${userId} retiré de toutes les salles`);
  }

  getUsersInRoom(projectId: string): string[] {
    if (this.projectUsers.has(projectId)) {
      const userSet = this.projectUsers.get(projectId);
      return userSet ? Array.from(userSet) : [];
    }
    return [];
  }

  getUserRooms(userId: string): string[] {
    if (this.userRooms.has(userId)) {
      const userRoomsList = this.userRooms.get(userId);
      return userRoomsList ? userRoomsList.map(room => room.projectId) : [];
    }
    return [];
  }

  getUserSockets(userId: string): string[] {
    if (this.userSockets.has(userId)) {
      const socketSet = this.userSockets.get(userId);
      return socketSet ? Array.from(socketSet) : [];
    }
    return [];
  }

  isUserInRoom(userId: string, projectId: string): boolean {
    if (this.projectUsers.has(projectId)) {
      const userSet = this.projectUsers.get(projectId);
      return userSet ? userSet.has(userId) : false;
    }
    return false;
  }

  getRoomStats(): { totalRooms: number; totalUsers: number; totalConnections: number } {
    const totalRooms = this.projectUsers.size;
    const totalUsers = this.userRooms.size;
    const totalConnections = Array.from(this.userSockets.values())
      .reduce((total, sockets) => total + sockets.size, 0);

    return { totalRooms, totalUsers, totalConnections };
  }

  // Méthode pour nettoyer les connexions orphelines
  cleanupOrphanedConnections(): void {
    // Cette méthode peut être appelée périodiquement pour nettoyer
    // les connexions qui ne sont plus valides
    this.logger.log('Nettoyage des connexions orphelines...');
    
    // Logique de nettoyage ici si nécessaire
  }
}