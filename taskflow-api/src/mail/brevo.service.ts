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
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 15px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🚀 TaskFlow</h1>
            <p>Gestion de projets collaborative</p>
          </div>
          <div class="content">
            <h2>Bonjour ! 👋</h2>
            <p>
              <strong>${inviterName}</strong> vous invite à rejoindre le projet 
              <strong>"${projectName}"</strong> sur TaskFlow.
            </p>
            ${
              isNewInvitation
                ? '<p>Cliquez sur le bouton ci-dessous pour accepter cette invitation :</p>'
                : '<p>⏰ Ceci est un rappel. Votre invitation est toujours active :</p>'
            }
            <div style="text-align: center;">
              <a href="${invitationUrl}" class="button">
                ${isNewInvitation ? 'Accepter l\'invitation' : 'Voir l\'invitation'}
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">
              Ou copiez ce lien dans votre navigateur :<br>
              <a href="${invitationUrl}">${invitationUrl}</a>
            </p>
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              Si vous n'attendiez pas cette invitation, vous pouvez ignorer cet email.
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} TaskFlow - Tous droits réservés</p>
          </div>
        </body>
      </html>
    `;

    await this.sendMail({ to, subject, html });
  }
}
