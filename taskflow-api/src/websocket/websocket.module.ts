import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebSocketGateway } from './websocket.gateway';
import { RoomManager } from './services/room.manager';
import { PresenceManager } from './services/presence.manager';
import { EventManager } from './services/event.manager';
import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Utilisateur]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  providers: [
    WebSocketGateway,
    RoomManager,
    PresenceManager,
    EventManager,
  ],
  exports: [
    WebSocketGateway,
    RoomManager,
    PresenceManager,
    EventManager,
  ],
})
export class WebSocketModule {}