# Frontend Production Build Guide

## Vue d'ensemble

Ce guide explique comment builder et déployer correctement le frontend TaskFlow en production, en évitant l'erreur commune où le frontend essaie de se connecter à `localhost:3000` au lieu de l'API de production.

## Comprendre le problème

### Pourquoi `localhost:3000` apparaît dans le build ?

Vite injecte les variables d'environnement **au moment du build**, pas au runtime. Si vous buildez sans le fichier `.env.production` ou avec de mauvaises valeurs, ces valeurs incorrectes sont "gravées" dans le JavaScript compilé.

```javascript
// Dans le code source
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Après le build avec .env.production correct
const API_URL = 'https://gestion-pro-t1nn.onrender.com';

// Après le build SANS .env.production
const API_URL = 'http://localhost:3000'; // ❌ Problème !
```

## Configuration requise

### Fichier `.env.production`

Créez `taskflow-frontend/.env.production` avec :

```env
VITE_API_URL=https://gestion-pro-t1nn.onrender.com
VITE_WS_URL=wss://gestion-pro-t1nn.onrender.com
VITE_APP_NAME=TaskFlow
VITE_APP_VERSION=1.0.0
```

### Fichiers de redirection (SPA)

Pour que React Router fonctionne en production, vous avez besoin de redirections :

**Vercel** (`vercel.json`) :
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Netlify** (`netlify.toml` ou `public/_redirects`) :
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Processus de build

### Méthode automatique (recommandée)

```powershell
# 1. Tester l'API backend
.\test-backend-api.ps1

# 2. Builder le frontend
.\rebuild-and-deploy-frontend.ps1

# 3. Déployer
cd taskflow-frontend
vercel --prod
```

### Méthode manuelle

```powershell
# 1. Vérifier les variables d'environnement
cd taskflow-frontend
type .env.production

# 2. Nettoyer le build précédent
Remove-Item -Recurse -Force dist

# 3. Installer les dépendances
npm install

# 4. Builder en mode production
npm run build

# 5. Vérifier le build
# Ouvrir dist/assets/index-*.js
# Chercher "localhost:3000" - il ne devrait PAS y être

# 6. Déployer le dossier dist
```

## Vérifications post-build

### 1. Vérifier les variables injectées

```powershell
# Chercher localhost dans le build
cd taskflow-frontend/dist/assets
Select-String -Pattern "localhost:3000" -Path *.js
```

Si vous trouvez `localhost:3000`, le build est incorrect. Recommencez.

### 2. Tester localement

```powershell
cd taskflow-frontend
npm run preview
```

Ouvrez http://localhost:4173 et vérifiez dans la console (F12) que les requêtes vont vers l'API de production.

### 3. Vérifier la taille du build

```powershell
cd taskflow-frontend
Get-ChildItem -Path dist -Recurse | Measure-Object -Property Length -Sum
```

Le build devrait faire environ 1-2 MB.

## Déploiement

### Sur Vercel

```powershell
cd taskflow-frontend

# Première fois
vercel

# Déploiements suivants
vercel --prod
```

### Sur Netlify

```powershell
cd taskflow-frontend

# Première fois
netlify init

# Déploiements suivants
netlify deploy --prod --dir=dist
```

### Sur un serveur statique

1. Uploadez **tout le contenu** du dossier `dist/`
2. Configurez le serveur pour rediriger toutes les routes vers `index.html`

**Nginx** :
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Apache** (`.htaccess`) :
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Dépannage

### Le frontend appelle toujours localhost

**Cause** : Build incorrect ou cache navigateur

**Solution** :
1. Vider le cache du navigateur (Ctrl + Shift + Delete)
2. Rebuilder : `npm run build`
3. Vérifier `dist/assets/*.js` pour `localhost:3000`
4. Redéployer

### Erreur 404 sur les routes

**Cause** : Pas de redirection configurée

**Solution** :
- Vercel : Ajouter `rewrites` dans `vercel.json`
- Netlify : Créer `public/_redirects` ou `netlify.toml`
- Serveur : Configurer les redirections

### L'API ne répond pas

**Cause** : Backend non accessible ou CORS

**Solution** :
1. Tester l'API : `.\test-backend-api.ps1`
2. Vérifier les logs sur Render.com
3. Vérifier la configuration CORS dans le backend

### Variables d'environnement non prises en compte

**Cause** : Build fait avant la création de `.env.production`

**Solution** :
1. Créer/modifier `.env.production`
2. **Rebuilder** : `npm run build`
3. Redéployer

## Checklist de déploiement

- [ ] `.env.production` existe et contient les bonnes URLs
- [ ] Backend API est accessible (test avec `test-backend-api.ps1`)
- [ ] Build effectué : `npm run build`
- [ ] Aucun `localhost:3000` dans `dist/assets/*.js`
- [ ] Fichiers de redirection configurés (`vercel.json` ou `netlify.toml`)
- [ ] Test local avec `npm run preview`
- [ ] Déploiement effectué
- [ ] Test en production : ouvrir la console (F12) et vérifier les requêtes
- [ ] Pas d'erreur `ERR_CONNECTION_REFUSED`
- [ ] Pas d'erreur 404 sur les routes

## Scripts disponibles

| Script | Description |
|--------|-------------|
| `test-backend-api.ps1` | Teste que l'API backend est accessible |
| `rebuild-and-deploy-frontend.ps1` | Rebuild automatique avec vérifications |

## Ressources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel Deployment](https://vercel.com/docs)
- [Netlify Deployment](https://docs.netlify.com/)
- [React Router Deployment](https://reactrouter.com/en/main/guides/deployment)

## Notes importantes

1. **Toujours rebuilder après modification de `.env.production`**
2. **Les variables `VITE_*` sont publiques** - ne mettez pas de secrets dedans
3. **Tester localement avant de déployer** avec `npm run preview`
4. **Vider le cache navigateur** après chaque déploiement pour tester
