# 🚀 Démarrage Rapide - Déploiement sur Render

## ⚡ En 5 Minutes

### 1️⃣ Prépare ton Code (2 min)

```bash
# Vérifie que tout est prêt
chmod +x pre-deploy-check.sh
./pre-deploy-check.sh

# Si tout est OK, pousse sur GitHub
git add .
git commit -m "feat: ready for production deployment on Render"
git push origin main
```

### 2️⃣ Crée un Compte Render (1 min)

1. Va sur https://render.com
2. Clique sur "Get Started"
3. Connecte-toi avec GitHub

### 3️⃣ Déploie en 3 Clics (2 min)

#### A. Base de Données
1. Dashboard → "New +" → "PostgreSQL"
2. Name: `taskflow-db`, Plan: Free
3. Create Database
4. **COPIE l'Internal Database URL**

#### B. Backend
1. Dashboard → "New +" → "Web Service"
2. Connecte ton repo GitHub
3. Configure:
   - Name: `taskflow-api`
   - Root Directory: `taskflow-api`
   - Build: `npm install && npm run build`
   - Start: `npm run start:prod`
4. Ajoute les variables d'environnement:
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=[colle l'URL de la DB]
   JWT_SECRET=[génère avec: openssl rand -base64 32]
   FRONTEND_URL=https://taskflow-frontend.onrender.com
   ```
5. Create Web Service

#### C. Frontend
1. Dashboard → "New +" → "Static Site"
2. Connecte ton repo GitHub
3. Configure:
   - Name: `taskflow-frontend`
   - Root Directory: `taskflow-frontend`
   - Build: `npm install && npm run build`
   - Publish: `dist`
4. Ajoute les variables:
   ```
   VITE_API_URL=https://taskflow-api.onrender.com
   VITE_WS_URL=wss://taskflow-api.onrender.com
   ```
5. Create Static Site

### 4️⃣ C'est Fini ! 🎉

Ton app est en ligne :
- Frontend: `https://taskflow-frontend.onrender.com`
- Backend: `https://taskflow-api.onrender.com/health`

---

## 📚 Guides Détaillés

Besoin de plus d'infos ?

- 📖 **Guide Complet** : [RENDER_DEPLOYMENT_GUIDE.md](./docs/RENDER_DEPLOYMENT_GUIDE.md)
- ✅ **Checklist** : [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- 📊 **Résumé** : [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)

---

## 🆘 Problèmes ?

### Backend ne démarre pas
```bash
# Vérifie les logs dans Render Dashboard
# Problèmes courants:
- DATABASE_URL incorrect
- JWT_SECRET manquant
- Build failed → vérifie package.json
```

### Frontend ne se connecte pas
```bash
# Vérifie dans la console du navigateur
# Problèmes courants:
- VITE_API_URL incorrect
- CORS error → vérifie FRONTEND_URL dans le backend
- WebSocket error → vérifie VITE_WS_URL (doit être wss://)
```

---

**Temps total : ~5 minutes** ⏱️

Bonne chance ! 🚀
