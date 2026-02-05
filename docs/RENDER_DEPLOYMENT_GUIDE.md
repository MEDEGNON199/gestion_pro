# 🚀 Guide de Déploiement sur Render - TaskFlow

Guide complet pour déployer TaskFlow en production sur Render.

---

## 📋 Prérequis

- ✅ Compte GitHub avec le repository TaskFlow
- ✅ Compte Render (gratuit) : https://render.com
- ✅ Code poussé sur GitHub
- ✅ Variables d'environnement prêtes

---

## 🗂️ Structure de Déploiement

```
Render Services:
├── 1. PostgreSQL Database (taskflow-db)
├── 2. Backend API (taskflow-api)
└── 3. Frontend Static Site (taskflow-frontend)
```

---

## 📝 ÉTAPE 1 : Préparation du Code

### 1.1 Créer les fichiers de configuration

#### **A. Backend - Créer `render.yaml` à la racine**

```yaml
# render.yaml
services:
  # Base de données PostgreSQL
  - type: pserv
    name: taskflow-db
    env: docker
    plan: free
    databases:
      - name: taskflow_production
        user: taskflow_user

  # Backend API
  - type: web
    name: taskflow-api
    env: node
    region: frankfurt
    plan: free
    buildCommand: cd taskflow-api && npm install && npm run build
    startCommand: cd taskflow-api && npm run start:prod
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      - key: DATABASE_URL
        fromDatabase:
          name: taskflow-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: FRONTEND_URL
        sync: false

  # Frontend Static Site
  - type: web
    name: taskflow-frontend
    env: static
    buildCommand: cd taskflow-frontend && npm install && npm run build
    staticPublishPath: taskflow-frontend/dist
    envVars:
      - key: VITE_API_URL
        sync: false
      - key: VITE_WS_URL
        sync: false
```

#### **B. Backend - Créer `build.sh`**

```bash
#!/bin/bash
# taskflow-api/build.sh

echo "🔨 Building TaskFlow API..."

# Install dependencies
npm ci --only=production

# Build the application
npm run build

echo "✅ Build completed!"
```

```bash
chmod +x taskflow-api/build.sh
```

#### **C. Backend - Vérifier `package.json`**

```json
{
  "name": "taskflow-api",
  "version": "1.0.0",
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "migration:run": "typeorm migration:run -d dist/data-source.js"
  },
  "engines": {
    "node": "20.x",
    "npm": ">=9.0.0"
  }
}
```

#### **D. Frontend - Vérifier `package.json`**

```json
{
  "name": "taskflow-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "engines": {
    "node": "20.x",
    "npm": ">=9.0.0"
  }
}
```

### 1.2 Créer les fichiers d'environnement

#### **Backend - `.env.example`**

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT
JWT_SECRET=your-super-secure-jwt-secret-min-32-characters
JWT_EXPIRES_IN=24h

# Application
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-frontend.onrender.com

# OAuth (Optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
OAUTH_CALLBACK_URL=https://your-api.onrender.com/auth

# Email (Optional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=
MAIL_PASS=
```

#### **Frontend - `.env.example`**

```env
VITE_API_URL=https://your-api.onrender.com
VITE_WS_URL=wss://your-api.onrender.com
VITE_APP_NAME=TaskFlow
VITE_APP_VERSION=1.0.0
```

### 1.3 Ajouter un Health Check Endpoint

```typescript
// taskflow-api/src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    };
  }
}
```

```typescript
// taskflow-api/src/app.module.ts
import { HealthController } from './health/health.controller';

@Module({
  controllers: [HealthController],
  // ... autres configurations
})
export class AppModule {}
```

### 1.4 Configurer CORS pour Production

```typescript
// taskflow-api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS Configuration
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL,
      'http://localhost:5173', // Pour le dev local
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
```

### 1.5 Pousser sur GitHub

```bash
git add .
git commit -m "feat: prepare for Render deployment"
git push origin main
```

---

## 🚀 ÉTAPE 2 : Déploiement sur Render

### 2.1 Créer la Base de Données PostgreSQL

1. **Aller sur Render Dashboard** : https://dashboard.render.com
2. **Cliquer sur "New +"** → **"PostgreSQL"**
3. **Configurer la base de données** :
   - **Name** : `taskflow-db`
   - **Database** : `taskflow_production`
   - **User** : `taskflow_user`
   - **Region** : `Frankfurt` (ou le plus proche de toi)
   - **Plan** : `Free` (pour commencer)
4. **Cliquer sur "Create Database"**
5. **⚠️ IMPORTANT** : Copie et sauvegarde ces informations :
   - **Internal Database URL** (pour le backend)
   - **External Database URL** (pour les migrations locales)
   - **PSQL Command** (pour accéder à la DB)

**Exemple d'URL :**
```
postgresql://taskflow_user:password@dpg-xxxxx.frankfurt-postgres.render.com/taskflow_production
```

---

### 2.2 Déployer le Backend (API)

1. **Cliquer sur "New +"** → **"Web Service"**
2. **Connecter GitHub** : Sélectionne ton repository TaskFlow
3. **Configurer le service** :

   **Basic Settings:**
   - **Name** : `taskflow-api`
   - **Region** : `Frankfurt` (même région que la DB)
   - **Branch** : `main`
   - **Root Directory** : `taskflow-api`
   - **Runtime** : `Node`
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm run start:prod`

   **Advanced Settings:**
   - **Plan** : `Free` (pour commencer)
   - **Health Check Path** : `/health`
   - **Auto-Deploy** : `Yes`

4. **Ajouter les Variables d'Environnement** :

   Clique sur **"Environment"** et ajoute :

   ```env
   NODE_ENV=production
   PORT=3000
   
   # Database (copie l'Internal Database URL de l'étape 2.1)
   DATABASE_URL=postgresql://taskflow_user:password@dpg-xxxxx.frankfurt-postgres.render.com/taskflow_production
   
   # JWT (génère un secret sécurisé)
   JWT_SECRET=votre-secret-jwt-super-securise-32-caracteres-minimum
   JWT_EXPIRES_IN=24h
   
   # Frontend URL (on le mettra à jour après)
   FRONTEND_URL=https://taskflow-frontend.onrender.com
   
   # OAuth Google (optionnel)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # OAuth GitHub (optionnel)
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   
   # OAuth Callback
   OAUTH_CALLBACK_URL=https://taskflow-api.onrender.com/auth
   
   # Email (optionnel)
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=your-email@gmail.com
   MAIL_PASS=your-app-password
   ```

5. **Cliquer sur "Create Web Service"**

6. **Attendre le déploiement** (5-10 minutes)

7. **Vérifier que ça fonctionne** :
   - Ouvre : `https://taskflow-api.onrender.com/health`
   - Tu devrais voir : `{"status":"ok","timestamp":"..."}`

---

### 2.3 Déployer le Frontend

1. **Cliquer sur "New +"** → **"Static Site"**
2. **Connecter GitHub** : Sélectionne ton repository TaskFlow
3. **Configurer le site** :

   **Basic Settings:**
   - **Name** : `taskflow-frontend`
   - **Branch** : `main`
   - **Root Directory** : `taskflow-frontend`
   - **Build Command** : `npm install && npm run build`
   - **Publish Directory** : `dist`

   **Advanced Settings:**
   - **Auto-Deploy** : `Yes`

4. **Ajouter les Variables d'Environnement** :

   ```env
   # Remplace par l'URL de ton backend déployé
   VITE_API_URL=https://taskflow-api.onrender.com
   VITE_WS_URL=wss://taskflow-api.onrender.com
   VITE_APP_NAME=TaskFlow
   VITE_APP_VERSION=1.0.0
   ```

5. **Cliquer sur "Create Static Site"**

6. **Attendre le déploiement** (3-5 minutes)

7. **Ton frontend sera disponible à** : `https://taskflow-frontend.onrender.com`

---

### 2.4 Mettre à Jour les URLs

#### **A. Mettre à jour le Backend**

1. Va dans **taskflow-api** sur Render
2. Clique sur **"Environment"**
3. Modifie `FRONTEND_URL` avec l'URL réelle :
   ```
   FRONTEND_URL=https://taskflow-frontend.onrender.com
   ```
4. Clique sur **"Save Changes"**
5. Le service va redémarrer automatiquement

#### **B. Mettre à jour OAuth (si configuré)**

**Google OAuth :**
1. Va sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionne ton projet
3. Va dans **APIs & Services** → **Credentials**
4. Édite ton OAuth 2.0 Client ID
5. Ajoute les **Authorized redirect URIs** :
   ```
   https://taskflow-api.onrender.com/auth/google/callback
   ```
6. Sauvegarde

**GitHub OAuth :**
1. Va sur GitHub → **Settings** → **Developer settings** → **OAuth Apps**
2. Édite ton application
3. Mets à jour **Authorization callback URL** :
   ```
   https://taskflow-api.onrender.com/auth/github/callback
   ```
4. Sauvegarde

---

## ✅ ÉTAPE 3 : Vérification Post-Déploiement

### 3.1 Tester le Backend

```bash
# Health check
curl https://taskflow-api.onrender.com/health

# Test de connexion (devrait retourner 401)
curl https://taskflow-api.onrender.com/api/auth/profile
```

### 3.2 Tester le Frontend

1. Ouvre : `https://taskflow-frontend.onrender.com`
2. Tu devrais voir la page de connexion
3. Essaie de créer un compte
4. Essaie de te connecter

### 3.3 Tester les WebSockets

1. Connecte-toi à l'application
2. Ouvre deux onglets avec le même projet
3. Crée une tâche dans un onglet
4. Vérifie qu'elle apparaît en temps réel dans l'autre

---

## 🔧 ÉTAPE 4 : Configuration Avancée

### 4.1 Domaine Personnalisé (Optionnel)

#### **Pour le Backend :**
1. Va dans **taskflow-api** → **Settings** → **Custom Domains**
2. Clique sur **"Add Custom Domain"**
3. Entre ton domaine : `api.tondomaine.com`
4. Suis les instructions pour configurer le DNS

#### **Pour le Frontend :**
1. Va dans **taskflow-frontend** → **Settings** → **Custom Domains**
2. Clique sur **"Add Custom Domain"**
3. Entre ton domaine : `app.tondomaine.com`
4. Suis les instructions pour configurer le DNS

### 4.2 Activer les Logs

1. Va dans chaque service
2. Clique sur **"Logs"**
3. Active **"Live Logs"** pour voir en temps réel

### 4.3 Configurer les Alertes

1. Va dans **Settings** → **Notifications**
2. Active les alertes pour :
   - Deploy failures
   - Service crashes
   - High memory usage

---

## 📊 ÉTAPE 5 : Monitoring

### 5.1 Vérifier les Métriques

Dans chaque service, tu peux voir :
- **CPU Usage**
- **Memory Usage**
- **Request Count**
- **Response Time**

### 5.2 Logs Importants à Surveiller

```bash
# Backend logs
- "Application is running on..."
- "Database connected successfully"
- Erreurs de connexion
- Requêtes lentes (> 1s)

# Frontend logs
- Build success/failure
- Asset optimization
```

---

## 🚨 Dépannage

### Problème 1 : Backend ne démarre pas

**Vérifier :**
```bash
# Dans les logs Render
- "Cannot connect to database"
  → Vérifie DATABASE_URL
  
- "Port already in use"
  → Vérifie que PORT=3000 dans les env vars
  
- "Module not found"
  → Vérifie que npm install s'est bien exécuté
```

### Problème 2 : Frontend ne se connecte pas au Backend

**Vérifier :**
```bash
# Dans la console du navigateur
- CORS errors
  → Vérifie FRONTEND_URL dans le backend
  
- Network errors
  → Vérifie VITE_API_URL dans le frontend
  
- WebSocket connection failed
  → Vérifie VITE_WS_URL (doit être wss://)
```

### Problème 3 : Base de données vide

**Solution :**
```bash
# Connecte-toi à la DB via PSQL
psql postgresql://taskflow_user:password@dpg-xxxxx.frankfurt-postgres.render.com/taskflow_production

# Vérifie les tables
\dt

# Si vide, lance les migrations
# (depuis ton local avec l'External Database URL)
npm run migration:run
```

---

## 🎉 Félicitations !

Ton application TaskFlow est maintenant en production sur Render ! 🚀

**URLs de ton application :**
- 🌐 Frontend : `https://taskflow-frontend.onrender.com`
- 🔗 Backend API : `https://taskflow-api.onrender.com`
- 📊 Health Check : `https://taskflow-api.onrender.com/health`

**Prochaines étapes :**
1. ✅ Teste toutes les fonctionnalités
2. ✅ Configure un domaine personnalisé
3. ✅ Active les alertes de monitoring
4. ✅ Fais un backup de la base de données
5. ✅ Documente les URLs pour ton équipe

---

## 📝 Checklist de Déploiement

- [ ] Base de données PostgreSQL créée
- [ ] Backend déployé et accessible
- [ ] Frontend déployé et accessible
- [ ] Variables d'environnement configurées
- [ ] CORS configuré correctement
- [ ] OAuth configuré (si utilisé)
- [ ] Health check fonctionne
- [ ] WebSockets fonctionnent
- [ ] Compte utilisateur créé et testé
- [ ] Logs activés et surveillés
- [ ] Alertes configurées
- [ ] Documentation mise à jour

---

**Besoin d'aide ?**
- 📖 Documentation Render : https://render.com/docs
- 💬 Support Render : https://render.com/support
- 🐛 Issues GitHub : https://github.com/yourusername/taskflow/issues
