import { useState, useEffect } from 'react';
import { Plus, Search, Folder, Grid3x3, Sparkles, Zap, TrendingUp, Filter, SortAsc, Archive, Palette, Star, Rocket, Crown } from 'lucide-react';
import { projetsService } from '../services/projets.service';
import ProjetCard from '../components/ProjetCard';

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

export default function ProjetsPage() {
  const [projets, setProjets] = useState<Projet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProjet, setEditingProjet] = useState<Projet | null>(null);
  const [animateCards, setAnimateCards] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [couleur, setCouleur] = useState('#6366f1');

  useEffect(() => {
    loadProjets();
  }, []);

  useEffect(() => {
    if (projets.length > 0) {
      setTimeout(() => setAnimateCards(true), 100);
    }
  }, [projets]);

  const loadProjets = async () => {
    try {
      const data = await projetsService.getAll();
      setProjets(data);
    } catch (error) {
      console.error('Erreur lors du chargement des projets', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProjet) {
        await projetsService.update(editingProjet.id, { nom, description, couleur });
      } else {
        await projetsService.create({ nom, description, couleur, icone: 'folder' });
      }
      resetForm();
      loadProjets();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde', error);
      alert('Une erreur est survenue');
    }
  };

  const handleEdit = (projet: Projet) => {
    setEditingProjet(projet);
    setNom(projet.nom);
    setDescription(projet.description || '');
    setCouleur(projet.couleur);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await projetsService.delete(id);
      loadProjets();
    } catch (error) {
      console.error('Erreur lors de la suppression', error);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      const projet = projets.find((p) => p.id === id);
      if (projet?.est_archive) {
        await projetsService.desarchiver(id);
      } else {
        await projetsService.archiver(id);
      }
      loadProjets();
    } catch (error) {
      console.error('Erreur lors de l\'archivage', error);
    }
  };

  const resetForm = () => {
    setNom('');
    setDescription('');
    setCouleur('#6366f1');
    setEditingProjet(null);
    setShowModal(false);
  };

  const filteredProjets = projets.filter((projet) =>
    projet.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const colors = [
    { value: '#6366f1', name: 'Indigo', gradient: 'from-indigo-500 to-indigo-600' },
    { value: '#8b5cf6', name: 'Violet', gradient: 'from-violet-500 to-violet-600' },
    { value: '#ec4899', name: 'Rose', gradient: 'from-pink-500 to-pink-600' },
    { value: '#f59e0b', name: 'Amber', gradient: 'from-amber-500 to-amber-600' },
    { value: '#10b981', name: 'Emerald', gradient: 'from-emerald-500 to-emerald-600' },
    { value: '#3b82f6', name: 'Blue', gradient: 'from-blue-500 to-blue-600' },
    { value: '#06b6d4', name: 'Cyan', gradient: 'from-cyan-500 to-cyan-600' },
    { value: '#ef4444', name: 'Red', gradient: 'from-red-500 to-red-600' },
  ];

  const stats = [
    { label: 'Total', value: projets.length, icon: Folder, gradient: 'from-blue-500 to-purple-600' },
    { label: 'Actifs', value: projets.filter(p => !p.est_archive).length, icon: Zap, gradient: 'from-emerald-500 to-teal-600' },
    { label: 'Archivés', value: projets.filter(p => p.est_archive).length, icon: Archive, gradient: 'from-slate-500 to-slate-700' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
          <div className="mb-8">
            <div className="w-64 h-12 bg-white/10 rounded-2xl mb-3 animate-pulse" />
            <div className="w-96 h-6 bg-white/10 rounded-xl animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-white/5 rounded-2xl border border-white/10 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-[900px] h-[900px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/15 to-cyan-500/15 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Premium Header */}
        <div className="mb-10 animate-fade-in-up">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-60 animate-pulse-glow" />
                  <div className="relative bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-3 rounded-2xl">
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-5xl font-black text-white tracking-tight">
                      Mes Projets
                    </h1>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 blur-lg opacity-60 animate-pulse" />
                      <span className="relative px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-black rounded-full shadow-lg">
                        {projets.length} projet{projets.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <p className="text-white/60 text-lg mt-2 font-medium">
                    Gérez et organisez tous vos projets en un seul endroit
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="group relative rounded-2xl p-5 transition-all duration-500 cursor-pointer hover:scale-105"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500`} />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm font-bold mb-2">{stat.label}</p>
                      <p className="text-4xl font-black text-white">{stat.value}</p>
                    </div>
                    <div className={`p-4 bg-gradient-to-br ${stat.gradient} rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Bar Premium */}
          <div className="flex-1 relative group">
            <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${searchFocused ? 'opacity-30' : ''}`} />
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${searchFocused ? 'text-blue-400' : 'text-white/40'}`} />
              <input
                type="text"
                placeholder="Rechercher un projet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all duration-300 text-sm text-white placeholder-white/40 font-medium"
              />
            </div>
          </div>

          {/* Create Button Premium */}
          <button
            onClick={() => setShowModal(true)}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 font-bold overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center gap-3">
              <Plus className="w-5 h-5" />
              <span>Nouveau projet</span>
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
          </button>
        </div>

        {/* Grid de projets ou Empty State */}
        {filteredProjets.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-40 animate-pulse-glow" />
              <div className="relative inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-3xl backdrop-blur-xl border border-white/10">
                <Rocket className="w-16 h-16 text-white/60" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-white mb-3">
              {searchTerm ? 'Aucun projet trouvé' : 'Aucun projet'}
            </h3>
            <p className="text-white/60 text-lg mb-8 max-w-md mx-auto">
              {searchTerm 
                ? 'Essayez avec un autre terme de recherche'
                : 'Créez votre premier projet pour commencer votre voyage productif !'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowModal(true)}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 font-bold overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Plus className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Créer mon premier projet</span>
                <Star className="w-5 h-5 relative z-10 animate-pulse" />
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjets.map((projet, index) => (
              <div
                key={projet.id}
                className={`${animateCards ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProjetCard
                  projet={projet}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onArchive={handleArchive}
                />
              </div>
            ))}
          </div>
        )}

        {/* Modal Premium Créer/Modifier */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
            <div 
              className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-scale-in"
              style={{
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(40px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                <div className="flex items-center gap-4">
                  <div className={`p-3 bg-gradient-to-br ${editingProjet ? 'from-purple-500 to-purple-600' : 'from-blue-500 to-purple-600'} rounded-2xl shadow-xl`}>
                    {editingProjet ? <Palette className="w-6 h-6 text-white" /> : <Sparkles className="w-6 h-6 text-white" />}
                  </div>
                  <h2 className="text-3xl font-black text-white">
                    {editingProjet ? 'Modifier le projet' : 'Nouveau projet'}
                  </h2>
                </div>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Nom */}
                <div>
                  <label className="block text-sm font-black text-white mb-3">
                    Nom du projet *
                  </label>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all text-white placeholder-white/40 font-medium"
                    placeholder="Mon super projet"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-black text-white mb-3">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all resize-none text-white placeholder-white/40 font-medium"
                    rows={3}
                    placeholder="Description du projet..."
                  />
                </div>

                {/* Couleur Premium */}
                <div>
                  <label className="block text-sm font-black text-white mb-3 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Couleur du projet
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setCouleur(color.value)}
                        className={`group relative h-16 rounded-xl transition-all duration-300 overflow-hidden ${
                          couleur === color.value ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-105' : 'hover:scale-105'
                        }`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${color.gradient}`} />
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                        {couleur === color.value && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                              <Star className="w-5 h-5 text-slate-900" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white rounded-xl transition-all font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl transition-all font-bold shadow-lg hover:shadow-xl"
                  >
                    {editingProjet ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.05); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, 20px) scale(1.05); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 25s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </div>
  );
}