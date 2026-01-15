import { Calendar, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Tache, StatutTache, PrioriteTache } from '../services/taches.service';
import { useState } from 'react';

// ✅ Définir l'interface TacheCardProps
interface TacheCardProps {
  tache: Tache;
  onEdit: (tache: Tache) => void;
  onDelete: (id: string) => void;
  onClick: (tache: Tache) => void;
}

export default function TacheCard({ tache, onEdit, onDelete, onClick }: TacheCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const priorityColors: Record<PrioriteTache, string> = {
    [PrioriteTache.HAUTE]: 'bg-red-100 border-red-300 text-red-700',
    [PrioriteTache.MOYENNE]: 'bg-amber-100 border-amber-300 text-amber-700',
    [PrioriteTache.BASSE]: 'bg-slate-100 border-slate-300 text-slate-700',
  };

  const priorityLabels: Record<PrioriteTache, string> = {
    [PrioriteTache.HAUTE]: 'High',
    [PrioriteTache.MOYENNE]: 'Medium',
    [PrioriteTache.BASSE]: 'Low',
  };

  return (
    <div 
      onClick={() => onClick(tache)}
      className="bg-white p-4 rounded-lg border border-slate-200 hover:shadow-md transition-shadow cursor-pointer relative"
    >
      {/* Menu */}
      <div className="absolute top-3 right-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-1 hover:bg-slate-100 rounded"
        >
          <MoreVertical className="w-4 h-4 text-slate-400" />
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
            <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20 min-w-[120px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(tache);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(tache.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 text-red-600 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <h3 className="font-semibold text-slate-900 mb-2 pr-8">{tache.titre}</h3>
      
      {tache.description && (
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
          {tache.description}
        </p>
      )}

      <div className="flex items-center gap-2 mt-3">
        {/* Priority */}
        <span
          className={`px-2 py-1 rounded-md border text-xs font-medium ${priorityColors[tache.priorite]}`}
        >
          {priorityLabels[tache.priorite]}
        </span>

        {/* Due date */}
        {tache.date_echeance && (
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Calendar className="w-3 h-3" />
            <span>{new Date(tache.date_echeance).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}