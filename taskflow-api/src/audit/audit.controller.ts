import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuditService } from './audit.service';

@Controller('audit')
@UseGuards(JwtAuthGuard)
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get('logs')
  async getLogs(
    @CurrentUser() user: any,
    @Query('action') action?: string,
    @Query('ressourceType') ressourceType?: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditService.getLogs({
      utilisateurId: user.id,
      action,
      ressourceType,
      limit: limit ? parseInt(limit) : 100,
    });
  }

  @Get('stats')
  async getStats(@CurrentUser() user: any) {
    return this.auditService.getStats(user.id);
  }

  @Get('all')
  async getAllLogs(
    @CurrentUser() user: any,
    @Query('utilisateurId') utilisateurId?: string,
    @Query('action') action?: string,
    @Query('limit') limit?: string,
  ) {
    // TODO: Ajouter une vérification de rôle admin
    return this.auditService.getLogs({
      utilisateurId,
      action,
      limit: limit ? parseInt(limit) : 100,
    });
  }
}
