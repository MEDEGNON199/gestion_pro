import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, User, X } from 'lucide-react';
import { membresProjetsService, MembreProjet } from '../../services/membres-projets.service';
import Avatar from '../Avatar';

export interface AssigneeSelectorProps {
  value?: string; // ID de l'utilisateur assigné
  onChange: (userId: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  projectId: string;
  allowUnassigned?: boolean; // Permet de désassigner
}

interface AssigneeSelectorState {
  isOpen: boolean;
  searchTerm: string;
  filteredMembers: MembreProjet[];
  isLoading: boolean;
  error: string | null;
}

export default function AssigneeSelector({
  value,
  onChange,
  placeholder = "Sélectionner un assigné",
  disabled = false,
  projectId,
  allowUnassigned = true
}: AssigneeSelectorProps) {
  const [state, setState] = useState<AssigneeSelectorState>({
    isOpen: false,
    searchTerm: '',
    filteredMembers: [],
    isLoading: false,
    error: null
  });
  
  const [members, setMembers] = useState<MembreProjet[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Charger les membres du projet
  useEffect(() => {
    if (projectId) {
      loadMembers();
    }
  }, [projectId]);

  // Filtrer les membres selon le terme de recherche
  useEffect(() => {
    const filtered = members.filter(member =>
      `${member.utilisateur.prenom} ${member.utilisateur.nom}`
        .toLowerCase()
        .includes(state.searchTerm.toLowerCase()) ||
      member.utilisateur.email
        .toLowerCase()
        .includes(state.searchTerm.toLowerCase())
    );
    
    setState(prev => ({ ...prev, filteredMembers: filtered }));
  }, [members, state.searchTerm]);

  // Fermer le dropdown si on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setState(prev => ({ ...prev, isOpen: false, searchTerm: '' }));
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadMembers = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const data = await membresProjetsService.getByProjet(projectId);
      setMembers(data);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Erreur lors du chargement des membres' 
      }));
      console.error('Erreur lors du chargement des membres:', error);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleToggleDropdown = () => {
    if (disabled) return;
    
    setState(prev => ({ 
      ...prev, 
      isOpen: !prev.isOpen,
      searchTerm: prev.isOpen ? '' : prev.searchTerm
    }));
    
    // Focus sur l'input de recherche quand on ouvre
    if (!state.isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSelectMember = (member: MembreProjet | null) => {
    onChange(member?.utilisateur_id || null);
    setState(prev => ({ 
      ...prev, 
      isOpen: false, 
      searchTerm: '' 
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, searchTerm: e.target.value }));
  };

  // Trouver le membre sélectionné
  const selectedMember = members.find(m => m.utilisateur_id === value);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton principal */}
      <button
        type="button"
        onClick={handleToggleDropdown}
        disabled={disabled}
        className={`
          w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg 
          focus:ring-2 focus:ring-blue-500 focus:border-transparent 
          outline-none transition text-left flex items-center justify-between
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-300'}
        `}
        aria-haspopup="listbox"
        aria-expanded={state.isOpen}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {selectedMember ? (
            <>
              <Avatar 
                prenom={selectedMember.utilisateur.prenom} 
                nom={selectedMember.utilisateur.nom} 
                size="sm" 
              />
              <span className="text-sm text-slate-900 truncate">
                {selectedMember.utilisateur.prenom} {selectedMember.utilisateur.nom}
              </span>
            </>
          ) : (
            <>
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-500">{placeholder}</span>
            </>
          )}
        </div>
        
        <ChevronDown 
          className={`w-4 h-4 text-slate-400 transition-transform ${
            state.isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown */}
      {state.isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden">
          {/* Champ de recherche */}
          <div className="p-3 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={state.searchTerm}
                onChange={handleSearchChange}
                placeholder="Rechercher un membre..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Liste des options */}
          <div className="max-h-48 overflow-y-auto">
            {state.isLoading ? (
              <div className="px-4 py-3 text-sm text-slate-500 text-center">
                Chargement...
              </div>
            ) : state.error ? (
              <div className="px-4 py-3 text-sm text-red-600 text-center">
                {state.error}
              </div>
            ) : (
              <>
                {/* Option "Non assigné" */}
                {allowUnassigned && (
                  <button
                    type="button"
                    onClick={() => handleSelectMember(null)}
                    className={`
                      w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-3
                      ${!value ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}
                    `}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <X className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="text-sm">Non assigné</span>
                  </button>
                )}

                {/* Liste des membres */}
                {state.filteredMembers.length === 0 && state.searchTerm ? (
                  <div className="px-4 py-3 text-sm text-slate-500 text-center">
                    Aucun membre trouvé
                  </div>
                ) : (
                  state.filteredMembers.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => handleSelectMember(member)}
                      className={`
                        w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-3
                        ${value === member.utilisateur_id ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}
                      `}
                    >
                      <Avatar 
                        prenom={member.utilisateur.prenom} 
                        nom={member.utilisateur.nom} 
                        size="sm" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {member.utilisateur.prenom} {member.utilisateur.nom}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {member.utilisateur.email}
                        </div>
                      </div>
                      {member.role === 'PROPRIETAIRE' && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          Propriétaire
                        </span>
                      )}
                      {member.role === 'ADMIN' && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          Admin
                        </span>
                      )}
                    </button>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}