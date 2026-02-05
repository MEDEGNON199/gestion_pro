# 📡 API Documentation

TaskFlow provides a comprehensive REST API built with NestJS, featuring JWT authentication, real-time WebSocket connections, and full CRUD operations for all resources.

## 🔗 Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://your-api-domain.onrender.com`

## 🔐 Authentication

TaskFlow uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

---

## 🔑 Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "mot_de_passe": "password123",
  "prenom": "John",
  "nom": "Doe"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "utilisateur": {
    "id": "uuid",
    "email": "user@example.com",
    "prenom": "John",
    "nom": "Doe"
  }
}
```

### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "mot_de_passe": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "utilisateur": {
    "id": "uuid",
    "email": "user@example.com",
    "prenom": "John",
    "nom": "Doe"
  }
}
```

### Get User Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "prenom": "John",
  "nom": "Doe"
}
```

### OAuth Authentication
```http
GET /auth/google
GET /auth/github
```
Redirects to OAuth provider for authentication.

---

## 👥 Users Endpoints

### Get All Users
```http
GET /utilisateurs
Authorization: Bearer <token>
```

### Get User by ID
```http
GET /utilisateurs/:id
Authorization: Bearer <token>
```

### Update User
```http
PATCH /utilisateurs/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "prenom": "Jane",
  "nom": "Smith",
  "avatar": "https://example.com/avatar.jpg"
}
```

---

## 📁 Projects Endpoints

### Get All Projects
```http
GET /projets
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "nom": "Project Alpha",
    "description": "A sample project",
    "statut": "active",
    "date_creation": "2025-01-01T00:00:00Z",
    "date_echeance": "2025-12-31T00:00:00Z",
    "proprietaire": {
      "id": "uuid",
      "prenom": "John",
      "nom": "Doe"
    },
    "membres": [...],
    "taches": [...]
  }
]
```

### Create Project
```http
POST /projets
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "nom": "New Project",
  "description": "Project description",
  "date_echeance": "2025-12-31T00:00:00Z"
}
```

### Get Project by ID
```http
GET /projets/:id
Authorization: Bearer <token>
```

### Update Project
```http
PATCH /projets/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "nom": "Updated Project Name",
  "description": "Updated description",
  "statut": "completed"
}
```

### Delete Project
```http
DELETE /projets/:id
Authorization: Bearer <token>
```

---

## ✅ Tasks Endpoints

### Get All Tasks
```http
GET /taches
Authorization: Bearer <token>
```

**Query Parameters:**
- `projet_id`: Filter by project ID
- `assignee_id`: Filter by assignee ID
- `statut`: Filter by status (todo, in_progress, review, done)
- `priorite`: Filter by priority (low, medium, high, urgent)

### Create Task
```http
POST /taches
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "titre": "New Task",
  "description": "Task description",
  "projet_id": "uuid",
  "assignee_id": "uuid",
  "priorite": "high",
  "date_echeance": "2025-02-01T00:00:00Z"
}
```

### Get Task by ID
```http
GET /taches/:id
Authorization: Bearer <token>
```

### Update Task
```http
PATCH /taches/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "titre": "Updated Task",
  "statut": "in_progress",
  "priorite": "medium"
}
```

### Delete Task
```http
DELETE /taches/:id
Authorization: Bearer <token>
```

---

## 🏷️ Labels Endpoints

### Get All Labels
```http
GET /etiquettes
Authorization: Bearer <token>
```

### Create Label
```http
POST /etiquettes
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "nom": "Bug",
  "couleur": "#ff0000",
  "projet_id": "uuid"
}
```

### Update Label
```http
PATCH /etiquettes/:id
Authorization: Bearer <token>
```

### Delete Label
```http
DELETE /etiquettes/:id
Authorization: Bearer <token>
```

---

## 💬 Comments Endpoints

### Get Task Comments
```http
GET /commentaires?tache_id=:tacheId
Authorization: Bearer <token>
```

### Create Comment
```http
POST /commentaires
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "contenu": "This is a comment",
  "tache_id": "uuid"
}
```

### Update Comment
```http
PATCH /commentaires/:id
Authorization: Bearer <token>
```

### Delete Comment
```http
DELETE /commentaires/:id
Authorization: Bearer <token>
```

---

## 👥 Team Management Endpoints

### Get Project Members
```http
GET /membres-projets?projet_id=:projetId
Authorization: Bearer <token>
```

### Add Member to Project
```http
POST /membres-projets
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "projet_id": "uuid",
  "utilisateur_id": "uuid",
  "role": "member"
}
```

### Update Member Role
```http
PATCH /membres-projets/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "role": "admin"
}
```

### Remove Member from Project
```http
DELETE /membres-projets/:id
Authorization: Bearer <token>
```

---

## 📧 Invitations Endpoints

### Send Invitation
```http
POST /invitations
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "projet_id": "uuid",
  "role": "member",
  "message": "Join our project!"
}
```

### Get User Invitations
```http
GET /invitations/mes-invitations
Authorization: Bearer <token>
```

### Accept Invitation
```http
POST /invitations/:token/accept
Authorization: Bearer <token>
```

### Decline Invitation
```http
POST /invitations/:token/decline
Authorization: Bearer <token>
```

---

## 📊 Dashboard Endpoints

### Get Dashboard Stats
```http
GET /dashboard/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalProjets": 5,
  "tachesActives": 12,
  "tachesCompletes": 45,
  "membresEquipe": 8,
  "projetsRecents": [...],
  "tachesRecentes": [...],
  "activiteEquipe": [...]
}
```

### Get Project Analytics
```http
GET /dashboard/projets/:id/analytics
Authorization: Bearer <token>
```

---

## 🔔 Notifications Endpoints

### Get User Notifications
```http
GET /notifications
Authorization: Bearer <token>
```

### Mark Notification as Read
```http
PATCH /notifications/:id/read
Authorization: Bearer <token>
```

### Mark All Notifications as Read
```http
POST /notifications/mark-all-read
Authorization: Bearer <token>
```

---

## 🌐 WebSocket Events

TaskFlow uses Socket.io for real-time communication.

### Connection
```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Events

**Join Project Room:**
```javascript
socket.emit('join-project', { projectId: 'uuid' });
```

**Task Updates:**
```javascript
// Listen for task updates
socket.on('task-updated', (data) => {
  console.log('Task updated:', data);
});

// Emit task update
socket.emit('update-task', {
  taskId: 'uuid',
  updates: { statut: 'completed' }
});
```

**Real-time Notifications:**
```javascript
socket.on('notification', (notification) => {
  console.log('New notification:', notification);
});
```

**User Presence:**
```javascript
// User comes online
socket.on('user-online', (userId) => {
  console.log('User online:', userId);
});

// User goes offline
socket.on('user-offline', (userId) => {
  console.log('User offline:', userId);
});
```

---

## 📝 Data Models

### User Model
```typescript
interface Utilisateur {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  avatar?: string;
  provider?: string;
  provider_id?: string;
  date_creation: Date;
  derniere_connexion?: Date;
}
```

### Project Model
```typescript
interface Projet {
  id: string;
  nom: string;
  description?: string;
  statut: 'active' | 'completed' | 'archived';
  date_creation: Date;
  date_echeance?: Date;
  proprietaire_id: string;
  proprietaire: Utilisateur;
  membres: MembreProjet[];
  taches: Tache[];
}
```

### Task Model
```typescript
interface Tache {
  id: string;
  titre: string;
  description?: string;
  statut: 'todo' | 'in_progress' | 'review' | 'done';
  priorite: 'low' | 'medium' | 'high' | 'urgent';
  date_creation: Date;
  date_echeance?: Date;
  temps_estime?: number;
  temps_passe?: number;
  projet_id: string;
  createur_id: string;
  assignee_id?: string;
  projet: Projet;
  createur: Utilisateur;
  assignee?: Utilisateur;
  commentaires: Commentaire[];
  etiquettes: Etiquette[];
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

### Error Response Format
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "email",
      "message": "Email must be a valid email address"
    }
  ]
}
```

---

## 🔒 Rate Limiting

API endpoints are rate-limited to prevent abuse:
- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute
- **File uploads**: 10 requests per minute

---

## 📊 Pagination

List endpoints support pagination:

```http
GET /taches?page=1&limit=20&sortBy=date_creation&sortOrder=desc
```

**Response:**
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## 🧪 Testing the API

### Using cURL
```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","mot_de_passe":"password"}'

# Get projects (with token)
curl -X GET http://localhost:3000/projets \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman
1. Import the [Postman Collection](./postman/TaskFlow.postman_collection.json)
2. Set up environment variables
3. Run the collection tests

---

<div align="center">
  <p>📚 For more examples and advanced usage, check out our <a href="./API_EXAMPLES.md">API Examples</a></p>
</div>