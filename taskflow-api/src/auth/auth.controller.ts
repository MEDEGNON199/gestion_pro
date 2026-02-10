import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: Utilisateur) {
    return {
      id: user.id,
      email: user.email,
      prenom: user.prenom,
      nom: user.nom,
    };
  }

  // Google OAuth routes
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: any, @Res() res: Response) {
    // Store invitation token in session if present
    const invitation = req.query.invitation;
    if (invitation) {
      req.session = req.session || {};
      req.session.invitation = invitation;
    }
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    const tokenData = await this.authService.generateJwtFromUser(req.user);
    
    // Retrieve invitation token from session if present
    const invitation = req.session?.invitation;
    
    // Redirect to frontend with token and invitation if present
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = invitation 
      ? `${frontendUrl}/auth/callback?token=${tokenData.access_token}&invitation=${invitation}`
      : `${frontendUrl}/auth/callback?token=${tokenData.access_token}`;
    
    // Clear invitation from session
    if (req.session?.invitation) {
      delete req.session.invitation;
    }
    
    res.redirect(redirectUrl);
  }

  // GitHub OAuth routes
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Req() req: any, @Res() res: Response) {
    // Store invitation token in session if present
    const invitation = req.query.invitation;
    if (invitation) {
      req.session = req.session || {};
      req.session.invitation = invitation;
    }
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthCallback(@Req() req: any, @Res() res: Response) {
    const tokenData = await this.authService.generateJwtFromUser(req.user);
    
    // Retrieve invitation token from session if present
    const invitation = req.session?.invitation;
    
    // Redirect to frontend with token and invitation if present
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = invitation 
      ? `${frontendUrl}/auth/callback?token=${tokenData.access_token}&invitation=${invitation}`
      : `${frontendUrl}/auth/callback?token=${tokenData.access_token}`;
    
    // Clear invitation from session
    if (req.session?.invitation) {
      delete req.session.invitation;
    }
    
    res.redirect(redirectUrl);
  }
}