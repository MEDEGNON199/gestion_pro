import api from './api';

export interface UpdateProfilDto {
  prenom?: string;
  nom?: string;
  email?: string;
}

export interface ChangePasswordDto {
  ancien_mot_de_passe: string;
  nouveau_mot_de_passe: string;
}

export const utilisateursService = {
  updateProfil: async (data: UpdateProfilDto) => {
    const response = await api.patch('/utilisateurs/profil', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordDto) => {
    const response = await api.patch('/utilisateurs/mot-de-passe', data);
    return response.data;
  },
};