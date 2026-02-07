# 📜 Scripts de Déploiement TaskFlow

Ce document explique tous les scripts PowerShell disponibles pour faciliter le déploiement du frontend.

## 🎯 Scripts disponibles

### 1. `test-backend-api.ps1` - Test de l'API Backend

**Usage :**
```powershell
.\test-backend-api.ps1
```

**Ce qu'il fait :**
- ✅ Lit l'URL de l'API depuis `.env.production`
- ✅ Teste plusieurs endpoints (`/`, `/health`, `/auth/login`, `/dashboard/stats`)
- ✅ Affiche un rapport détaillé de l'état de l'API

**Quand l'utiliser :**
- Avant de builder le frontend
- Pour diagnostiquer des problèmes de connexion
- Pour vérifier que le backend est bien déployé

---

### 2. `rebuild-and-deploy-frontend.ps1` - Rebuild du Frontend

**Usage :**
```powershell
.\rebuild-and-deploy-frontend.ps1
```

**Ce qu'il fait :**
- ✅ Vérifie que `.env.production` existe
- ✅ Affiche les variables d'environnement
- ✅ Demande confirmation
- ✅ Nettoie le dossier `dist`
- ✅ Installe les dépendances
- ✅ Build le frontend
- ✅ Vérifie qu'il n'y a plus de `localhost:3000` dans le build
- ✅ Affiche la taille du build

**Quand l'utiliser :**
- Après avoir modifié `.env.production`
- Quand le frontend appelle `localhost:3000` en production
- Avant chaque déploiement

---

### 3. `deploy-frontend-complete.ps1` - Déploiement Complet

**Usage basique :**
```powershell
.\deploy-frontend-complete.ps1
```

**Usage avancé :**
```powershell
# Ignorer les tests de l'API
.\deploy-frontend-complete.ps1 -SkipTests

# Déployer automatiquement sur Vercel
.\deploy-frontend-complete.ps1 -AutoDeploy -Platform vercel

# Déployer automatiquement sur Netlify
.\deploy-frontend-complete.ps1 -AutoDeploy -Platform netlify

# Build seulement (déploiement manuel)
.\deploy-frontend-complete.ps1 -AutoDeploy -Platform manual
```

**Ce qu'il fait :**
- ✅ **Étape 1** : Teste l'API backend (sauf si `-SkipTests`)
- ✅ **Étape 2** : Build le frontend avec vérifications
- ✅ **Étape 3** : Déploie (si `-AutoDeploy`)

**Quand l'utiliser :**
- Pour un déploiement complet en une commande
- Quand vous voulez automatiser tout le processus

---

## 🚀 Workflows recommandés

### Workflow 1 : Premier déploiement

```powershell
# 1. Tester l'API
.\test-backend-api.ps1

# 2. Builder le frontend
.\rebuild-and-deploy-frontend.ps1

# 3. Déployer manuellement
cd taskflow-frontend
vercel --prod
```

### Workflow 2 : Déploiement rapide

```powershell
# Tout en une commande
.\deploy-frontend-complete.ps1 -AutoDeploy -Platform vercel
```

### Workflow 3 : Déploiement après modification

```powershell
# Si vous avez modifié .env.production ou le code
.\rebuild-and-deploy-frontend.ps1
cd taskflow-frontend
vercel --prod
```

### Workflow 4 : Diagnostic de problème

```powershell
# 1. Tester l'API
.\test-backend-api.ps1

# 2. Si l'API est OK, rebuilder
.\rebuild-and-deploy-frontend.ps1

# 3. Vérifier le build localement
cd taskflow-frontend
npm run preview
# Ouvrir http://localhost:4173 et tester
```

---

## 📋 Checklist de déploiement

Utilisez cette checklist pour chaque déploiement :

### Avant le build
- [ ] Le backend est déployé et accessible
- [ ] `taskflow-frontend/.env.production` existe
- [ ] Les URLs dans `.env.production` sont correctes
- [ ] Vous avez testé l'API : `.\test-backend-api.ps1`

### Pendant le build
- [ ] Exécuter : `.\rebuild-and-deploy-frontend.ps1`
- [ ] Vérifier qu'il n'y a pas d'erreurs
- [ ] Vérifier qu'il n'y a pas de `localhost:3000` dans le build

### Après le build
- [ ] Tester localement : `cd taskflow-frontend && npm run preview`
- [ ] Vérifier dans la console (F12) que les requêtes vont vers l'API de prod

### Déploiement
- [ ] Déployer sur votre plateforme (Vercel, Netlify, etc.)
- [ ] Attendre que le déploiement soit terminé
- [ ] Vider le cache du navigateur (Ctrl + Shift + Delete)

### Vérification en production
- [ ] Ouvrir votre site en production
- [ ] Ouvrir la console (F12)
- [ ] Vérifier qu'il n'y a pas d'erreur `ERR_CONNECTION_REFUSED`
- [ ] Vérifier que les requêtes vont vers l'API de production
- [ ] Tester la connexion
- [ ] Tester les fonctionnalités principales

---

## 🔧 Dépannage

### Le script ne s'exécute pas

**Erreur** : `impossible de charger le fichier car l'exécution de scripts est désactivée`

**Solution** :
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### L'API n'est pas accessible

**Symptômes** : `test-backend-api.ps1` échoue

**Solutions** :
1. Vérifier que le backend est déployé sur Render.com
2. Vérifier les logs du backend
3. Vérifier l'URL dans `.env.production`
4. Tester l'URL manuellement dans le navigateur

### Le build contient toujours `localhost:3000`

**Symptômes** : Le script trouve `localhost:3000` dans le build

**Solutions** :
1. Vérifier que `.env.production` existe
2. Vérifier que `VITE_API_URL` est correct dans `.env.production`
3. Supprimer `node_modules` et `dist`, puis rebuilder :
   ```powershell
   cd taskflow-frontend
   Remove-Item -Recurse -Force node_modules, dist
   npm install
   npm run build
   ```

### Le déploiement échoue

**Symptômes** : Erreur lors de `vercel --prod` ou `netlify deploy`

**Solutions** :
1. Vérifier que vous êtes connecté : `vercel login` ou `netlify login`
2. Vérifier que vous êtes dans le bon dossier : `cd taskflow-frontend`
3. Vérifier que le dossier `dist` existe et contient des fichiers

### Erreur 404 sur les routes en production

**Symptômes** : `/dashboard` retourne 404

**Solutions** :
1. Vérifier que `vercel.json` contient les redirections
2. Vérifier que `netlify.toml` ou `public/_redirects` existe
3. Redéployer après avoir ajouté ces fichiers

---

## 📚 Documentation complémentaire

- [QUICK_FIX_FRONTEND.md](QUICK_FIX_FRONTEND.md) - Guide rapide de fix
- [FRONTEND_DEPLOYMENT_FIX.md](FRONTEND_DEPLOYMENT_FIX.md) - Guide détaillé du problème
- [docs/FRONTEND_PRODUCTION_BUILD.md](docs/FRONTEND_PRODUCTION_BUILD.md) - Guide complet du build

---

## 💡 Conseils

1. **Toujours tester l'API avant de builder** : `.\test-backend-api.ps1`
2. **Toujours vérifier le build localement** : `npm run preview`
3. **Toujours vider le cache après déploiement** : Ctrl + Shift + Delete
4. **Garder `.env.production` à jour** avec les bonnes URLs
5. **Ne jamais commiter `.env.production`** (il est dans `.gitignore`)

---

## 🎓 Comprendre les variables d'environnement Vite

Les variables `VITE_*` sont **injectées au moment du build**, pas au runtime :

```javascript
// Code source
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Après build avec .env.production
const API_URL = 'https://gestion-pro-t1nn.onrender.com';
```

C'est pourquoi vous devez **rebuilder** après chaque modification de `.env.production`.

---

## ⚡ Commandes rapides

```powershell
# Workflow complet en 2 commandes
.\deploy-frontend-complete.ps1 -AutoDeploy -Platform vercel

# Ou manuellement
.\test-backend-api.ps1 && .\rebuild-and-deploy-frontend.ps1
cd taskflow-frontend
vercel --prod
```

---

**Besoin d'aide ?** Consultez [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
