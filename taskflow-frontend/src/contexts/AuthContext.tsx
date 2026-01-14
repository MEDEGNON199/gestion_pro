import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

// Types définis localement
interface Utilisateur {
  id: string;
  email: string;
  prenom: string;
  nom: string;
}

interface AuthResponse {
  access_token: string;
  utilisateur: Utilisateur;
}

interface AuthContextType {
  user: Utilisateur | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, prenom: string, nom: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Utilisateur | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await api.get('/auth/profile');
          setUser(response.data);
        } catch (error) {
          console.error('Erreur lors du chargement du profil', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email: string, mot_de_passe: string) => {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      mot_de_passe,
    });
    
    const { access_token, utilisateur } = response.data;
    localStorage.setItem('token', access_token);
    setToken(access_token);
    setUser(utilisateur);
  };

  const register = async (email: string, mot_de_passe: string, prenom: string, nom: string) => {
    const response = await api.post<AuthResponse>('/auth/register', {
      email,
      mot_de_passe,
      prenom,
      nom,
    });
    
    const { access_token, utilisateur } = response.data;
    localStorage.setItem('token', access_token);
    setToken(access_token);
    setUser(utilisateur);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

// Export des types pour les autres fichiers
export type { Utilisateur };