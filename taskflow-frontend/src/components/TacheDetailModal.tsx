import { useState, useEffect } from 'react';
import { X, MessageSquare, Send, User, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Avatar from './Avatar';
import AssigneeSelector from './AssigneeSelector/AssigneeSelector';
import { tachesService } from '../services/taches.service';

interface Tache {
  id: string;
  titre: string;
  description?: string;
  statut: string;
  priorite: string;
  date_echeance?: string;
  projet_id: string;
  assigne_a?: string;
  utilisateur_assigne?: {
    id: string;
    prenom: string;
    nom: string;
    email: string;
  };
}

interface Commentaire {
  id: string;
  contenu: string;
  utilisateur: {
    id: string;
    prenom: string;
    nom: string;
    email: string;
  };
  date_creation: string;
}

interface TacheDetailModalProps {
  tache: Tache;
  onClose: () => void;
  onEdit: () => void;
  onUpdate: () => void;
}

export default function TacheDetailModal({ tache, onClose, onEdit, onUpdate }: TacheDetailModalProps) {
  const { user } = useAuth();
  const [commentaires, setCommentaires] = useState<Commentaire[]>([]);
  const [nouveauCommentaire, setNouveauCommentaire] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAssigneeSelector, setShowAssigneeSelector] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    loadCommentaires();
  }, [tache.id]);

  const loadCommentaires = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/commentaires?tache_id=${tache.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await response.json();
      setCommentaires(data);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires', error);
    }
  };

  const handleSubmitCommentaire = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nouveauCommentaire.trim()) return;

    setIsLoading(true);
    try {
      await fetch('http://localhost:3000/commentaires', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          contenu: nouveauCommentaire,
          tache_id: tache.id,
        }),
      });

      setNouveauCommentaire('');
      loadCommentaires();
      onUpdate();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssigneeChange = async (userId: string | null) => {
    if (!userId) return;
    
    setIsAssigning(true);
    try {
      await tachesService.assigner(tache.id, userId);
      onUpdate(); // Rafraîchir les données de la tâche
      setShowAssigneeSelector(false);
      
      // Message de confirmation
      alert('✅ Tâche assignée avec succès ! Une notification a été envoyée au membre.');
    } catch (error) {
      console.error('Erreur lors de l\'assignation:', error);
      alert('❌ Erreur lors de l\'assignation. Veuillez réessayer.');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{tache.titre}</h2>
            {tache.description && (
              <p className="text-gray-600">{tache.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Infos */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Statut</p>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                  {tache.statut === 'A_FAIRE' && 'À faire'}
                  {tache.statut === 'EN_COURS' && 'En cours'}
                  {tache.statut === 'TERMINEE' && 'Terminé'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Priorité</p>
                <span
                  className={`inline-block px-3 py-1 rounded-lg text-sm ${
                    tache.priorite === 'HAUTE'
                      ? 'bg-red-100 text-red-700'
                      : tache.priorite === 'MOYENNE'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {tache.priorite === 'HAUTE' && 'Haute'}
                  {tache.priorite === 'MOYENNE' && 'Moyenne'}
                  {tache.priorite === 'BASSE' && 'Basse'}
                </span>
              </div>
              {tache.date_echeance && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Échéance</p>
                  <p className="text-sm text-gray-900">
                    {new Date(tache.date_echeance).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Section Assignation */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Assigné à</p>
                  <button
                    onClick={() => setShowAssigneeSelector(!showAssigneeSelector)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    disabled={isAssigning}
                  >
                    <UserCheck className="w-3 h-3" />
                    {tache.utilisateur_assigne ? 'Réassigner' : 'Assigner'}
                  </button>
                </div>
                
                {showAssigneeSelector ? (
                  <div className="space-y-2">
                    <AssigneeSelector
                      value={tache.assigne_a}
                      onChange={handleAssigneeChange}
                      projectId={tache.projet_id}
                      placeholder="Sélectionner un membre"
                      disabled={isAssigning}
                    />
                    <button
                      onClick={() => setShowAssigneeSelector(false)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {tache.utilisateur_assigne ? (
                      <>
                        <Avatar 
                          prenom={tache.utilisateur_assigne.prenom} 
                          nom={tache.utilisateur_assigne.nom} 
                          size="sm" 
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {tache.utilisateur_assigne.prenom} {tache.utilisateur_assigne.nom}
                          </p>
                          <p className="text-xs text-gray-500">
                            {tache.utilisateur_assigne.email}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <User className="w-4 h-4" />
                        <span className="text-sm">Non assignée</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Commentaires */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">
              Commentaires ({commentaires.length})
            </h3>
          </div>

          <div className="space-y-4 mb-6">
            {commentaires.map((commentaire) => (
              <div key={commentaire.id} className="flex gap-3">
                <Avatar
                  prenom={commentaire.utilisateur.prenom}
                  nom={commentaire.utilisateur.nom}
                  size="sm"
                />
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-900">
                        {commentaire.utilisateur.prenom} {commentaire.utilisateur.nom}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(commentaire.date_creation).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{commentaire.contenu}</p>
                  </div>
                </div>
              </div>
            ))}

            {commentaires.length === 0 && (
              <p className="text-center text-gray-500 py-8">Aucun commentaire pour le moment</p>
            )}
          </div>

          {/* Formulaire nouveau commentaire */}
          <form onSubmit={handleSubmitCommentaire} className="flex gap-3">
            {user && <Avatar prenom={user.prenom} nom={user.nom} size="sm" />}
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={nouveauCommentaire}
                onChange={(e) => setNouveauCommentaire(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !nouveauCommentaire.trim()}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onEdit}
            className="flex-1 px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition"
          >
            Modifier
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}