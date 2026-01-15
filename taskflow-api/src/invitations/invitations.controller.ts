import { Controller, Post, Get, Param, Body, UseGuards, Request, Delete } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('invitations')
@UseGuards(JwtAuthGuard)
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post('projets/:projetId/inviter')
  async inviter(
    @Param('projetId') projetId: string,
    @Body('email') email: string,
    @Body('role') role: string,
    @Request() req,
  ) {
    return await this.invitationsService.inviter(projetId, email, role, req.user);
  }

  @Get('projets/:projetId')
  async getInvitationsByProjet(@Param('projetId') projetId: string, @Request() req) {
    return await this.invitationsService.getInvitationsByProjet(projetId, req.user);
  }

  @Get('mes-invitations')
  async getMyInvitations(@Request() req) {
    return await this.invitationsService.getMyInvitations(req.user);
  }

  @Post(':token/accepter')
  async accepterInvitation(@Param('token') token: string, @Request() req) {
    return await this.invitationsService.accepterInvitation(token, req.user);
  }

  @Post(':token/refuser')
  async refuserInvitation(@Param('token') token: string, @Request() req) {
    return await this.invitationsService.refuserInvitation(token, req.user);
  }

  @Delete(':invitationId')
  async annulerInvitation(@Param('invitationId') invitationId: string, @Request() req) {
    return await this.invitationsService.annulerInvitation(invitationId, req.user);
  }
}