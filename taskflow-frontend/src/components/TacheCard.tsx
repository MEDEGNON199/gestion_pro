import { Calendar, User, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';

// Types définis localement
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

interface Tache {
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
interface TacheCardProps {
  tache: Tache;
  onEdit: (tache: Tache) => void;
  onDelete: (id: string) => void;
  onClick: (tache: Tache) => void;
}

export default function TacheCard({ tache, onEdit, onDelete, onClick }: TacheCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const priorityColors = {
    HAUTE: 'bg-red-100 text-red-700 border-red-200',
    MOYENNE: 'bg-orange-100 text-orange-700 border-orange-200',
    BASSE: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const priorityLabels = {
    HAUTE: 'Haute',
    MOYENNE: 'Moyenne',
    BASSE: 'Basse',
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer group relative"
      onClick={() => onClick(tache)}
    >
      {/* Menu dropdown */}
      <div className="absolute top-2 right-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-1.5 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="w-4 h-4 text-gray-600" />
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
              }}
            />
            <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[150px] z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(tache);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Modifier
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Supprimer cette tâche ?')) {
                    onDelete(tache.id);
                  }
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-red-50 flex items-center gap-2 text-sm text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Supprimer
              </button>
            </div>
          </>
        )}
      </div>

      {/* Contenu */}
      <h3 className="font-medium text-gray-900 mb-2 pr-6 line-clamp-2">
        {tache.titre}
      </h3>

      {tache.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {tache.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs">
        <span
          className={`px-2 py-1 rounded-md border ${priorityColors[tache.priorite]}`}
        >
          {priorityLabels[tache.priorite]}
        </span>

        {tache.date_echeance && (
          <div className="flex items-center gap-1 text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(tache.date_echeance).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
            })}
          </div>
        )}
      </div>
    </div>
  );
}