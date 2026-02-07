# Fix Frontend Deployment - Erreur localhost:3000

## 🔴 Problème
Le frontend déployé essaie de se connecter à `localhost:3000` au lieu de l'API en production.

## ✅ Solution

### Option 1 : Script Automatique (Recommandé)

Exécutez le script PowerShell :

```powershell
.\rebuild-and-deploy-frontend.ps1
```

Le script va :
- ✅ Vérifier que `.env.production` existe
- ✅ Afficher les variables d'environnement
- ✅ Nettoyer le dossier `dist`
- ✅ Installer les dépendances
- ✅ Builder le frontend avec les bonnes variables
- ✅ Vérifier qu'il n'y a plus de référence à `localhost:3000`

### Option 2 : Manuellement

```powershell
# 1. Aller dans le dossier frontend
cd taskflow-frontend

# 2. Vérifier le fichier .env.production
type .env.production

# 3. Nettoyer et builder
Remove-Item -Recurse -Force dist
npm install
npm run build

# 4. Vérifier le build
# Ouvrir dist/assets/index-*.js et chercher "localhost:3000"
# Il ne devrait PAS y être

# 5. Déployer le dossier dist
```

## 📋 Vérifications

### Avant le build
- [ ] Le fichier `taskflow-frontend/.env.production` existe
- [ ] Il contient `VITE_API_URL=https://gestion-pro-t1nn.onrender.com`
- [ ] Votre API backend est accessible à cette URL

### Après le build
- [ ] Le dossier `taskflow-frontend/dist` a été créé
- [ ] Aucune référence à `localhost:3000` dans les fichiers JS
- [ ] Le fichier `dist/index.html` existe

### Après le déploiement
- [ ] Ouvrir la console du navigateur (F12)
- [ ] Vérifier que les requêtes vont vers `https://gestion-pro-t1nn.onrender.com`
- [ ] Plus d'erreur `ERR_CONNECTION_REFUSED`

## 🚀 Déploiement

### Sur Vercel
```bash
cd taskflow-frontend
vercel --prod
```

### Sur Netlify
```bash
cd taskflow-frontend
netlify deploy --prod --dir=dist
```

### Sur un serveur statique
Uploadez tout le contenu du dossier `dist/` sur votre hébergement.

## 🔧 Variables d'environnement requises

Fichier : `taskflow-frontend/.env.production`

```env
VITE_API_URL=https://gestion-pro-t1nn.onrender.com
VITE_WS_URL=wss://gestion-pro-t1nn.onrender.com
VITE_APP_NAME=TaskFlow
VITE_APP_VERSION=1.0.0
```

## ⚠️ Important

Les variables `VITE_*` sont injectées **au moment du build**, pas au runtime. 

Si vous changez `.env.production`, vous DEVEZ rebuilder :
```bash
npm run build
```

## 🐛 Dépannage

### Le problème persiste après rebuild
1. Vider le cache du navigateur (Ctrl + Shift + Delete)
2. Vérifier que vous avez bien redéployé le nouveau build
3. Vérifier dans la console réseau (F12 > Network) quelle URL est appelée

### L'API ne répond pas
1. Vérifier que votre backend Render est en ligne
2. Tester l'URL directement : `https://gestion-pro-t1nn.onrender.com/health`
3. Vérifier les CORS dans le backend

### Erreur 404 sur /dashboard
C'est normal si vous utilisez React Router. Configurez votre hébergement pour rediriger toutes les routes vers `index.html`.

**Vercel** : Créer `vercel.json`
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Netlify** : Créer `_redirects` dans `public/`
```
/*    /index.html   200
```
