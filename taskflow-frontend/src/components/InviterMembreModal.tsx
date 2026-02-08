import React, { useState } from 'react';
import { invitationsService } from '../services/invitations.service';
import { Mail } from 'lucide-react';
import ResponsiveModal from './ResponsiveModal';

interface Props {
  projetId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const InviterMembreModal: React.FC<Props> = ({ projetId, isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MEMBRE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await invitationsService.inviter(projetId, email, role);
      setSuccess(response.message);
      setEmail('');
      setRole('MEMBRE');
      
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de l\'invitation';
      
      if (errorMessage.includes('déjà membre')) {
        setError('✅ Cet utilisateur est déjà membre du projet.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ResponsiveModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Inviter un membre"
      size="sm"
    >
      <div className="p-4 sm:p-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-4 text-sm font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Adresse email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-touch pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-base"
                placeholder="exemple@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Rôle
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full min-h-touch px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-base"
            >
              <option value="MEMBRE">Membre</option>
              <option value="ADMIN">Admin</option>
            </select>
            <p className="text-xs text-slate-500 mt-2">
              Les admins peuvent gérer les membres et les tâches du projet.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 min-h-touch px-6 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="w-full sm:flex-1 min-h-touch bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
              disabled={loading}
            >
              {loading ? 'Envoi...' : 'Envoyer l\'invitation'}
            </button>
          </div>
        </form>
      </div>
    </ResponsiveModal>
  );
};

export default InviterMembreModal;