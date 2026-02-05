import {
  WebSocketGateway as WSGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';
import { RoomManager } from './services/room.manager';
import { PresenceManager } from './services/presence.manager';
import { EventManager } from './services/event.manager';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: Utilisateur;
}

@Injectable()
@WSGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class WebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebSocketGateway.name);

  constructor(
    private jwtService: JwtService,
    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>,
    private roomManager: RoomManager,
    private presenceManager: PresenceManager,
    private eventManager: EventManager,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = this.extractTokenFromSocket(client);
      const user = await this.validateJwtToken(token);
      
      client.userId = user.id;
      client.user = user;
      
      this.logger.log(`Client connecté: ${user.email} (${client.id})`);
      
      // Mark user as online
      await this.presenceManager.setUserOnline(user.id, client.id);
      
    } catch (error) {
      this.logger.error(`Connexion refusée: ${error.message}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.logger.log(`Client déconnecté: ${client.userId} (${client.id})`);
      
      // Mark user as offline
      await this.presenceManager.setUserOffline(client.userId);
      
      // Quitter toutes les salles
      await this.roomManager.removeUserFromAllRooms(client.userId);
    }
  }

  @SubscribeMessage('join-project')
  async handleJoinProject(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { projectId: string },
  ) {
    try {
      if (!client.userId) {
        throw new UnauthorizedException('Non authentifié');
      }

      // Vérifier que l'utilisateur a accès au projet
      const hasAccess = await this.verifyProjectAccess(client.userId, data.projectId);
      if (!hasAccess) {
        throw new UnauthorizedException('Accès au projet refusé');
      }

      // Rejoindre la salle du projet
      await client.join(`project-${data.projectId}`);
      await this.roomManager.addUserToRoom(client.userId, data.projectId, client.id);

      // Notifier les autres membres de la connexion
      client.to(`project-${data.projectId}`).emit('user-joined', {
        userId: client.userId,
        user: client.user ? {
          id: client.user.id,
          prenom: client.user.prenom,
          nom: client.user.nom,
          email: client.user.email,
        } : null,
        timestamp: new Date(),
      });

      // Envoyer la liste des utilisateurs présents
      const activeUsers = await this.presenceManager.getActiveUsersInProject(data.projectId);
      client.emit('active-users', activeUsers);

      this.logger.log(`Utilisateur ${client.userId} a rejoint le projet ${data.projectId}`);
      
    } catch (error) {
      this.logger.error(`Erreur join-project: ${error.message}`);
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('leave-project')
  async handleLeaveProject(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { projectId: string },
  ) {
    try {
      if (!client.userId) return;

      await client.leave(`project-${data.projectId}`);
      await this.roomManager.removeUserFromRoom(client.userId, data.projectId);

      // Notifier les autres membres de la déconnexion
      client.to(`project-${data.projectId}`).emit('user-left', {
        userId: client.userId,
        timestamp: new Date(),
      });

      this.logger.log(`Utilisateur ${client.userId} a quitté le projet ${data.projectId}`);
      
    } catch (error) {
      this.logger.error(`Erreur leave-project: ${error.message}`);
    }
  }

  @SubscribeMessage('user-typing')
  async handleUserTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { projectId: string; taskId: string },
  ) {
    if (!client.userId) return;

    // Notifier les autres utilisateurs que cet utilisateur tape
    client.to(`project-${data.projectId}`).emit('user-typing', {
      userId: client.userId,
      taskId: data.taskId,
      user: client.user ? {
        prenom: client.user.prenom,
        nom: client.user.nom,
      } : null,
      timestamp: new Date(),
    });

    // Mettre à jour le statut de frappe
    await this.presenceManager.setUserTyping(client.userId, data.projectId, data.taskId);
  }

  @SubscribeMessage('user-stopped-typing')
  async handleUserStoppedTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { projectId: string },
  ) {
    if (!client.userId) return;

    // Notifier les autres utilisateurs que cet utilisateur a arrêté de taper
    client.to(`project-${data.projectId}`).emit('user-stopped-typing', {
      userId: client.userId,
      timestamp: new Date(),
    });

    // Effacer le statut de frappe
    await this.presenceManager.clearUserTyping(client.userId, data.projectId);
  }

  // Méthodes utilitaires
  private extractTokenFromSocket(client: Socket): string {
    const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
    
    if (!token) {
      throw new UnauthorizedException('Token JWT manquant');
    }
    
    return token;
  }

  private async validateJwtToken(token: string): Promise<Utilisateur> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.utilisateurRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Token JWT invalide');
    }
  }

  private async verifyProjectAccess(userId: string, projectId: string): Promise<boolean> {
    // TODO: Implémenter la vérification d'accès au projet
    // Pour l'instant, on autorise tous les utilisateurs authentifiés
    return true;
  }

  // Méthodes publiques pour émettre des événements depuis d'autres services
  emitToProject(projectId: string, event: string, data: any) {
    this.server.to(`project-${projectId}`).emit(event, data);
  }

  emitToUser(userId: string, event: string, data: any) {
    // Trouver le socket de l'utilisateur et lui envoyer l'événement
    const userSockets = this.roomManager.getUserSockets(userId);
    userSockets.forEach(socketId => {
      this.server.to(socketId).emit(event, data);
    });
  }
}