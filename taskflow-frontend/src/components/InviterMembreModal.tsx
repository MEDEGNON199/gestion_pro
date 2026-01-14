import React, { useState } from 'react';
import { invitationsService } from '../services/invitations.service';
import { X, Mail } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Inviter un membre</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

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

        <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
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
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
            >
              <option value="MEMBRE">Membre</option>
              <option value="ADMIN">Admin</option>
            </select>
            <p className="text-xs text-slate-500 mt-2">
              Les admins peuvent gérer les membres et les tâches du projet.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
              disabled={loading}
            >
              {loading ? 'Envoi...' : 'Envoyer l\'invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviterMembreModal;