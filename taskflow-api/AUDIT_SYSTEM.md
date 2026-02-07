# 📝 Système d'Audit TaskFlow

## Vue d'ensemble

Le système d'audit de TaskFlow enregistre automatiquement toutes les actions des utilisateurs pour assurer la traçabilité, la sécurité et la conformité.

## 🎯 Fonctionnalités

### Actions Tracées

- **Authentification**
  - `USER_LOGIN` - Connexion réussie
  - `USER_LOGIN_FAILED` - Tentative de connexion échouée
  - `USER_REGISTER` - Inscription d'un nouvel utilisateur
  - `USER_LOGOUT` - Déconnexion

- **Projets**
  - `CREATE_projets` - Création d'un projet
  - `UPDATE_projets` - Modification d'un projet
  - `DELETE_projets` - Suppression d'un projet
  - `READ_projets` - Consultation d'un projet

- **Tâches**
  - `CREATE_taches` - Création d'une tâche
  - `UPDATE_taches` - Modification d'une tâche
  - `DELETE_taches` - Suppression d'une tâche

- **Invitations**
  - `CREATE_invitations` - Envoi d'une invitation
  - `UPDATE_invitations` - Acceptation/Refus d'invitation

## 📊 Structure des Logs

Chaque log contient :

```typescript
{
  id: string;                    // ID unique du log
  utilisateur_id: string;        // ID de l'utilisateur
  action: string;                // Type d'action
  ressource_type?: string;       // Type de ressource (projet, tache, etc.)
  ressource_id?: string;         // ID de la ressource
  details?: any;                 // Détails supplémentaires (JSON)
  ip_address?: string;           // Adresse IP
  user_agent?: string;           // User agent du navigateur
  status: 'success' | 'failed';  // Statut de l'action
  date_action: Date;             // Date et heure de l'action
}
```

## 🔌 API Endpoints

### 1. Récupérer mes logs

```http
GET /audit/logs?action=USER_LOGIN&limit=50
Authorization: Bearer {token}
```

**Paramètres de requête :**
- `action` (optionnel) - Filtrer par type d'action
- `ressourceType` (optionnel) - Filtrer par type de ressource
- `limit` (optionnel) - Nombre de logs à retourner (défaut: 100)

**Réponse :**
```json
[
  {
    "id": "uuid",
    "utilisateur_id": "uuid",
    "action": "USER_LOGIN",
    "details": { "email": "user@example.com" },
    "ip_address": "192.168.1.1",
    "status": "success",
    "date_action": "2024-02-07T10:30:00Z"
  }
]
```

### 2. Statistiques d'utilisation

```http
GET /audit/stats
Authorization: Bearer {token}
```

**Réponse :**
```json
[
  { "action": "USER_LOGIN", "count": "45" },
  { "action": "CREATE_projets", "count": "12" },
  { "action": "UPDATE_taches", "count": "89" }
]
```

### 3. Tous les logs (Admin)

```http
GET /audit/all?utilisateurId=uuid&limit=100
Authorization: Bearer {token}
```

**Note :** Nécessite des droits administrateur (à implémenter)

## 🔒 Sécurité

### Données Sensibles

Les données sensibles sont automatiquement filtrées :
- ❌ Mots de passe
- ❌ Tokens d'authentification
- ✅ Emails (conservés)
- ✅ Noms d'utilisateurs (conservés)

### Accès aux Logs

- Chaque utilisateur peut voir **uniquement ses propres logs**
- Les administrateurs peuvent voir **tous les logs** (à implémenter)

## 📈 Utilisation dans le Code

### Méthode 1 : Automatique (Intercepteur)

Toutes les requêtes HTTP sont automatiquement loggées via l'intercepteur global.

### Méthode 2 : Manuelle

Pour des actions spécifiques :

```typescript
import { AuditService } from './audit/audit.service';

constructor(private auditService: AuditService) {}

async maFonction() {
  // Votre logique...
  
  await this.auditService.log({
    utilisateurId: user.id,
    action: 'CUSTOM_ACTION',
    ressourceType: 'projet',
    ressourceId: projet.id,
    details: { nom: projet.nom },
    status: 'success',
  });
}
```

## 🗄️ Base de Données

### Table `audit_logs`

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  utilisateur_id UUID NOT NULL,
  action VARCHAR(255) NOT NULL,
  ressource_type VARCHAR(100),
  ressource_id VARCHAR(255),
  details JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  status VARCHAR(20) DEFAULT 'success',
  date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Index

- `idx_audit_logs_utilisateur` - Sur `utilisateur_id`
- `idx_audit_logs_action` - Sur `action`
- `idx_audit_logs_date` - Sur `date_action DESC`
- `idx_audit_logs_ressource` - Sur `ressource_type, ressource_id`

## 📊 Exemples de Logs

### Connexion Réussie

```json
{
  "utilisateur_id": "123e4567-e89b-12d3-a456-426614174000",
  "action": "USER_LOGIN",
  "details": { "email": "user@example.com" },
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "status": "success",
  "date_action": "2024-02-07T10:30:00Z"
}
```

### Création de Projet

```json
{
  "utilisateur_id": "123e4567-e89b-12d3-a456-426614174000",
  "action": "CREATE_projets",
  "ressource_type": "projet",
  "ressource_id": "projet-uuid",
  "details": {
    "nom": "Mon Nouveau Projet",
    "description": "Description du projet"
  },
  "status": "success",
  "date_action": "2024-02-07T11:00:00Z"
}
```

### Tentative de Connexion Échouée

```json
{
  "utilisateur_id": "123e4567-e89b-12d3-a456-426614174000",
  "action": "USER_LOGIN_FAILED",
  "details": {
    "email": "user@example.com",
    "reason": "Invalid password"
  },
  "ip_address": "192.168.1.1",
  "status": "failed",
  "date_action": "2024-02-07T09:45:00Z"
}
```

## 🔍 Surveillance

### Console Logs

Tous les logs d'audit sont également affichés dans la console :

```
📝 AUDIT LOG: {
  utilisateur: '123e4567-e89b-12d3-a456-426614174000',
  action: 'USER_LOGIN',
  ressource: 'N/A',
  status: 'success',
  ip: '192.168.1.1',
  timestamp: '2024-02-07T10:30:00.000Z'
}
```

## 📋 Conformité

Le système d'audit aide à respecter :

- **RGPD** - Traçabilité des accès aux données personnelles
- **SOC 2** - Logs d'audit pour la sécurité
- **ISO 27001** - Gestion des événements de sécurité

## 🚀 Déploiement

### Migration

Exécuter la migration SQL :

```bash
psql -U postgres -d taskflow_db -f migrations/create_audit_logs.sql
```

### Variables d'Environnement

Aucune configuration supplémentaire requise. Le système d'audit utilise la même base de données que l'application.

## 📈 Performance

### Optimisations

- Index sur les colonnes fréquemment recherchées
- Logs asynchrones (pas de blocage)
- Nettoyage automatique des vieux logs (à implémenter)

### Recommandations

- Archiver les logs de plus de 1 an
- Limiter les requêtes avec `limit`
- Utiliser les filtres pour réduire les résultats

## 🔮 Améliorations Futures

- [ ] Dashboard d'audit visuel
- [ ] Alertes en temps réel sur actions suspectes
- [ ] Export des logs (CSV, JSON)
- [ ] Archivage automatique
- [ ] Rôles et permissions pour l'accès aux logs
- [ ] Détection d'anomalies (ML)
- [ ] Intégration avec SIEM

## 📞 Support

Pour toute question sur le système d'audit, consultez la documentation ou contactez l'équipe de développement.
