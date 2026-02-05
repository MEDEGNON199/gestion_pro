# 🔐 Configuration OAuth pour TaskFlow

## ✅ Statut actuel

**IMPLÉMENTATION COMPLÈTE** - Les boutons Google et GitHub sont maintenant fonctionnels !

### Ce qui est déjà fait :
- ✅ Packages OAuth installés (`passport-google-oauth20`, `passport-github2`)
- ✅ Stratégies OAuth créées (Google + GitHub)
- ✅ Routes backend configurées (`/auth/google`, `/auth/github`, callbacks)
- ✅ Service d'authentification OAuth implémenté
- ✅ Interface utilisateur avec boutons fonctionnels
- ✅ Page de callback OAuth créée
- ✅ Route frontend `/auth/callback` ajoutée
- ✅ Variables d'environnement ajoutées au .env

## 🚀 Étapes finales pour activer OAuth

### 1. Configuration Google OAuth

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet ou sélectionner un existant
3. Activer l'API Google+ 
4. Créer des identifiants OAuth 2.0
5. Ajouter les URLs de redirection :
   - `http://localhost:3000/auth/google/callback`
6. Copier le Client ID et Client Secret

### 2. Configuration GitHub OAuth

1. Aller sur [GitHub Developer Settings](https://github.com/settings/developers)
2. Créer une nouvelle OAuth App
3. Configurer :
   - Homepage URL: `http://localhost:5173`
   - Authorization callback URL: `http://localhost:3000/auth/github/callback`
4. Copier le Client ID et Client Secret

### 3. Mettre à jour les variables d'environnement

Dans `taskflow-api/.env`, remplacer les valeurs placeholder :

```env
# OAuth Configuration
GOOGLE_CLIENT_ID=votre_vrai_google_client_id
GOOGLE_CLIENT_SECRET=votre_vrai_google_client_secret
GITHUB_CLIENT_ID=votre_vrai_github_client_id
GITHUB_CLIENT_SECRET=votre_vrai_github_client_secret
```

### 4. Migration base de données (si pas encore fait)

```sql
ALTER TABLE utilisateurs 
ADD COLUMN IF NOT EXISTS provider VARCHAR(50),
ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS avatar TEXT,
ALTER COLUMN mot_de_passe DROP NOT NULL;
```

## 🎯 Test complet

1. Lancer le backend : `cd taskflow-api && npm run start:dev`
2. Lancer le frontend : `cd taskflow-frontend && npm run dev`  
3. Aller sur `http://localhost:5173/auth`
4. Cliquer sur "Google" ou "GitHub"
5. Autoriser l'application
6. Être automatiquement redirigé vers le dashboard !

## ✨ Fonctionnalités OAuth

- 🔐 **Connexion Google OAuth** - Un clic pour se connecter
- 🔐 **Connexion GitHub OAuth** - Un clic pour se connecter  
- 👤 **Création automatique de compte** - Pas besoin de s'inscrire
- 🔗 **Liaison avec comptes existants** - Si l'email existe déjà
- 🖼️ **Avatar automatique** - Photo de profil depuis OAuth
- 🚀 **Redirection automatique** - Vers le dashboard après connexion
- ⚡ **Gestion des erreurs** - Messages d'erreur clairs
- 🎨 **Interface propre** - Boutons intégrés au design

## 🔧 Architecture technique

```
Frontend (React)                Backend (NestJS)
┌─────────────────┐            ┌──────────────────┐
│ AuthPage        │            │ AuthController   │
│ - Boutons OAuth │ ────────▶  │ - /auth/google   │
│                 │            │ - /auth/github   │
└─────────────────┘            └──────────────────┘
         │                              │
         │                              ▼
┌─────────────────┐            ┌──────────────────┐
│ AuthCallback    │ ◀────────  │ OAuth Strategies │
│ - Récupère JWT  │            │ - GoogleStrategy │
│ - Redirige      │            │ - GitHubStrategy │
└─────────────────┘            └──────────────────┘
```

**Les boutons Google et GitHub sont maintenant 100% fonctionnels !** 🎉

Il suffit de configurer les OAuth Apps et mettre à jour les variables d'environnement.