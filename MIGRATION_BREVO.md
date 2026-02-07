# 📧 Migration vers Brevo - Résumé

## ✅ Changements effectués

### 1. Installation du package Brevo

```bash
npm install @getbrevo/brevo --save
```

### 2. Fichiers créés

- `taskflow-api/src/mail/brevo.service.ts` - Service d'envoi d'emails via Brevo
- `taskflow-api/src/mail/mail.module.ts` - Module NestJS pour les emails
- `taskflow-api/src/test-brevo-simple.ts` - Script de test
- `BREVO_SETUP.md` - Guide complet de configuration
- `MIGRATION_BREVO.md` - Ce fichier

### 3. Fichiers modifiés

- `taskflow-api/src/invitations/invitations.service.ts` - Utilise maintenant `BrevoService` au lieu de `MailerService`
- `taskflow-api/src/invitations/invitations.module.ts` - Importe `MailModule`
- `taskflow-api/.env` - Ajout de `BREVO_API_KEY` et `MAIL_FROM`
- `taskflow-api/.env.production` - Ajout de `BREVO_API_KEY` et `MAIL_FROM`

### 4. Services corrigés (bonus)

- `taskflow-frontend/src/services/dashboard.services.ts` - Utilise maintenant `api` au lieu de `axios` directement
- `taskflow-frontend/src/services/invitations.service.ts` - Utilise maintenant `api` au lieu de `axios` directement

---

## 🚀 Configuration requise

### 1. Obtenir une clé API Brevo

1. Créer un compte sur [brevo.com](https://www.brevo.com)
2. Aller dans **Settings** > **SMTP & API**
3. Créer une clé API
4. Copier la clé (commence par `xkeysib-...`)

### 2. Configurer les variables d'environnement

#### Développement (`taskflow-api/.env`)

```env
BREVO_API_KEY=xkeysib-votre-cle-api-ici
MAIL_FROM=noreply@votredomaine.com
```

#### Production (Render.com)

Ajouter les variables d'environnement :
- `BREVO_API_KEY` = votre clé API
- `MAIL_FROM` = votre email expéditeur

---

## 🧪 Tester

### Test rapide

```bash
cd taskflow-api

# Éditer src/test-brevo-simple.ts avec votre clé API et email
# Puis exécuter :
npx ts-node src/test-brevo-simple.ts
```

### Test via l'application

1. Démarrer le backend : `npm run start:dev`
2. Créer un projet
3. Inviter un membre
4. Vérifier l'email reçu

---

## 📊 Avantages de Brevo

| Critère | Gmail/Nodemailer | Brevo |
|---------|------------------|-------|
| **Emails gratuits/jour** | ~100 (limité) | 300 |
| **Configuration** | Complexe (app password) | Simple (API key) |
| **Fiabilité** | Moyenne (blocages) | Excellente |
| **Statistiques** | ❌ Non | ✅ Oui |
| **Templates** | ❌ Non | ✅ Oui |
| **Délivrabilité** | Moyenne | Excellente |

---

## 🔄 Rollback (si besoin)

Si vous voulez revenir à Nodemailer :

1. Restaurer les imports dans `invitations.service.ts` :
   ```typescript
   import { MailerService } from '@nestjs-modules/mailer';
   // ...
   private mailerService: MailerService,
   ```

2. Restaurer l'appel dans `invitations.service.ts` :
   ```typescript
   await this.mailerService.sendMail({
     to: email,
     subject: '...',
     html: '...',
   });
   ```

3. Retirer `MailModule` de `invitations.module.ts`

---

## 📚 Documentation

- [BREVO_SETUP.md](BREVO_SETUP.md) - Guide complet de configuration
- [Documentation Brevo](https://developers.brevo.com/)

---

## ✅ Checklist

- [ ] Package `@getbrevo/brevo` installé
- [ ] Compte Brevo créé
- [ ] Clé API obtenue
- [ ] Email expéditeur vérifié sur Brevo
- [ ] `BREVO_API_KEY` ajoutée dans `.env`
- [ ] `MAIL_FROM` configuré dans `.env`
- [ ] Test d'envoi réussi
- [ ] Variables ajoutées sur Render.com (production)
- [ ] Ancienne config Gmail commentée/supprimée

---

## 🎉 Prêt !

Votre application utilise maintenant Brevo pour l'envoi d'emails. Plus fiable, plus simple, plus professionnel !
