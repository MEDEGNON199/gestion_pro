import React, { useState, useEffect } from 'react';
import { ChevronDown, Users, UserX, User } from 'lucide-react';
import { membresProjetsService, MembreProjet } from '../../services/membres-projets.service';
import Avatar from '../Avatar';

export interface FilterByAssigneeProps {
  value: string | null; // null = tous, "unassigned" = non assignés, userId = assigné spécifique
  onChange: (filter: string | null) => void;
  projectId: string;
}

export default function FilterByAssignee({ value, onChange, projectId }: FilterByAssigneeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState<MembreProjet[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadMembers();
    }
  }, [projectId]);

  const loadMembers = async () => {
    setIsLoading(true);
    try {
      const data = await membresProjetsService.getByProjet(projectId);
      setMembers(data);
    } catch (error) {
      console.error('Erreur lors du chargement des membres:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newValue: string | null) => {
    onChange(newValue);
    setIsOpen(false);
  };

  // Trouver le membre sélectionné pour l'affichage
  const selectedMember = value && value !== 'unassigned' 
    ? members.find(m => m.utilisateur_id === value)
    : null;

  const getDisplayText = () => {
    if (!value) return 'Tous les assignés';
    if (value === 'unassigned') return 'Non assignées';
    if (selectedMember) {
      return `${selectedMember.utilisateur.prenom} ${selectedMember.utilisateur.nom}`;
    }
    return 'Filtre assigné';
  };

  const getDisplayIcon = () => {
    if (!value) return <Users className="w-4 h-4" />;
    if (value === 'unassigned') return <UserX className="w-4 h-4" />;
    if (selectedMember) {
      return (
        <Avatar 
          prenom={selectedMember.utilisateur.prenom} 
          nom={selectedMember.utilisateur.nom} 
          size="xs" 
        />
      );
    }
    return <User className="w-4 h-4" />;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 min-h-touch w-full sm:w-auto bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition text-sm"
      >
        {getDisplayIcon()}
        <span className="text-slate-700 truncate flex-1 text-left">{getDisplayText()}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 sm:left-0 w-[90vw] left-[5vw] sm:left-0 sm:w-auto mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-[200px] max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-3 text-sm text-slate-500 text-center">
                Chargement...
              </div>
            ) : (
              <>
                {/* Option "Tous" */}
                <button
                  onClick={() => handleFilterChange(null)}
                  className={`
                    w-full px-4 py-3 min-h-touch text-left hover:bg-slate-50 flex items-center gap-3 text-sm
                    ${!value ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}
                  `}
                >
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span>Tous les assignés</span>
                </button>

                {/* Option "Non assignées" */}
                <button
                  onClick={() => handleFilterChange('unassigned')}
                  className={`
                    w-full px-4 py-3 min-h-touch text-left hover:bg-slate-50 flex items-center gap-3 text-sm
                    ${value === 'unassigned' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}
                  `}
                >
                  <UserX className="w-4 h-4 flex-shrink-0" />
                  <span>Non assignées</span>
                </button>

                {/* Séparateur */}
                {members.length > 0 && (
                  <div className="border-t border-slate-200 my-1" />
                )}

                {/* Liste des membres */}
                {members.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => handleFilterChange(member.utilisateur_id)}
                    className={`
                      w-full px-4 py-3 min-h-touch text-left hover:bg-slate-50 flex items-center gap-3 text-sm
                      ${value === member.utilisateur_id ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}
                    `}
                  >
                    <Avatar 
                      prenom={member.utilisateur.prenom} 
                      nom={member.utilisateur.nom} 
                      size="xs" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {member.utilisateur.prenom} {member.utilisateur.nom}
                      </div>
                    </div>
                    {member.role === 'PROPRIETAIRE' && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded flex-shrink-0">
                        Propriétaire
                      </span>
                    )}
                    {member.role === 'ADMIN' && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded flex-shrink-0">
                        Admin
                      </span>
                    )}
                  </button>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}