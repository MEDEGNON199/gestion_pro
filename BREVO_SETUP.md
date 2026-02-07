# 📧 Configuration Brevo (Sendinblue) pour TaskFlow

## Pourquoi Brevo ?

Brevo (anciennement Sendinblue) est une excellente alternative à Nodemailer/Gmail pour l'envoi d'emails :

- ✅ **300 emails gratuits par jour**
- ✅ API simple et fiable
- ✅ Pas de problème de "less secure apps" comme Gmail
- ✅ Statistiques d'envoi (taux d'ouverture, clics, etc.)
- ✅ Templates d'emails professionnels
- ✅ Pas de blocage SMTP

---

## 🚀 Configuration

### 1. Créer un compte Brevo

1. Aller sur [https://www.brevo.com](https://www.brevo.com)
2. Créer un compte gratuit
3. Vérifier votre email

### 2. Obtenir votre clé API

1. Se connecter à Brevo
2. Aller dans **Settings** (Paramètres) > **SMTP & API**
3. Cliquer sur **Create a new API key**
4. Donner un nom : `TaskFlow API`
5. Copier la clé API (elle commence par `xkeysib-...`)

### 3. Configurer l'expéditeur

1. Dans Brevo, aller dans **Senders** (Expéditeurs)
2. Ajouter un email expéditeur (ex: `noreply@votredomaine.com`)
3. Vérifier l'email (cliquer sur le lien reçu)

**Note :** Si vous n'avez pas de domaine, vous pouvez utiliser l'email de votre compte Brevo.

### 4. Ajouter la clé API dans votre projet

#### Développement local

Éditez `taskflow-api/.env` :

```env
# Email Configuration - Brevo
BREVO_API_KEY=xkeysib-votre-cle-api-ici
MAIL_FROM=noreply@votredomaine.com
```

#### Production (Render.com)

1. Aller sur votre service backend sur Render.com
2. **Environment** > **Add Environment Variable**
3. Ajouter :
   - `BREVO_API_KEY` = `xkeysib-votre-cle-api-ici`
   - `MAIL_FROM` = `noreply@votredomaine.com`
4. Sauvegarder (le service va redémarrer automatiquement)

---

## 🧪 Tester l'envoi d'emails

### Test rapide

Créez un fichier `taskflow-api/src/test-brevo.ts` :

```typescript
import * as brevo from '@getbrevo/brevo';

const apiKey = 'xkeysib-votre-cle-api-ici';

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);

const sendSmtpEmail = new brevo.SendSmtpEmail();
sendSmtpEmail.sender = { email: 'noreply@votredomaine.com', name: 'TaskFlow' };
sendSmtpEmail.to = [{ email: 'votre-email@example.com' }];
sendSmtpEmail.subject = 'Test Brevo - TaskFlow';
sendSmtpEmail.htmlContent = '<h1>Ça marche ! 🎉</h1><p>Brevo est bien configuré.</p>';

apiInstance
  .sendTransacEmail(sendSmtpEmail)
  .then((data) => {
    console.log('✅ Email envoyé avec succès !');
    console.log('Message ID:', data.body.messageId);
  })
  .catch((error) => {
    console.error('❌ Erreur:', error);
  });
```

Exécutez :

```bash
cd taskflow-api
npx ts-node src/test-brevo.ts
```

### Test via l'application

1. Démarrez le backend : `npm run start:dev`
2. Créez un projet
3. Invitez un membre avec votre email
4. Vérifiez votre boîte mail

---

## 📊 Vérifier les envois

1. Connectez-vous à Brevo
2. Aller dans **Statistics** > **Email**
3. Vous verrez tous les emails envoyés, ouverts, cliqués, etc.

---

## 🎨 Personnaliser les emails

Les templates d'emails sont dans `taskflow-api/src/mail/brevo.service.ts`.

### Email d'invitation actuel

```typescript
await this.brevoService.sendInvitationEmail(
  email,
  `${utilisateur.prenom} ${utilisateur.nom}`,
  projet.nom,
  invitationUrl,
  isNewInvitation,
);
```

### Ajouter un nouvel email

Dans `brevo.service.ts`, ajoutez une méthode :

```typescript
async sendWelcomeEmail(to: string, userName: string): Promise<void> {
  const subject = 'Bienvenue sur TaskFlow ! 🎉';
  
  const html = `
    <!DOCTYPE html>
    <html>
      <body>
        <h1>Bienvenue ${userName} !</h1>
        <p>Merci de vous être inscrit sur TaskFlow.</p>
      </body>
    </html>
  `;
  
  await this.sendMail({ to, subject, html });
}
```

---

## 🔧 Dépannage

### Erreur : "API key is invalid"

- Vérifiez que la clé commence par `xkeysib-`
- Vérifiez qu'elle est bien copiée (pas d'espace)
- Régénérez une nouvelle clé si nécessaire

### Erreur : "Sender email not verified"

- Allez dans **Senders** sur Brevo
- Vérifiez l'email expéditeur
- Cliquez sur le lien reçu par email

### Les emails n'arrivent pas

1. Vérifiez les logs du backend
2. Vérifiez dans **Statistics** sur Brevo si l'email a été envoyé
3. Vérifiez vos spams
4. Vérifiez que l'email destinataire est valide

### Limite de 300 emails/jour dépassée

- Passez à un plan payant sur Brevo
- Ou attendez le lendemain (la limite se réinitialise à minuit UTC)

---

## 💰 Tarifs Brevo

| Plan | Prix | Emails/jour | Emails/mois |
|------|------|-------------|-------------|
| **Gratuit** | 0€ | 300 | 9 000 |
| **Starter** | 25€/mois | Illimité | 20 000 |
| **Business** | 65€/mois | Illimité | 100 000 |

Pour TaskFlow, le plan gratuit est largement suffisant pour commencer.

---

## 📚 Ressources

- [Documentation Brevo API](https://developers.brevo.com/)
- [SDK Node.js Brevo](https://github.com/getbrevo/brevo-node)
- [Templates d'emails](https://www.brevo.com/email-templates/)

---

## ✅ Checklist

- [ ] Compte Brevo créé
- [ ] Clé API générée
- [ ] Email expéditeur vérifié
- [ ] `BREVO_API_KEY` ajoutée dans `.env`
- [ ] `MAIL_FROM` configuré dans `.env`
- [ ] Test d'envoi réussi
- [ ] Variables ajoutées sur Render.com (production)

---

## 🎉 C'est fait !

Votre application peut maintenant envoyer des emails professionnels via Brevo !

**Prochaines étapes :**
1. Testez l'envoi d'invitations
2. Personnalisez les templates d'emails
3. Ajoutez d'autres types d'emails (bienvenue, notifications, etc.)
