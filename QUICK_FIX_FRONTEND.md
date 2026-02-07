# 🚀 Fix Rapide - Frontend localhost:3000

## Le problème
Ton frontend déployé essaie de se connecter à `localhost:3000` au lieu de ton API en production.

## La solution en 3 étapes

### 1️⃣ Teste ton backend
```powershell
.\test-backend-api.ps1
```

Si ça échoue, ton backend n'est pas accessible. Vérifie Render.com.

### 2️⃣ Rebuild le frontend
```powershell
.\rebuild-and-deploy-frontend.ps1
```

Ce script va :
- Nettoyer le build précédent
- Builder avec les bonnes variables d'environnement
- Vérifier qu'il n'y a plus de `localhost:3000`

### 3️⃣ Redéploie

**Sur Vercel :**
```powershell
cd taskflow-frontend
vercel --prod
```

**Sur Netlify :**
```powershell
cd taskflow-frontend
netlify deploy --prod --dir=dist
```

**Manuellement :**
Uploade tout le contenu de `taskflow-frontend/dist/` sur ton hébergement.

## ✅ Vérification

Ouvre ton site et la console (F12) :
- Les requêtes doivent aller vers `https://gestion-pro-t1nn.onrender.com`
- Plus d'erreur `ERR_CONNECTION_REFUSED`
- Plus d'erreur 404 sur `/dashboard`

## 🔧 Fichiers modifiés

J'ai créé/modifié :
- ✅ `rebuild-and-deploy-frontend.ps1` - Script de rebuild automatique
- ✅ `test-backend-api.ps1` - Script de test de l'API
- ✅ `taskflow-frontend/vercel.json` - Config Vercel avec redirects
- ✅ `taskflow-frontend/netlify.toml` - Config Netlify
- ✅ `taskflow-frontend/public/_redirects` - Redirects pour SPA
- ✅ `FRONTEND_DEPLOYMENT_FIX.md` - Guide détaillé

## ⚡ Commandes rapides

```powershell
# Tout en une fois
.\test-backend-api.ps1
.\rebuild-and-deploy-frontend.ps1
cd taskflow-frontend
vercel --prod
```

C'est tout ! 🎉
