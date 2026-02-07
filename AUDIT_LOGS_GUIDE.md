# 📝 Guide Rapide - Logs d'Audit TaskFlow

## 🎯 C'est quoi ?

Un système qui enregistre **toutes les actions** des utilisateurs sur TaskFlow :
- Qui se connecte et quand
- Qui crée/modifie/supprime des projets
- Qui fait quoi sur les tâches
- Toutes les actions importantes

## ✅ Ce qui est fait

### 1. **Table de logs créée** (`audit_logs`)
   - Stocke toutes les actions
   - Avec date, heure, IP, user agent
   - Optimisée avec des index

### 2. **Logs automatiques** sur :
   - ✅ Connexion (réussie ou échouée)
   - ✅ Inscription
   - ✅ Toutes les requêtes HTTP (création, modification, suppression)

### 3. **API pour consulter les logs**
   - `/audit/logs` - Mes logs
   - `/audit/stats` - Mes statistiques
   - `/audit/all` - Tous les logs (admin)

## 🚀 Déploiement

### Étape 1 : Créer la table

**En local :**
```bash
psql -U postgres -d taskflow_db -f taskflow-api/migrations/create_audit_logs.sql
```

**Sur Render (production) :**
1. Va sur ton dashboard Render
2. Clique sur ta base de données PostgreSQL
3. Onglet "Shell"
4. Copie-colle le contenu de `taskflow-api/migrations/create_audit_logs.sql`
5. Exécute

### Étape 2 : Redémarrer l'API

```bash
cd taskflow-api
npm run start:dev
```

Ou sur Render, redémarre le service backend.

## 📊 Voir les Logs

### Dans la console

Tous les logs s'affichent automatiquement :

```
📝 AUDIT LOG: {
  utilisateur: 'user-id',
  action: 'USER_LOGIN',
  ressource: 'N/A',
  status: 'success',
  ip: '192.168.1.1',
  timestamp: '2024-02-07T10:30:00.000Z'
}
```

### Via l'API

**Récupérer mes logs :**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/audit/logs?limit=50
```

**Mes statistiques :**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/audit/stats
```

## 🔍 Types d'Actions Loggées

| Action | Description |
|--------|-------------|
| `USER_LOGIN` | Connexion réussie |
| `USER_LOGIN_FAILED` | Tentative de connexion échouée |
| `USER_REGISTER` | Inscription |
| `CREATE_projets` | Création d'un projet |
| `UPDATE_projets` | Modification d'un projet |
| `DELETE_projets` | Suppression d'un projet |
| `CREATE_taches` | Création d'une tâche |
| `UPDATE_taches` | Modification d'une tâche |
| `DELETE_taches` | Suppression d'une tâche |
| `CREATE_invitations` | Envoi d'invitation |
| ... | Et toutes les autres actions |

## 📈 Exemple de Log

```json
{
  "id": "uuid",
  "utilisateur_id": "user-uuid",
  "action": "USER_LOGIN",
  "details": {
    "email": "user@example.com"
  },
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "status": "success",
  "date_action": "2024-02-07T10:30:00Z"
}
```

## 🔒 Sécurité

- ✅ Chaque utilisateur voit **uniquement ses logs**
- ✅ Les mots de passe ne sont **jamais** loggés
- ✅ Les tokens sont **filtrés** automatiquement
- ✅ IP et user agent enregistrés pour traçabilité

## 📋 Checklist de Déploiement

- [ ] Exécuter la migration SQL (`create_audit_logs.sql`)
- [ ] Vérifier que la table `audit_logs` existe
- [ ] Redémarrer l'API backend
- [ ] Tester une connexion
- [ ] Vérifier les logs dans la console
- [ ] Tester l'endpoint `/audit/logs`

## 🎓 Utilisation

### Voir qui s'est connecté aujourd'hui

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/audit/logs?action=USER_LOGIN&limit=100"
```

### Voir toutes mes actions

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/audit/logs?limit=1000"
```

### Voir mes statistiques

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/audit/stats"
```

## 🐛 Dépannage

### La table n'existe pas

```
ERROR: relation "audit_logs" does not exist
```

**Solution :** Exécuter la migration SQL

### Pas de logs dans la console

**Vérifier :**
1. Le module `AuditModule` est bien importé dans `app.module.ts`
2. L'API est redémarrée
3. Vous êtes connecté (les logs nécessitent un utilisateur)

### Erreur 401 sur `/audit/logs`

**Solution :** Vous devez être connecté. Ajoutez le header :
```
Authorization: Bearer YOUR_TOKEN
```

## 📚 Documentation Complète

Pour plus de détails, consultez :
- [AUDIT_SYSTEM.md](taskflow-api/AUDIT_SYSTEM.md) - Documentation technique complète

## ✅ C'est Prêt !

Le système d'audit est maintenant configuré. Toutes les actions des utilisateurs sont automatiquement enregistrées et consultables.

**Prochaines étapes :**
1. Créer un dashboard visuel pour les logs
2. Ajouter des alertes sur actions suspectes
3. Implémenter l'export des logs
4. Ajouter un système de rôles (admin)
