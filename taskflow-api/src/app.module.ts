import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { UtilisateursModule } from './utilisateurs/utilisateurs.module';
import { ProjetsModule } from './projets/projets.module';
import { TachesModule } from './taches/taches.module';
import { MembresProjetsModule } from './membres-projets/membres-projets.module';
import { EtiquettesModule } from './etiquettes/etiquettes.module';
import { CommentairesModule } from './commentaires/commentaires.module';
import { AuthModule } from './auth/auth.module';
import { InvitationsModule } from './invitations/invitations.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { NotificationsModule } from './notifications/notifications.module';
import { WebSocketModule } from './websocket/websocket.module';
import { AuditModule } from './audit/audit.module';
import { Utilisateur } from './utilisateurs/entities/utilisateur.entity';
import { Projet } from './projets/entities/projet.entity';
import { Tache } from './taches/entities/tache.entity';
import { MembreProjet } from './membres-projets/entities/membre-projet.entity';
import { Etiquette } from './etiquettes/entities/etiquette.entity';
import { Commentaire } from './commentaires/entities/commentaire.entity';
import { Invitation } from './invitations/entities/invitation.entity';
import { Notification } from './notifications/entities/notification.entity';
import { AuditLog } from './audit/entities/audit-log.entity';
import { getMailConfig } from './config/mail.config';

@Module({
  imports: [
    // Configuration globale
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
    }),

    // Base de données TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        const databaseUrl = configService.get('DATABASE_URL');

        // Si DATABASE_URL existe (production), l'utiliser
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [
              Utilisateur, 
              Projet, 
              Tache, 
              MembreProjet,
              Etiquette, 
              Commentaire,
              Invitation,
              Notification,
              AuditLog,
            ],
            synchronize: true, // ✅ Temporairement true pour créer les tables
            logging: false,
            ssl: { rejectUnauthorized: false },
            extra: {
              max: 10,
              idleTimeoutMillis: 30000,
              connectionTimeoutMillis: 2000,
            },
          };
        }

        // Sinon, utiliser la config classique (développement)
        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', ''),
          database: configService.get('DB_DATABASE', 'taskflow_db'),
          entities: [
            Utilisateur, 
            Projet, 
            Tache, 
            MembreProjet, 
            Etiquette, 
            Commentaire,
            Invitation,
            Notification,
            AuditLog,
          ],
          synchronize: !isProduction, // true en dev, false en prod
          logging: !isProduction,
          ssl: isProduction ? { rejectUnauthorized: false } : false,
          extra: {
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
          },
        };
      },
      inject: [ConfigService],
    }),

    // Configuration Email
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getMailConfig,
      inject: [ConfigService],
    }),

    // Modules applicatifs
    AuthModule,
    AuditModule,
    UtilisateursModule,
    ProjetsModule,
    TachesModule,
    MembresProjetsModule,
    EtiquettesModule,
    CommentairesModule,
    InvitationsModule,
    DashboardModule,
    NotificationsModule,
    WebSocketModule,
  ],
})
export class AppModule {}