import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, ip, headers } = request;

    // Ignorer certaines routes (health check, etc.)
    if (url.includes('/health') || url.includes('/audit')) {
      return next.handle();
    }

    // Mapper les méthodes HTTP vers des actions
    const actionMap: Record<string, string> = {
      POST: 'CREATE',
      PUT: 'UPDATE',
      PATCH: 'UPDATE',
      DELETE: 'DELETE',
      GET: 'READ',
    };

    const action = `${actionMap[method] || method}_${this.extractResource(url)}`;

    return next.handle().pipe(
      tap({
        next: () => {
          if (user?.id) {
            this.auditService.log({
              utilisateurId: user.id,
              action,
              details: {
                method,
                url,
                body: this.sanitizeBody(request.body),
              },
              ipAddress: ip || headers['x-forwarded-for'] || 'unknown',
              userAgent: headers['user-agent'],
              status: 'success',
            });
          }
        },
        error: (error) => {
          if (user?.id) {
            this.auditService.log({
              utilisateurId: user.id,
              action,
              details: {
                method,
                url,
                error: error.message,
              },
              ipAddress: ip || headers['x-forwarded-for'] || 'unknown',
              userAgent: headers['user-agent'],
              status: 'failed',
            });
          }
        },
      }),
    );
  }

  private extractResource(url: string): string {
    const parts = url.split('/').filter((p) => p && !p.match(/^[0-9a-f-]{36}$/i));
    return parts[0] || 'unknown';
  }

  private sanitizeBody(body: any): any {
    if (!body) return null;
    const sanitized = { ...body };
    // Supprimer les mots de passe et tokens
    delete sanitized.password;
    delete sanitized.token;
    delete sanitized.mot_de_passe;
    return sanitized;
  }
}
