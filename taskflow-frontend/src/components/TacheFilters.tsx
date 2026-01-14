import { Search, X, Filter } from 'lucide-react';
import { useState } from 'react';

export interface Filters {
  search: string;
  priorite: string;
  hasEcheance: boolean;
}

interface TacheFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export default function TacheFilters({ filters, onFiltersChange }: TacheFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = filters.priorite !== 'ALL' || filters.hasEcheance;

  const resetFilters = () => {
    onFiltersChange({
      search: '',
      priorite: 'ALL',
      hasEcheance: false,
    });
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Barre de recherche */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une tâche..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition ${
            hasActiveFilters
              ? 'border-violet-600 bg-violet-50 text-violet-600'
              : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-5 h-5" />
          Filtres
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-violet-600 rounded-full"></span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Filtres avancés */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priorité
            </label>
            <div className="flex gap-2">
              {[
                { value: 'ALL', label: 'Toutes' },
                { value: 'HAUTE', label: 'Haute' },
                { value: 'MOYENNE', label: 'Moyenne' },
                { value: 'BASSE', label: 'Basse' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => onFiltersChange({ ...filters, priorite: option.value })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filters.priorite === option.value
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasEcheance}
                onChange={(e) =>
                  onFiltersChange({ ...filters, hasEcheance: e.target.checked })
                }
                className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
              />
              <span className="text-sm text-gray-700">
                Tâches avec échéance uniquement
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}