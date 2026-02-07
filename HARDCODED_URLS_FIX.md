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
