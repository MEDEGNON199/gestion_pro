import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    const clientID = configService.get<string>('GITHUB_CLIENT_ID');
    const clientSecret = configService.get<string>('GITHUB_CLIENT_SECRET');
    const callbackURL = `${configService.get('OAUTH_CALLBACK_URL')}/github/callback`;

    if (!clientID || !clientSecret) {
      throw new Error('GitHub OAuth credentials are missing');
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { username, displayName, emails, photos } = profile;
    
    // GitHub peut ne pas avoir de nom complet, on utilise displayName ou username
    const fullName = displayName || username || '';
    const nameParts = fullName.split(' ');
    
    const user = {
      email: emails?.[0]?.value || `${username}@github.local`,
      prenom: nameParts[0] || username,
      nom: nameParts.slice(1).join(' ') || '',
      avatar: photos?.[0]?.value,
      provider: 'github',
      providerId: profile.id,
    };

    const validatedUser = await this.authService.validateOAuthUser(user);
    return validatedUser;
  }
}