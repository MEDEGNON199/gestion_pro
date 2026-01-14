import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { invitationsService } from '../services/invitations.service';
import { CheckCircle2, XCircle, Loader2, Mail, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function InvitationAccept() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [projetNom, setProjetNom] = useState('');
  const [emailInvite, setEmailInvite] = useState('');

  useEffect(() => {
    if (!user) {
      navigate(`/auth?invitation=${token}`);
      return;
    }

    handleAccept();
  }, [user, token]);

  const handleAccept = async () => {
    if (!token) return;

    try {
      const response = await invitationsService.accepter(token);
      setProjetNom(response.projet.nom);
      setSuccess(true);
      
      setTimeout(() => {
        navigate(`/projets/${response.projet.id}/taches`);
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de l\'acceptation de l\'invitation';
      setError(errorMessage);
      
      // Si l'erreur est "ne vous est pas destinée", essayer de récupérer l'email de l'invitation
      if (errorMessage.includes('ne vous est pas destinée')) {
        // On peut faire une requête pour obtenir les détails de l'invitation
        // Mais pour l'instant, on affiche juste l'email actuel
        setEmailInvite(user?.email || '');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate(`/auth?invitation=${token}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-6">
            <Loader2 className="w-8 h-8 text-slate-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Traitement de l'invitation...
          </h2>
          <p className="text-slate-600">
            Veuillez patienter un instant
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    const isWrongAccount = error.includes('ne vous est pas destinée');
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md w-full text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
            isWrongAccount ? 'bg-amber-100' : 'bg-red-100'
          }`}>
            {isWrongAccount ? (
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600" />
            )}
          </div>
          
          {isWrongAccount ? (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Mauvais compte
              </h2>
              <p className="text-slate-600 mb-2">
                Cette invitation n'est pas destinée au compte :
              </p>
              <p className="text-lg font-semibold text-slate-900 mb-6 bg-slate-50 px-4 py-2 rounded-lg">
                {user?.email}
              </p>
              <p className="text-sm text-slate-500 mb-8">
                Veuillez vous déconnecter et vous connecter avec le compte qui a reçu l'email d'invitation.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleLogout}
                  className="w-full px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium"
                >
                  Se déconnecter et réessayer
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full px-6 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                >
                  Retour au tableau de bord
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Erreur
              </h2>
              <p className="text-slate-600 mb-8">
                {error}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/mes-invitations')}
                  className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                >
                  Mes invitations
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium"
                >
                  Tableau de bord
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Invitation acceptée !
          </h2>
          <p className="text-slate-600 mb-2">
            Vous êtes maintenant membre du projet
          </p>
          <p className="text-lg font-semibold text-slate-900 mb-8">
            {projetNom}
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Redirection en cours...
          </div>
        </div>
      </div>
    );
  }

  return null;
}