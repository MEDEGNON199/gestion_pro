import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Stocker le token
      localStorage.setItem('token', token);
      
      // Décoder le token pour récupérer les infos utilisateur
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Récupérer les infos complètes de l'utilisateur
        fetch('http://localhost:3000/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(res => res.json())
        .then(userData => {
          setUser(userData);
          navigate('/dashboard');
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          navigate('/auth?error=oauth_failed');
        });
        
      } catch (error) {
        console.error('Error parsing token:', error);
        navigate('/auth?error=invalid_token');
      }
    } else {
      navigate('/auth?error=no_token');
    }
  }, [searchParams, navigate, setUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 font-semibold">Completing sign in...</p>
      </div>
    </div>
  );
}