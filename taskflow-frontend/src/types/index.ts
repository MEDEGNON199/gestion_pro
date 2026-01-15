export interface Utilisateur {
  id: string;
  email: string;
  prenom: string;
  nom: string;
}

export interface AuthResponse {
  access_token: string;
  utilisateur: Utilisateur;
}

export interface Projet {
  id: string;
  nom: string;
  description?: string;
  couleur: string;
  icone: string;
  proprietaire_id: string;
  est_archive: boolean;
  date_creation: string;
  date_modification: string;
}

// src/types/index.ts

export const StatutTache = {
  A_FAIRE: 'A_FAIRE',
  EN_COURS: 'EN_COURS',
  TERMINEE: 'TERMINEE',
} as const;

export type StatutTache = typeof StatutTache[keyof typeof StatutTache];

export const PrioriteTache = {
  BASSE: 'BASSE',
  MOYENNE: 'MOYENNE',
  HAUTE: 'HAUTE',
} as const;

export type PrioriteTache = typeof PrioriteTache[keyof typeof PrioriteTache];

// Reste de tes types...
export interface Projet {
  id: string;
  nom: string;
  description?: string;
  // ...
}

export interface Tache {
  id: string;
  titre: string;
  description?: string;
  statut: StatutTache;
  priorite: PrioriteTache;
  // ...
}