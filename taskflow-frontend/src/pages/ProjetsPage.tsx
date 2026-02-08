import { useState, useEffect } from 'react';
import { Plus, Search, Folder, Zap, Archive } from 'lucide-react';
import { projetsService } from '../services/projets.service';
import ProjetCard from '../components/ProjetCard';
import ResponsiveModal from '../components/ResponsiveModal';

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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Projet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Projet | null>(null);
  const [animateCards, setAnimateCards] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6366f1');

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (projects.length > 0) setTimeout(() => setAnimateCards(true), 100);
  }, [projects]);

  const loadProjects = async () => {
    try {
      const data = await projetsService.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await projetsService.update(editingProject.id, { nom: name, description, couleur: color });
      } else {
        await projetsService.create({ nom: name, description, couleur: color, icone: 'folder' });
      }
      resetForm();
      loadProjects();
    } catch (error) {
      console.error('Error saving project', error);
      alert('An error occurred');
    }
  };

  const handleEdit = (project: Projet) => {
    setEditingProject(project);
    setName(project.nom);
    setDescription(project.description || '');
    setColor(project.couleur);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await projetsService.delete(id);
      loadProjects();
    } catch (error) {
      console.error('Error deleting project', error);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      const project = projects.find((p) => p.id === id);
      if (project?.est_archive) await projetsService.desarchiver(id);
      else await projetsService.archiver(id);
      loadProjects();
    } catch (error) {
      console.error('Error archiving project', error);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setColor('#6366f1');
    setEditingProject(null);
    setShowModal(false);
  };

  const filteredProjects = projects.filter((project) =>
    project.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const colors = [
    { value: '#6366f1', name: 'Indigo', gradient: 'from-indigo-500 to-indigo-600' },
    { value: '#8b5cf6', name: 'Violet', gradient: 'from-violet-500 to-violet-600' },
    { value: '#ec4899', name: 'Pink', gradient: 'from-pink-500 to-pink-600' },
    { value: '#f59e0b', name: 'Amber', gradient: 'from-amber-500 to-amber-600' },
    { value: '#10b981', name: 'Emerald', gradient: 'from-emerald-500 to-emerald-600' },
    { value: '#3b82f6', name: 'Blue', gradient: 'from-blue-500 to-blue-600' },
    { value: '#06b6d4', name: 'Cyan', gradient: 'from-cyan-500 to-cyan-600' },
    { value: '#ef4444', name: 'Red', gradient: 'from-red-500 to-red-600' },
  ];

  const stats = [
    { label: 'Total', value: projects.length, icon: Folder, bgColor: 'bg-blue-50', iconColor: 'text-blue-600', borderColor: 'border-blue-200' },
    { label: 'Active', value: projects.filter(p => !p.est_archive).length, icon: Zap, bgColor: 'bg-emerald-50', iconColor: 'text-emerald-600', borderColor: 'border-emerald-200' },
    { label: 'Archived', value: projects.filter(p => p.est_archive).length, icon: Archive, bgColor: 'bg-slate-50', iconColor: 'text-slate-600', borderColor: 'border-slate-200' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">My Projects</h1>
            <p className="text-slate-600 text-lg">Manage and organize all your projects in one place</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
          >
            <Plus className="w-5 h-5" /> New Project
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.bgColor} rounded-2xl p-6 border ${stat.borderColor} hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 bg-white rounded-xl shadow-sm`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                  <p className="text-slate-600 font-medium">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="flex mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search a project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder-slate-400 font-medium"
            />
          </div>
        </div>

        {/* Grid Projects */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-slate-500 font-semibold">No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className={`${animateCards ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProjetCard
                  projet={project}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onArchive={handleArchive}
                />
              </div>
            ))}
          </div>
        )}

        {/* Modal Create / Edit */}
        <ResponsiveModal
          isOpen={showModal}
          onClose={resetForm}
          title={editingProject ? 'Modifier le projet' : 'Nouveau projet'}
          size="md"
        >
          <div className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Nom *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full min-h-touch px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full min-h-[88px] px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-base"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Couleur</label>
                <div className="flex flex-wrap gap-3">
                  {colors.map(c => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setColor(c.value)}
                      className={`min-w-touch min-h-touch w-12 h-12 rounded-full transition ${color === c.value ? 'ring-4 ring-slate-900 ring-offset-2' : 'ring-2 ring-slate-200'}`}
                      style={{ background: c.value }}
                      aria-label={`Couleur ${c.value}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:flex-1 min-h-touch px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-100 font-medium transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-full sm:flex-1 min-h-touch px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
                >
                  {editingProject ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </ResponsiveModal>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}
