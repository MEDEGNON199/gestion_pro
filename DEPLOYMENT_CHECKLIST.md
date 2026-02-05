# ✅ Checklist de Déploiement TaskFlow sur Render

Guide rapide pour déployer TaskFlow en production.

---

## 📋 Avant de Commencer

### Prérequis
- [ ] Compte GitHub avec le code TaskFlow
- [ ] Compte Render (gratuit) : https://render.com
- [ ] Code poussé sur GitHub (branche `main`)
- [ ] OAuth configuré (Google/GitHub) - optionnel

---

## 🚀 Étapes de Déploiement

### 1️⃣ Base de Données PostgreSQL (5 min)

- [ ] Aller sur Render Dashboard
- [ ] Cliquer "New +" → "PostgreSQL"
- [ ] Configurer :
  - Name: `taskflow-db`
  - Database: `taskflow_production`
  - User: `taskflow_user`
  - Region: `Frankfurt`
  - Plan: `Free`
- [ ] Créer la base de données
- [ ] **COPIER ET SAUVEGARDER** :
  - [ ] Internal Database URL
  - [ ] External Database URL
  - [ ] PSQL Command

**URL Format:**
```
postgresql://taskflow_user:PASSWORD@dpg-xxxxx.frankfurt-postgres.render.com/taskflow_production
```

---

### 2️⃣ Backend API (10 min)

- [ ] Cliquer "New +" → "Web Service"
- [ ] Connecter GitHub → Sélectionner repository TaskFlow
- [ ] Configurer :
  - Name: `taskflow-api`
  - Region: `Frankfurt`
  - Branch: `main`
  - Root Directory: `taskflow-api`
  - Runtime: `Node`
  - Build Command: `npm install && npm run build`
  - Start Command: `npm run start:prod`
  - Health Check Path: `/health`
  - Plan: `Free`

#### Variables d'Environnement Backend

- [ ] Ajouter les variables suivantes :

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=[Copier Internal Database URL de l'étape 1]
JWT_SECRET=[Générer avec: openssl rand -base64 32]
JWT_EXPIRES_IN=24h
FRONTEND_URL=https://taskflow-frontend.onrender.com
```

**Optionnel - OAuth Google:**
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Optionnel - OAuth GitHub:**
```env
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

**Optionnel - Email:**
```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
```

- [ ] Créer le service
- [ ] Attendre le déploiement (5-10 min)
- [ ] Vérifier : `https://taskflow-api.onrender.com/health`
- [ ] **COPIER L'URL** : `https://taskflow-api.onrender.com`

---

### 3️⃣ Frontend Static Site (5 min)

- [ ] Cliquer "New +" → "Static Site"
- [ ] Connecter GitHub → Sélectionner repository TaskFlow
- [ ] Configurer :
  - Name: `taskflow-frontend`
  - Branch: `main`
  - Root Directory: `taskflow-frontend`
  - Build Command: `npm install && npm run build`
  - Publish Directory: `dist`

#### Variables d'Environnement Frontend

- [ ] Ajouter les variables suivantes :

```env
VITE_API_URL=https://taskflow-api.onrender.com
VITE_WS_URL=wss://taskflow-api.onrender.com
VITE_APP_NAME=TaskFlow
VITE_APP_VERSION=1.0.0
```

- [ ] Créer le site
- [ ] Attendre le déploiement (3-5 min)
- [ ] **COPIER L'URL** : `https://taskflow-frontend.onrender.com`

---

### 4️⃣ Mise à Jour des URLs

#### Backend
- [ ] Aller dans `taskflow-api` → Environment
- [ ] Mettre à jour `FRONTEND_URL` avec l'URL réelle du frontend
- [ ] Sauvegarder (le service redémarre automatiquement)

#### OAuth (si configuré)

**Google OAuth:**
- [ ] Aller sur [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Ajouter Authorized redirect URI :
  ```
  https://taskflow-api.onrender.com/auth/google/callback
  ```

**GitHub OAuth:**
- [ ] Aller sur GitHub → Settings → Developer settings → OAuth Apps
- [ ] Mettre à jour Authorization callback URL :
  ```
  https://taskflow-api.onrender.com/auth/github/callback
  ```

---

## ✅ Tests Post-Déploiement

### Backend
- [ ] Health check : `https://taskflow-api.onrender.com/health`
- [ ] Devrait retourner : `{"status":"ok","timestamp":"..."}`

### Frontend
- [ ] Ouvrir : `https://taskflow-frontend.onrender.com`
- [ ] Page de connexion s'affiche
- [ ] Créer un compte
- [ ] Se connecter
- [ ] Créer un projet
- [ ] Créer une tâche

### WebSocket
- [ ] Ouvrir 2 onglets avec le même projet
- [ ] Créer une tâche dans un onglet
- [ ] Vérifier qu'elle apparaît en temps réel dans l'autre

---

## 📊 Configuration Avancée (Optionnel)

### Domaine Personnalisé
- [ ] Backend : Settings → Custom Domains → `api.tondomaine.com`
- [ ] Frontend : Settings → Custom Domains → `app.tondomaine.com`
- [ ] Configurer les DNS selon les instructions

### Monitoring
- [ ] Activer les logs en temps réel
- [ ] Configurer les alertes :
  - [ ] Deploy failures
  - [ ] Service crashes
  - [ ] High memory usage

### Backup Base de Données
- [ ] Configurer les backups automatiques dans Render
- [ ] Tester la restauration

---

## 🚨 Dépannage Rapide

### Backend ne démarre pas
```bash
# Vérifier dans les logs Render
- "Cannot connect to database" → Vérifier DATABASE_URL
- "Port already in use" → Vérifier PORT=3000
- "Module not found" → Vérifier npm install
```

### Frontend ne se connecte pas
```bash
# Console navigateur
- CORS errors → Vérifier FRONTEND_URL dans backend
- Network errors → Vérifier VITE_API_URL
- WebSocket failed → Vérifier VITE_WS_URL (wss://)
```

### Base de données vide
```bash
# Se connecter via PSQL
psql [External Database URL]

# Vérifier les tables
\dt

# Lancer les migrations si nécessaire
npm run migration:run
```

---

## 📝 URLs Finales

Une fois le déploiement terminé, note tes URLs :

```
Frontend:     https://taskflow-frontend.onrender.com
Backend API:  https://taskflow-api.onrender.com
Health Check: https://taskflow-api.onrender.com/health
Database:     postgresql://taskflow_user:PASSWORD@dpg-xxxxx.frankfurt-postgres.render.com/taskflow_production
```

---

## 🎉 Félicitations !

Ton application TaskFlow est maintenant en production ! 🚀

**Prochaines étapes :**
1. Partage l'URL avec ton équipe
2. Configure un domaine personnalisé
3. Active le monitoring
4. Fais un backup de la base de données
5. Documente les accès

---

## 📚 Ressources

- 📖 [Guide Complet de Déploiement](./docs/RENDER_DEPLOYMENT_GUIDE.md)
- 🌐 [Documentation Render](https://render.com/docs)
- 💬 [Support Render](https://render.com/support)
- 🐛 [Issues GitHub](https://github.com/yourusername/taskflow/issues)

---

**Temps total estimé : 20-30 minutes** ⏱️
