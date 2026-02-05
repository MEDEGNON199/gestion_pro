# Variables d'environnement Render

## Backend (taskflow-api)

Copiez ces variables dans Render Dashboard > taskflow-api > Environment:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=[Auto-généré par Render depuis la base de données]
JWT_SECRET=[Générer un secret aléatoire - 32+ caractères]
JWT_EXPIRES_IN=24h
FRONTEND_URL=https://taskflow-frontend.onrender.com
```

### Variables OAuth (optionnelles - à ajouter plus tard):
```
GOOGLE_CLIENT_ID=votre_google_client_id
GOOGLE_CLIENT_SECRET=votre_google_client_secret
GITHUB_CLIENT_ID=votre_github_client_id
GITHUB_CLIENT_SECRET=votre_github_client_secret
OAUTH_CALLBACK_URL=https://taskflow-api.onrender.com/auth
```

### Variables Email (optionnelles):
```
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=votre_email@gmail.com
MAIL_PASS=votre_mot_de_passe_app
```

## Frontend (taskflow-frontend)

```
VITE_API_URL=https://taskflow-api.onrender.com
VITE_WS_URL=wss://taskflow-api.onrender.com
VITE_APP_NAME=TaskFlow
VITE_APP_VERSION=1.0.0
```

## Comment générer JWT_SECRET

Sur PowerShell:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

Ou utilisez ce site: https://generate-secret.vercel.app/32
