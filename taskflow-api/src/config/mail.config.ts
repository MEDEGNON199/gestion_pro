import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

export const getMailConfig = (configService: ConfigService): MailerOptions => ({
  transport: {
    host: configService.get('MAIL_HOST'),
    port: configService.get('MAIL_PORT'),
    secure: false,
    auth: {
      user: configService.get('MAIL_USER'),
      pass: configService.get('MAIL_PASSWORD'),
    },
    tls: {
      rejectUnauthorized: false, // ⬅️ Ceci règle le problème de certificat
    },
  },
  defaults: {
    from: configService.get('MAIL_FROM'),
  },
});