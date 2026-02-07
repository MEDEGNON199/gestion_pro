import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

export interface AuditLogData {
  utilisateurId: string;
  action: string;
  ressourceType?: string;
  ressourceId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  status?: 'success' | 'failed';
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(data: AuditLogData): Promise<void> {
    try {
      const log = this.auditLogRepository.create({
        utilisateur_id: data.utilisateurId,
        action: data.action,
        ressource_type: data.ressourceType,
        ressource_id: data.ressourceId,
        details: data.details,
        ip_address: data.ipAddress,
        user_agent: data.userAgent,
        status: data.status || 'success',
      });

      await this.auditLogRepository.save(log);

      // Log dans la console pour debug
      console.log('📝 AUDIT LOG:', {
        utilisateur: data.utilisateurId,
        action: data.action,
        ressource: data.ressourceType ? `${data.ressourceType}:${data.ressourceId}` : 'N/A',
        status: data.status || 'success',
        ip: data.ipAddress,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('❌ Erreur lors de la création du log d\'audit:', error);
    }
  }

  async getLogs(filters?: {
    utilisateurId?: string;
    action?: string;
    ressourceType?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<AuditLog[]> {
    const query = this.auditLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.utilisateur', 'utilisateur')
      .orderBy('log.date_action', 'DESC');

    if (filters?.utilisateurId) {
      query.andWhere('log.utilisateur_id = :utilisateurId', {
        utilisateurId: filters.utilisateurId,
      });
    }

    if (filters?.action) {
      query.andWhere('log.action = :action', { action: filters.action });
    }

    if (filters?.ressourceType) {
      query.andWhere('log.ressource_type = :ressourceType', {
        ressourceType: filters.ressourceType,
      });
    }

    if (filters?.startDate) {
      query.andWhere('log.date_action >= :startDate', {
        startDate: filters.startDate,
      });
    }

    if (filters?.endDate) {
      query.andWhere('log.date_action <= :endDate', {
        endDate: filters.endDate,
      });
    }

    if (filters?.limit) {
      query.limit(filters.limit);
    }

    return query.getMany();
  }

  async getStats(utilisateurId?: string): Promise<any> {
    const query = this.auditLogRepository
      .createQueryBuilder('log')
      .select('log.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .groupBy('log.action')
      .orderBy('count', 'DESC');

    if (utilisateurId) {
      query.where('log.utilisateur_id = :utilisateurId', { utilisateurId });
    }

    return query.getRawMany();
  }
}
