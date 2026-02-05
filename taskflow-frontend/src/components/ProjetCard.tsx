import { MoreVertical, Archive, Edit2, Trash2, Folder } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Projet {
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

interface ProjetCardProps {
  projet: Projet;
  onEdit: (projet: Projet) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
}

export default function ProjetCard({ projet, onEdit, onDelete, onArchive }: ProjetCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const iconMap: { [key: string]: any } = {
    folder: Folder,
  };

  const IconComponent = iconMap[projet.icone] || Folder;

  return (
    <div
      className="group bg-white rounded-xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-lg transition-all cursor-pointer relative"
      onClick={() => navigate(`/projets/${projet.id}/taches`)}
    >
      {/* Menu dropdown */}
      <div className="absolute top-4 right-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-1.5 hover:bg-slate-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
        >
          <MoreVertical className="w-5 h-5 text-slate-600" />
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
            <div className="absolute right-0 top-10 bg-white rounded-lg shadow-xl border border-slate-200 py-1 min-w-[160px] z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(projet);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 text-sm font-medium transition"
              >
                <Edit2 className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive(projet.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 text-sm font-medium transition"
              >
                <Archive className="w-4 h-4" />
                {projet.est_archive ? 'Désarchiver' : 'Archiver'}
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Are you sure you want to delete this project?')) {
                    onDelete(projet.id);
                  }
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-2 text-red-600 text-sm font-medium transition"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </>
        )}
      </div>

      {/* Icon avec couleur */}
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
        style={{ backgroundColor: `${projet.couleur}15` }}
      >
        <IconComponent className="w-6 h-6" style={{ color: projet.couleur }} />
      </div>

      {/* Nom et description */}
      <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-slate-700 transition">
        {projet.nom}
      </h3>
      {projet.description ? (
        <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
          {projet.description}
        </p>
      ) : (
        <p className="text-slate-400 text-sm mb-4 italic">
          Aucune description
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-500 font-medium">
          {new Date(projet.date_creation).toLocaleDateString('fr-FR', { 
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </p>

        {/* Badge archivé */}
        {projet.est_archive && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-md">
            <Archive className="w-3 h-3" />
            Archivé
          </span>
        )}
      </div>
    </div>
  );
}