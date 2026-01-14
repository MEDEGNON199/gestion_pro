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

export enum StatutTache {
  A_FAIRE = 'A_FAIRE',
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE',
}

export enum PrioriteTache {
  BASSE = 'BASSE',
  MOYENNE = 'MOYENNE',
  HAUTE = 'HAUTE',
}

export interface Tache {
  id: string;
  titre: string;
  description?: string;
  projet_id: string;
  assigne_a?: string;
  cree_par: string;
  statut: StatutTache;
  priorite: PrioriteTache;
  date_echeance?: string;
  date_completion?: string;
  position: number;
  date_creation: string;
  date_modification: string;
}

export interface Etiquette {
  id: string;
  nom: string;
  couleur: string;
  projet_id: string;
  date_creation: string;
}

export interface Commentaire {
  id: string;
  contenu: string;
  tache_id: string;
  utilisateur_id: string;
  date_creation: string;
  date_modification: string;
}