import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@CurrentUser() user: Utilisateur) {
    return this.notificationsService.findAllByUtilisateur(user);
  }

  @Get('unread-count')
  getUnreadCount(@CurrentUser() user: Utilisateur) {
    return this.notificationsService.findUnreadCount(user);
  }

  @Patch(':id/lire')
  markAsRead(@Param('id') id: string, @CurrentUser() user: Utilisateur) {
    return this.notificationsService.markAsRead(id, user);
  }

  @Patch('tout-lire')
  markAllAsRead(@CurrentUser() user: Utilisateur) {
    return this.notificationsService.markAllAsRead(user);
  }
}
