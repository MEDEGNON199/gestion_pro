# 🔄 TaskFlow Deployment Workflow

## Vue d'ensemble du processus

```
┌─────────────────────────────────────────────────────────────┐
│                    DÉPLOIEMENT TASKFLOW                      │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   BACKEND    │      │   FRONTEND   │      │ VÉRIFICATION │
│   (Render)   │ ───> │   (Build)    │ ───> │  (Testing)   │
└──────────────┘      └──────────────┘      └──────────────┘
       │                     │                      │
       │                     │                      │
       v                     v                      v
  API en ligne         dist/ prêt            Tout fonctionne
```

---

## 🎯 Workflow Complet

### Étape 1 : Déployer le Backend

```powershell
# Le backend doit être déployé en premier
# Sur Render.com ou votre plateforme
```

**Vérifications :**
- ✅ Backend accessible à `https://gestion-pro-t1nn.onrender.com`
- ✅ Base de données PostgreSQL connectée
- ✅ Variables d'environnement configurées
- ✅ CORS configuré pour accepter le frontend

---

### Étape 2 : Configurer le Frontend

```powershell
# Créer/vérifier taskflow-frontend/.env.production
VITE_API_URL=https://gestion-pro-t1nn.onrender.com
VITE_WS_URL=wss://gestion-pro-t1nn.onrender.com
VITE_APP_NAME=TaskFlow
VITE_APP_VERSION=1.0.0
```

**Vérifications :**
- ✅ Fichier `.env.production` existe
- ✅ URL de l'API est correcte
- ✅ Pas de `localhost` dans les URLs

---

### Étape 3 : Tester l'API

```powershell
.\test-backend-api.ps1
```

**Ce qui est testé :**
- ✅ Endpoint racine `/`
- ✅ Health check `/health`
- ✅ Auth endpoint `/auth/login`
- ✅ Dashboard endpoint `/dashboard/stats`

**Si ça échoue :**
- Vérifier que le backend est en ligne
- Vérifier les logs sur Render.com
- Vérifier l'URL dans `.env.production`

---

### Étape 4 : Builder le Frontend

```powershell
.\rebuild-and-deploy-frontend.ps1
```

**Ce qui se passe :**
1. Nettoyage du dossier `dist/`
2. Installation des dépendances
3. Build avec Vite (injecte les variables d'environnement)
4. Vérification qu'il n'y a pas de `localhost:3000`
5. Affichage de la taille du build

**Résultat :**
- ✅ Dossier `taskflow-frontend/dist/` créé
- ✅ Fichiers optimisés et minifiés
- ✅ Variables d'environnement injectées

---

### Étape 5 : Tester Localement (Optionnel)

```powershell
cd taskflow-frontend
npm run preview
```

**Ouvrir :** http://localhost:4173

**Vérifications :**
- ✅ Ouvrir la console (F12)
- ✅ Vérifier que les requêtes vont vers l'API de production
- ✅ Tester la connexion
- ✅ Pas d'erreur `ERR_CONNECTION_REFUSED`

---

### Étape 6 : Déployer le Frontend

#### Option A : Vercel (Recommandé)

```powershell
cd taskflow-frontend
vercel --prod
```

**Avantages :**
- ✅ Déploiement ultra-rapide
- ✅ CDN global automatique
- ✅ HTTPS automatique
- ✅ Redirections SPA configurées

#### Option B : Netlify

```powershell
cd taskflow-frontend
netlify deploy --prod --dir=dist
```

**Avantages :**
- ✅ Interface simple
- ✅ Déploiement continu
- ✅ Formulaires et fonctions serverless

#### Option C : Manuel

1. Uploader le contenu de `taskflow-frontend/dist/`
2. Configurer les redirections pour SPA
3. Configurer HTTPS

---

### Étape 7 : Vérification en Production

```
1. Ouvrir votre site en production
2. Ouvrir la console (F12)
3. Onglet Network
4. Vérifier les requêtes API
```

**Checklist :**
- ✅ Pas d'erreur `ERR_CONNECTION_REFUSED`
- ✅ Requêtes vont vers `https://gestion-pro-t1nn.onrender.com`
- ✅ Pas d'erreur 404 sur les routes (`/dashboard`, `/projets`, etc.)
- ✅ Connexion fonctionne
- ✅ Création de projet fonctionne
- ✅ WebSocket connecté (temps réel)

---

## 🚀 Workflow Automatisé (Recommandé)

### Une seule commande pour tout faire :

```powershell
.\deploy-frontend-complete.ps1 -AutoDeploy -Platform vercel
```

**Ce que ça fait :**
1. ✅ Teste l'API backend
2. ✅ Build le frontend
3. ✅ Vérifie le build
4. ✅ Déploie sur Vercel

**Options disponibles :**
```powershell
# Ignorer les tests de l'API
.\deploy-frontend-complete.ps1 -SkipTests

# Déployer sur Netlify
.\deploy-frontend-complete.ps1 -AutoDeploy -Platform netlify

# Build seulement (déploiement manuel)
.\deploy-frontend-complete.ps1 -AutoDeploy -Platform manual
```

---

## 🔧 Dépannage Rapide

### Problème : Frontend appelle localhost:3000

**Cause :** Build fait sans `.env.production` ou avec de mauvaises valeurs

**Solution :**
```powershell
.\rebuild-and-deploy-frontend.ps1
cd taskflow-frontend
vercel --prod
```

### Problème : Erreur 404 sur /dashboard

**Cause :** Pas de redirection configurée pour SPA

**Solution :**
- Vérifier que `vercel.json` contient les redirections
- Vérifier que `netlify.toml` existe
- Redéployer

### Problème : API ne répond pas

**Cause :** Backend non accessible ou CORS

**Solution :**
```powershell
.\test-backend-api.ps1
```
Puis vérifier les logs sur Render.com

### Problème : WebSocket ne se connecte pas

**Cause :** URL WebSocket incorrecte ou CORS

**Solution :**
- Vérifier `VITE_WS_URL` dans `.env.production`
- Vérifier la config CORS du backend
- Rebuilder et redéployer

---

## 📊 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────┐
│                    PROCESSUS COMPLET                         │
└─────────────────────────────────────────────────────────────┘

1. Backend déployé sur Render
   │
   ├─> PostgreSQL connectée
   ├─> Variables d'env configurées
   └─> CORS configuré
   
2. Configuration Frontend
   │
   ├─> .env.production créé
   └─> URLs de l'API configurées
   
3. Test de l'API
   │
   ├─> test-backend-api.ps1
   └─> ✅ API accessible
   
4. Build Frontend
   │
   ├─> rebuild-and-deploy-frontend.ps1
   ├─> Variables injectées
   └─> ✅ dist/ créé
   
5. Test Local (optionnel)
   │
   ├─> npm run preview
   └─> ✅ Fonctionne localement
   
6. Déploiement
   │
   ├─> vercel --prod
   └─> ✅ En ligne
   
7. Vérification Production
   │
   ├─> Ouvrir le site
   ├─> Console (F12)
   └─> ✅ Tout fonctionne
```

---

## 📚 Documentation Complète

| Document | Description |
|----------|-------------|
| [QUICK_FIX_FRONTEND.md](QUICK_FIX_FRONTEND.md) | Fix rapide localhost:3000 |
| [SCRIPTS_DEPLOYMENT.md](SCRIPTS_DEPLOYMENT.md) | Guide des scripts |
| [FRONTEND_DEPLOYMENT_FIX.md](FRONTEND_DEPLOYMENT_FIX.md) | Guide détaillé du problème |
| [docs/FRONTEND_PRODUCTION_BUILD.md](docs/FRONTEND_PRODUCTION_BUILD.md) | Build en production |
| [docs/RENDER_DEPLOYMENT_GUIDE.md](docs/RENDER_DEPLOYMENT_GUIDE.md) | Déploiement Render |
| [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | Checklist complète |

---

## 💡 Bonnes Pratiques

1. **Toujours déployer le backend en premier**
2. **Toujours tester l'API avant de builder** : `.\test-backend-api.ps1`
3. **Toujours vérifier le build localement** : `npm run preview`
4. **Toujours vider le cache après déploiement** : Ctrl + Shift + Delete
5. **Garder `.env.production` à jour** avec les bonnes URLs
6. **Ne jamais commiter `.env.production`** (dans `.gitignore`)
7. **Tester en production après chaque déploiement**

---

## ⚡ Commandes Rapides

```powershell
# Workflow complet automatisé
.\deploy-frontend-complete.ps1 -AutoDeploy -Platform vercel

# Workflow manuel
.\test-backend-api.ps1
.\rebuild-and-deploy-frontend.ps1
cd taskflow-frontend
vercel --prod

# Fix rapide
.\rebuild-and-deploy-frontend.ps1
cd taskflow-frontend
vercel --prod
```

---

## 🎓 Comprendre le Problème localhost:3000

### Pourquoi ça arrive ?

Vite injecte les variables d'environnement **au moment du build** :

```javascript
// Code source
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Après build AVEC .env.production
const API_URL = 'https://gestion-pro-t1nn.onrender.com'; // ✅

// Après build SANS .env.production
const API_URL = 'http://localhost:3000'; // ❌
```

### La solution

1. Créer `.env.production` avec les bonnes URLs
2. **Rebuilder** : `npm run build`
3. Redéployer

**Important :** Les variables sont "gravées" dans le JavaScript compilé. Modifier `.env.production` après le build ne change rien. Il faut rebuilder.

---

**Besoin d'aide ?** Consultez [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
