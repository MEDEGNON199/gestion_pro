# Packages à installer pour OAuth

```bash
cd taskflow-api
npm install passport-google-oauth20 passport-github2
npm install @types/passport-google-oauth20 @types/passport-github2 --save-dev
```

# Variables d'environnement à ajouter dans .env

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth  
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Callback URLs
OAUTH_CALLBACK_URL=http://localhost:3000/auth
```