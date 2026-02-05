import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GitHubStrategy } from './strategies/github.strategy';
import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Utilisateur]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtStrategy,
    // OAuth strategies are optional - only load if credentials are present
    {
      provide: GoogleStrategy,
      useFactory: (configService: ConfigService, authService: AuthService) => {
        const clientId = configService.get('GOOGLE_CLIENT_ID');
        const clientSecret = configService.get('GOOGLE_CLIENT_SECRET');
        
        if (clientId && clientSecret && clientId !== 'placeholder') {
          return new GoogleStrategy(configService, authService);
        }
        return null;
      },
      inject: [ConfigService, AuthService],
    },
    {
      provide: GitHubStrategy,
      useFactory: (configService: ConfigService, authService: AuthService) => {
        const clientId = configService.get('GITHUB_CLIENT_ID');
        const clientSecret = configService.get('GITHUB_CLIENT_SECRET');
        
        if (clientId && clientSecret && clientId !== 'placeholder') {
          return new GitHubStrategy(configService, authService);
        }
        return null;
      },
      inject: [ConfigService, AuthService],
    },
  ],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}