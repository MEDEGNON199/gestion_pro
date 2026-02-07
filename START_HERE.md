# 🚀 START HERE - Fix Frontend Deployment

## 🔴 Vous avez cette erreur ?

```
Error loading stats: localhost:3000/dashboard/stats
Failed to load resource: net::ERR_CONNECTION_REFUSED
```

**Vous êtes au bon endroit !**

---

## ⚡ Solution Rapide (2 minutes)

### Étape 1 : Ouvrir PowerShell dans ce dossier

```powershell
# Clic droit dans le dossier > "Ouvrir dans le terminal"
```

### Étape 2 : Exécuter cette commande

```powershell
.\deploy-frontend-complete.ps1 -AutoDeploy -Platform vercel
```

**C'est tout !** Le script va :
- ✅ Tester votre API backend
- ✅ Rebuilder le frontend avec les bonnes URLs
- ✅ Vérifier qu'il n'y a plus de `localhost:3000`
- ✅ Déployer sur Vercel

---

## 📖 Vous voulez comprendre ?

### Le problème

Votre frontend essaie de se connecter à `localhost:3000` au lieu de votre API en production (`https://gestion-pro-t1nn.onrender.com`).

### Pourquoi ?

Vite injecte les variables d'environnement **au moment du build**. Si vous avez build sans le fichier `.env.production`, l'URL `localhost:3000` est "gravée" dans le JavaScript compilé.

### La solution

1. Créer/vérifier `.env.production` avec les bonnes URLs
2. **Rebuilder** le frontend
3. Redéployer

---

## 🎯 Guides Disponibles

| Guide | Pour qui ? | Temps |
|-------|-----------|-------|
| [FIX_LOCALHOST_ERROR.txt](FIX_LOCALHOST_ERROR.txt) | Tous - Guide visuel | 1 min |
| [QUICK_FIX_FRONTEND.md](QUICK_FIX_FRONTEND.md) | Débutants - 3 étapes | 2 min |
| [SCRIPTS_DEPLOYMENT.md](SCRIPTS_DEPLOYMENT.md) | Intermédiaire - Scripts | 5 min |
| [DEPLOYMENT_WORKFLOW.md](DEPLOYMENT_WORKFLOW.md) | Tous - Workflow complet | 10 min |
| [FRONTEND_DEPLOYMENT_FIX.md](FRONTEND_DEPLOYMENT_FIX.md) | Avancé - Détails | 15 min |

---

## 🛠️ Scripts Disponibles

```powershell
# Afficher le guide visuel
.\show-fix-guide.ps1

# Tester l'API backend
.\test-backend-api.ps1

# Rebuilder le frontend
.\rebuild-and-deploy-frontend.ps1

# Workflow complet automatisé
.\deploy-frontend-complete.ps1 -AutoDeploy -Platform vercel
```

---

## 📋 Checklist Rapide

Avant de commencer :
- [ ] Votre backend est déployé sur Render.com
- [ ] Vous avez accès à PowerShell
- [ ] Vous avez Vercel CLI installé (`npm i -g vercel`)

Après le déploiement :
- [ ] Ouvrir votre site en production
- [ ] Ouvrir la console (F12)
- [ ] Vérifier que les requêtes vont vers `https://gestion-pro-t1nn.onrender.com`
- [ ] Tester la connexion

---

## 🎓 Workflow Recommandé

### Pour les pressés (2 minutes)

```powershell
.\deploy-frontend-complete.ps1 -AutoDeploy -Platform vercel
```

### Pour ceux qui veulent comprendre (5 minutes)

```powershell
# 1. Lire le guide visuel
.\show-fix-guide.ps1

# 2. Tester l'API
.\test-backend-api.ps1

# 3. Rebuilder
.\rebuild-and-deploy-frontend.ps1

# 4. Déployer
cd taskflow-frontend
vercel --prod
```

---

## 🔧 Configuration Requise

### Fichier `.env.production`

Vérifiez que `taskflow-frontend/.env.production` contient :

```env
VITE_API_URL=https://gestion-pro-t1nn.onrender.com
VITE_WS_URL=wss://gestion-pro-t1nn.onrender.com
VITE_APP_NAME=TaskFlow
VITE_APP_VERSION=1.0.0
```

**Ce fichier existe déjà** dans votre projet. Si vous l'avez modifié, vous devez rebuilder.

---

## ✅ Vérification Post-Déploiement

1. **Ouvrir votre site** en production
2. **Ouvrir la console** (F12)
3. **Onglet Network**
4. **Vérifier les requêtes** :
   - ✅ Doivent aller vers `https://gestion-pro-t1nn.onrender.com`
   - ❌ PAS vers `localhost:3000`

---

## 🆘 Problèmes ?

### Le script ne s'exécute pas

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### L'API ne répond pas

```powershell
.\test-backend-api.ps1
```

Puis vérifiez les logs sur Render.com

### Le problème persiste

1. Vider le cache du navigateur (Ctrl + Shift + Delete)
2. Vérifier que vous avez bien redéployé le nouveau build
3. Consulter [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

---

## 📚 Documentation Complète

- [DEPLOYMENT_FILES_INDEX.md](DEPLOYMENT_FILES_INDEX.md) - Index de tous les fichiers
- [README.md](README.md) - Documentation principale du projet
- [docs/](docs/) - Documentation technique complète

---

## 💡 Conseil

**Utilisez le script automatisé** pour gagner du temps :

```powershell
.\deploy-frontend-complete.ps1 -AutoDeploy -Platform vercel
```

Il fait tout pour vous et affiche des messages clairs à chaque étape.

---

## 🎉 Après le Fix

Une fois le déploiement terminé :

1. ✅ Plus d'erreur `ERR_CONNECTION_REFUSED`
2. ✅ Les requêtes vont vers l'API de production
3. ✅ La connexion fonctionne
4. ✅ Toutes les fonctionnalités marchent

**Votre application est maintenant correctement déployée !**

---

**Besoin d'aide ?** Consultez [QUICK_FIX_FRONTEND.md](QUICK_FIX_FRONTEND.md) ou [DEPLOYMENT_WORKFLOW.md](DEPLOYMENT_WORKFLOW.md)
