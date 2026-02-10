import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as brevo from '@getbrevo/brevo';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

@Injectable()
export class BrevoService {
  private apiInstance: brevo.TransactionalEmailsApi;
  private defaultSender: { email: string; name: string };

  constructor(private configService: ConfigService) {
    // Configuration de l'API Brevo
    const apiKey = this.configService.get<string>('BREVO_API_KEY');
    
    if (!apiKey) {
      console.warn('⚠️  BREVO_API_KEY non configurée - Les emails ne seront pas envoyés');
    }

    // Initialiser l'API
    this.apiInstance = new brevo.TransactionalEmailsApi();
    this.apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      apiKey || '',
    );

    // Expéditeur par défaut
    this.defaultSender = {
      email: this.configService.get<string>('MAIL_FROM') || 'noreply@taskflow.com',
      name: 'TaskFlow',
    };
  }

  async sendMail(options: SendEmailOptions): Promise<void> {
    try {
      const sendSmtpEmail = new brevo.SendSmtpEmail();

      // Expéditeur
      sendSmtpEmail.sender = options.from
        ? { email: options.from, name: 'TaskFlow' }
        : this.defaultSender;

      // Destinataire
      sendSmtpEmail.to = [{ email: options.to }];

      // Sujet et contenu
      sendSmtpEmail.subject = options.subject;
      sendSmtpEmail.htmlContent = options.html;

      // Envoi
      const result = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      
      console.log('✅ Email envoyé avec succès via Brevo:', {
        to: options.to,
        subject: options.subject,
        messageId: result.body.messageId,
      });
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'email via Brevo:', error);
      throw error;
    }
  }

  async sendInvitationEmail(
    to: string,
    inviterName: string,
    projectName: string,
    invitationUrl: string,
    isNewInvitation: boolean,
  ): Promise<void> {
    const subject = isNewInvitation
      ? `Invitation à rejoindre le projet "${projectName}"`
      : `Rappel : Invitation à rejoindre le projet "${projectName}"`;

    const html = `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>${subject}</title>
          <!--[if mso]>
          <style type="text/css">
            body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
          </style>
          <![endif]-->
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <!-- Wrapper Table -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f7fa;">
            <tr>
              <td style="padding: 40px 20px;">
                <!-- Main Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; max-width: 100%;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 48px 40px; text-align: center;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="text-align: center;">
                            <!-- Logo/Icon -->
                            <div style="background-color: rgba(255, 255, 255, 0.2); width: 80px; height: 80px; border-radius: 20px; margin: 0 auto 24px; display: inline-flex; align-items: center; justify-content: center;">
                              <span style="font-size: 40px; line-height: 1;">📋</span>
                            </div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">TaskFlow</h1>
                            <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 500;">Gestion de projets collaborative</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 48px 40px;">
                      ${
                        isNewInvitation
                          ? `
                      <!-- New Invitation Badge -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="text-align: center; padding-bottom: 32px;">
                            <span style="display: inline-block; background-color: #dbeafe; color: #1e40af; padding: 8px 20px; border-radius: 24px; font-size: 14px; font-weight: 600;">
                              🎉 Nouvelle invitation
                            </span>
                          </td>
                        </tr>
                      </table>
                          `
                          : `
                      <!-- Reminder Badge -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="text-align: center; padding-bottom: 32px;">
                            <span style="display: inline-block; background-color: #fef3c7; color: #92400e; padding: 8px 20px; border-radius: 24px; font-size: 14px; font-weight: 600;">
                              ⏰ Rappel d'invitation
                            </span>
                          </td>
                        </tr>
                      </table>
                          `
                      }

                      <!-- Greeting -->
                      <h2 style="margin: 0 0 24px; color: #1e293b; font-size: 24px; font-weight: 700; line-height: 1.3;">
                        Bonjour ! 👋
                      </h2>

                      <!-- Main Message -->
                      <p style="margin: 0 0 24px; color: #475569; font-size: 16px; line-height: 1.6;">
                        <strong style="color: #1e293b;">${inviterName}</strong> vous invite à rejoindre le projet 
                        <strong style="color: #3b82f6;">"${projectName}"</strong> sur TaskFlow.
                      </p>

                      ${
                        isNewInvitation
                          ? `
                      <p style="margin: 0 0 32px; color: #475569; font-size: 16px; line-height: 1.6;">
                        Rejoignez l'équipe et commencez à collaborer dès maintenant !
                      </p>
                          `
                          : `
                      <p style="margin: 0 0 32px; color: #475569; font-size: 16px; line-height: 1.6;">
                        Votre invitation est toujours active. N'oubliez pas de la confirmer pour rejoindre l'équipe.
                      </p>
                          `
                      }

                      <!-- CTA Button -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="text-align: center; padding: 0 0 32px;">
                            <a href="${invitationUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); transition: all 0.3s ease;">
                              ${isNewInvitation ? '✨ Accepter l\'invitation' : '👀 Voir l\'invitation'}
                            </a>
                          </td>
                        </tr>
                      </table>

                      <!-- Alternative Link -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc; border-radius: 12px; padding: 24px;">
                        <tr>
                          <td>
                            <p style="margin: 0 0 12px; color: #64748b; font-size: 14px; font-weight: 600;">
                              Ou copiez ce lien dans votre navigateur :
                            </p>
                            <p style="margin: 0; word-break: break-all;">
                              <a href="${invitationUrl}" style="color: #3b82f6; text-decoration: none; font-size: 14px;">
                                ${invitationUrl}
                              </a>
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Divider -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="padding: 32px 0;">
                            <div style="height: 1px; background-color: #e2e8f0;"></div>
                          </td>
                        </tr>
                      </table>

                      <!-- Help Text -->
                      <p style="margin: 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                        Si vous n'attendiez pas cette invitation, vous pouvez ignorer cet email en toute sécurité.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0 0 8px; color: #64748b; font-size: 14px; font-weight: 600;">
                        TaskFlow
                      </p>
                      <p style="margin: 0 0 16px; color: #94a3b8; font-size: 13px;">
                        Plateforme de gestion de projets collaborative
                      </p>
                      <p style="margin: 0; color: #cbd5e1; font-size: 12px;">
                        © ${new Date().getFullYear()} TaskFlow. Tous droits réservés.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    await this.sendMail({ to, subject, html });
  }
}
