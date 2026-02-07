# 🔧 Fix des URLs Hardcodées

## Problème Résolu

Plusieurs fichiers du frontend contenaient des URLs hardcodées à `http://localhost:3000` au lieu d'utiliser la variable d'environnement `VITE_API_URL`.

## Fichiers Corrigés

### 1. `taskflow-frontend/src/services/dashboard.services.ts`
**Avant :**
```typescript
const API_URL = 'http://localhost:3000';
```

**Après :**
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

### 2. `taskflow-frontend/src/services/invitations.service.ts`
**Avant :**
```typescript
const API_URL = 'http://localhost:3000';
```

**Après :**
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```


### 3. `taskflow-frontend/src/pages/AuthPage.tsx`
**Avant :**
```typescript
onClick={() => window.location.href = 'http://localhost:3000/auth/google'}
onClick={() => window.location.href = 'http://localhost:3000/auth/github'}
```

**Après :**
```typescript
onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/google`}
onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/github`}
```

### 4. `taskflow-frontend/src/pages/AuthCallback.tsx`
**Avant :**
```typescript
fetch('http://localhost:3000/auth/profile', {
```

**Après :**
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
fetch(`${API_URL}/auth/profile`, {
```

### 5. `taskflow-frontend/src/components/TacheDetailModal.tsx`
**Avant :**
```typescript
fetch(`http://localhost:3000/commentaires?tache_id=${tache.id}`, ...)
fetch('http://localhost:3000/commentaires', ...)
```

**Après :**
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
fetch(`${API_URL}/commentaires?tache_id=${tache.id}`, ...)
fetch(`${API_URL}/commentaires`, ...)
```

## Script de Vérification

Un nouveau script a été créé pour vérifier qu'il n'y a plus d'URLs hardcodées :

```powershell
.\check-hardcoded-urls.ps1
```

Ce script :
- ✅ Cherche les URLs hardcodées dans tous les fichiers TypeScript/React
- ✅ Vérifie que `.env.production` existe
- ✅ Affiche les URLs trouvées

## Rebuild Requis

Après ces changements, vous DEVEZ rebuilder le frontend :

```powershell
.\rebuild-and-deploy-frontend.ps1
```

Le script de rebuild inclut maintenant la vérification automatique des URLs hardcodées.

## Vérification

Après le rebuild, vérifiez que :
- ✅ Aucune URL hardcodée dans le code source
- ✅ Le build ne contient pas `localhost:3000`
- ✅ Les requêtes vont vers l'API de production

## Impact

Ces changements permettent au frontend de :
- ✅ Utiliser l'API de production quand déployé
- ✅ Utiliser localhost en développement
- ✅ Être configurable via `.env.production`

## Commandes Rapides

```powershell
# Vérifier les URLs hardcodées
.\check-hardcoded-urls.ps1

# Rebuilder et déployer
.\rebuild-and-deploy-frontend.ps1

# Workflow complet
.\deploy-frontend-complete.ps1 -AutoDeploy -Platform vercel
```
