# DIAGRAMME DE CLASSES - TASKFLOW
## Guide complet pour Draw.io

═══════════════════════════════════════════════════════════════════════════════

## CLASSES PRINCIPALES

### 1. UTILISATEUR
```
┌─────────────────────────────────┐
│           Utilisateur           │
├─────────────────────────────────┤
│ - id: string                    │
│ - email: string                 │
│ - mot_de_passe: string          │
│ - prenom: string                │
│ - nom: string                   │
│ - avatar_url: string            │
│ - provider: string              │
│ - provider_id: string           │
│ - avatar: string                │
│ - est_actif: boolean            │
│ - date_creation: Date           │
│ - date_modification: Date       │
├─────────────────────────────────┤
│ + creerCompte()                 │
│ + seConnecter()                 │
│ + modifierProfil()              │
│ + obtenirProjets()              │
└─────────────────────────────────┘
```

### 2. PROJET
```
┌─────────────────────────────────┐
│             Projet              │
├─────────────────────────────────┤
│ - id: string                    │
│ - nom: string                   │
│ - description: string           │
│ - couleur: string               │
│ - icone: string                 │
│ - proprietaire_id: string       │
│ - est_archive: boolean          │
│ - date_creation: Date           │
│ - date_modification: Date       │
├─────────────────────────────────┤
│ + creerProjet()                 │
│ + modifierProjet()              │
│ + archiverProjet()              │
│ + ajouterMembre()               │
│ + obtenirTaches()               │
└─────────────────────────────────┘
```

### 3. TACHE
```
┌─────────────────────────────────┐
│              Tache              │
├─────────────────────────────────┤
│ - id: string                    │
│ - titre: string                 │
│ - description: string           │
│ - projet_id: string             │
│ - assigne_a: string             │
│ - cree_par: string              │
│ - statut: StatutTache           │
│ - priorite: PrioriteTache       │
│ - date_echeance: Date           │
│ - date_completion: Date         │
│ - position: number              │
│ - date_creation: Date           │
│ - date_modification: Date       │
├─────────────────────────────────┤
│ + creerTache()                  │
│ + modifierTache()               │
│ + assignerTache()               │
│ + changerStatut()               │
│ + ajouterCommentaire()          │
└─────────────────────────────────┘
```

### 4. COMMENTAIRE
```
┌─────────────────────────────────┐
│           Commentaire           │
├─────────────────────────────────┤
│ - id: string                    │
│ - contenu: string               │
│ - tache_id: string              │
│ - utilisateur_id: string        │
│ - date_creation: Date           │
│ - date_modification: Date       │
├─────────────────────────────────┤
│ + ajouterCommentaire()          │
│ + modifierCommentaire()         │
│ + supprimerCommentaire()        │
└─────────────────────────────────┘
```

### 5. MEMBRE_PROJET
```
┌─────────────────────────────────┐
│          MembreProjet           │
├─────────────────────────────────┤
│ - id: string                    │
│ - projet_id: string             │
│ - utilisateur_id: string        │
│ - role: RoleProjet              │
│ - date_ajout: Date              │
├─────────────────────────────────┤
│ + ajouterMembre()               │
│ + modifierRole()                │
│ + retirerMembre()               │
└─────────────────────────────────┘
```

### 6. ETIQUETTE
```
┌─────────────────────────────────┐
│            Etiquette            │
├─────────────────────────────────┤
│ - id: string                    │
│ - nom: string                   │
│ - couleur: string               │
│ - projet_id: string             │
│ - date_creation: Date           │
├─────────────────────────────────┤
│ + creerEtiquette()              │
│ + modifierEtiquette()           │
│ + supprimerEtiquette()          │
└─────────────────────────────────┘
```

### 7. INVITATION
```
┌─────────────────────────────────┐
│           Invitation            │
├─────────────────────────────────┤
│ - id: string                    │
│ - projet_id: string             │
│ - email: string                 │
│ - role: RoleProjet              │
│ - invite_par: string            │
│ - token: string                 │
│ - statut: StatutInvitation      │
│ - date_creation: Date           │
│ - date_expiration: Date         │
├─────────────────────────────────┤
│ + envoyerInvitation()           │
│ + accepterInvitation()          │
│ + refuserInvitation()           │
└─────────────────────────────────┘
```

### 8. NOTIFICATION
```
┌─────────────────────────────────┐
│          Notification           │
├─────────────────────────────────┤
│ - id: string                    │
│ - utilisateur_id: string        │
│ - type: TypeNotification        │
│ - message: string               │
│ - est_lue: boolean              │
│ - projet_id: string             │
│ - tache_id: string              │
│ - invitation_id: string         │
│ - date_creation: Date           │
├─────────────────────────────────┤
│ + creerNotification()           │
│ + marquerCommeLue()             │
│ + supprimerNotification()       │
└─────────────────────────────────┘
```

═══════════════════════════════════════════════════════════════════════════════

## ENUMERATIONS

### StatutTache
```
┌─────────────────────┐
│    <<enumeration>>  │
│     StatutTache     │
├─────────────────────┤
│ A_FAIRE             │
│ EN_COURS            │
│ TERMINEE            │
└─────────────────────┘
```

### PrioriteTache
```
┌─────────────────────┐
│    <<enumeration>>  │
│   PrioriteTache     │
├─────────────────────┤
│ BASSE               │
│ MOYENNE             │
│ HAUTE               │
└─────────────────────┘
```

### RoleProjet
```
┌─────────────────────┐
│    <<enumeration>>  │
│     RoleProjet      │
├─────────────────────┤
│ PROPRIETAIRE        │
│ ADMIN               │
│ MEMBRE              │
└─────────────────────┘
```

### StatutInvitation
```
┌─────────────────────┐
│    <<enumeration>>  │
│  StatutInvitation   │
├─────────────────────┤
│ EN_ATTENTE          │
│ ACCEPTEE            │
│ REFUSEE             │
│ EXPIREE             │
└─────────────────────┘
```

### TypeNotification
```
┌─────────────────────┐
│    <<enumeration>>  │
│  TypeNotification   │
├─────────────────────┤
│ INVITATION          │
│ TACHE_ASSIGNEE      │
│ COMMENTAIRE         │
│ TACHE_TERMINEE      │
│ MEMBRE_AJOUTE       │
└─────────────────────┘
```

═══════════════════════════════════════════════════════════════════════════════

## RELATIONS ET ASSOCIATIONS

### 1. UTILISATEUR ↔ PROJET
**Type**: Association (Many-to-Many via MembreProjet)
**Cardinalité**: 1..* ↔ 0..*
**Description**: Un utilisateur peut être membre de plusieurs projets, un projet peut avoir plusieurs membres

### 2. UTILISATEUR → PROJET
**Type**: Association simple (One-to-Many)
**Cardinalité**: 1 → 0..*
**Description**: Un utilisateur peut être propriétaire de plusieurs projets (proprietaire_id)

### 3. PROJET → TACHE
**Type**: Composition (One-to-Many)
**Cardinalité**: 1 → 0..*
**Description**: Un projet contient plusieurs tâches, les tâches n'existent pas sans projet

### 4. UTILISATEUR → TACHE (Assignation)
**Type**: Association simple (One-to-Many)
**Cardinalité**: 1 → 0..*
**Description**: Un utilisateur peut être assigné à plusieurs tâches (assigne_a)

### 5. UTILISATEUR → TACHE (Création)
**Type**: Association simple (One-to-Many)
**Cardinalité**: 1 → 0..*
**Description**: Un utilisateur peut créer plusieurs tâches (cree_par)

### 6. TACHE → COMMENTAIRE
**Type**: Composition (One-to-Many)
**Cardinalité**: 1 → 0..*
**Description**: Une tâche peut avoir plusieurs commentaires, les commentaires n'existent pas sans tâche

### 7. UTILISATEUR → COMMENTAIRE
**Type**: Association simple (One-to-Many)
**Cardinalité**: 1 → 0..*
**Description**: Un utilisateur peut écrire plusieurs commentaires

### 8. PROJET → ETIQUETTE
**Type**: Composition (One-to-Many)
**Cardinalité**: 1 → 0..*
**Description**: Un projet peut avoir plusieurs étiquettes, les étiquettes n'existent pas sans projet

### 9. TACHE ↔ ETIQUETTE
**Type**: Association (Many-to-Many)
**Cardinalité**: 0..* ↔ 0..*
**Description**: Une tâche peut avoir plusieurs étiquettes, une étiquette peut être sur plusieurs tâches

### 10. PROJET → INVITATION
**Type**: Composition (One-to-Many)
**Cardinalité**: 1 → 0..*
**Description**: Un projet peut avoir plusieurs invitations

### 11. UTILISATEUR → INVITATION
**Type**: Association simple (One-to-Many)
**Cardinalité**: 1 → 0..*
**Description**: Un utilisateur peut envoyer plusieurs invitations (invite_par)

### 12. UTILISATEUR → NOTIFICATION
**Type**: Composition (One-to-Many)
**Cardinalité**: 1 → 0..*
**Description**: Un utilisateur peut recevoir plusieurs notifications

### 13. PROJET → NOTIFICATION
**Type**: Association simple (One-to-Many)
**Cardinalité**: 1 → 0..*
**Description**: Un projet peut générer plusieurs notifications

### 14. TACHE → NOTIFICATION
**Type**: Association simple (One-to-Many)
**Cardinalité**: 1 → 0..*
**Description**: Une tâche peut générer plusieurs notifications

═══════════════════════════════════════════════════════════════════════════════

## GUIDE DRAW.IO

### ÉTAPES POUR CRÉER LE DIAGRAMME :

1. **Ouvrir Draw.io**
   - Aller sur app.diagrams.net
   - Choisir "Create New Diagram"
   - Sélectionner "UML" → "Class Diagram"

2. **Créer les classes**
   - Utiliser l'outil "Class" dans la palette UML
   - Copier-coller le contenu de chaque classe ci-dessus
   - Organiser les classes en groupes logiques

3. **Ajouter les énumérations**
   - Utiliser l'outil "Class" avec le stéréotype <<enumeration>>
   - Placer les énumérations près des classes qui les utilisent

4. **Créer les associations**
   - Utiliser les connecteurs UML appropriés :
     - **Association simple** : ligne simple avec flèche
     - **Composition** : ligne avec losange plein
     - **Agrégation** : ligne avec losange vide
     - **Many-to-Many** : ligne avec * des deux côtés

5. **Ajouter les cardinalités**
   - Écrire les cardinalités près des extrémités des relations
   - Exemples : 1, 0..*, 1..*, 0..1

6. **Organiser le layout**
   - Placer Utilisateur au centre (classe principale)
   - Grouper les classes liées
   - Éviter les croisements de lignes

### CONSEILS POUR UN BON DIAGRAMME :

- **Couleurs** : Utiliser des couleurs différentes pour les groupes
- **Espacement** : Laisser de l'espace entre les classes
- **Lisibilité** : Utiliser une police claire (Arial, 10-12pt)
- **Légende** : Ajouter une légende pour expliquer les symboles

═══════════════════════════════════════════════════════════════════════════════

## FICHIER DRAW.IO

Tu peux copier ce contenu et l'utiliser comme référence pour créer ton diagramme dans Draw.io. 

**Ordre de création recommandé :**
1. Utilisateur (centre)
2. Projet (à droite)
3. Tache (en bas)
4. MembreProjet (entre Utilisateur et Projet)
5. Commentaire (sous Tache)
6. Etiquette (à droite de Tache)
7. Invitation (sous Projet)
8. Notification (à gauche)
9. Énumérations (dans les coins)

**Relations principales à dessiner en premier :**
- Utilisateur → Projet (propriétaire)
- Projet → Tache (composition)
- Utilisateur ↔ Projet (via MembreProjet)
- Tache → Commentaire (composition)
- Utilisateur → Tache (assignation)