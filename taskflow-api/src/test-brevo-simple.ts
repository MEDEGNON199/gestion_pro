import * as brevo from '@getbrevo/brevo';

// ⚠️ Remplacez par votre clé API Brevo
const BREVO_API_KEY = 'xkeysib-votre-cle-api-ici';
const FROM_EMAIL = 'noreply@votredomaine.com';
const TO_EMAIL = 'votre-email@example.com'; // Votre email pour tester

async function testBrevo() {
  console.log('🧪 Test d\'envoi d\'email via Brevo...\n');

  try {
    // Configuration de l'API
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      BREVO_API_KEY,
    );

    // Création de l'email
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { email: FROM_EMAIL, name: 'TaskFlow Test' };
    sendSmtpEmail.to = [{ email: TO_EMAIL }];
    sendSmtpEmail.subject = '🎉 Test Brevo - TaskFlow';
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              margin-top: 20px;
              border-radius: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🚀 TaskFlow</h1>
            <p>Test d'envoi d'email via Brevo</p>
          </div>
          <div class="content">
            <h2>Ça marche ! 🎉</h2>
            <p>Si vous recevez cet email, c'est que Brevo est bien configuré.</p>
            <p><strong>Félicitations !</strong> Vous pouvez maintenant envoyer des emails depuis TaskFlow.</p>
          </div>
        </body>
      </html>
    `;

    // Envoi
    console.log('📤 Envoi en cours...');
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log('\n✅ Email envoyé avec succès !');
    console.log('📧 Destinataire:', TO_EMAIL);
    console.log('🆔 Message ID:', result.body.messageId);
    console.log('\n💡 Vérifiez votre boîte mail (et les spams)');
  } catch (error: any) {
    console.error('\n❌ Erreur lors de l\'envoi:');
    console.error(error.message);
    
    if (error.message.includes('API key')) {
      console.log('\n💡 Vérifiez que votre clé API est correcte');
      console.log('   Elle doit commencer par "xkeysib-"');
    }
    
    if (error.message.includes('sender')) {
      console.log('\n💡 Vérifiez que l\'email expéditeur est vérifié sur Brevo');
      console.log('   Allez dans Settings > Senders sur brevo.com');
    }
  }
}

testBrevo();
