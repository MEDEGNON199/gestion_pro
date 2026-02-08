import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, UserPlus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { tachesService, StatutTache, PrioriteTache, Tache } from '../services/taches.service'; // ✅ Importer ici
import { projetsService } from '../services/projets.service';
import TacheCard from '../components/TacheCard';
import TacheDetailModal from '../components/TacheDetailModal';
import ResponsiveModal from '../components/ResponsiveModal';
import ProjetStats from '../components/ProjetStats';
import TacheFilters from "../components/TacheFilters";
import InviterMembreModal from '../components/InviterMembreModal';
import AssigneeSelector from '../components/AssigneeSelector/AssigneeSelector';

// ❌ SUPPRIMER TOUT CECI :
// export const StatutTache = { ... }
// export type StatutTache = ...
// export const PrioriteTache = { ... }
// export type PrioriteTache = ...
// interface Tache { ... }

export default function KanbanPage() {
  const { projetId } = useParams<{ projetId: string }>();
  const navigate = useNavigate();
  
  // ... le reste de ton code

  const [taches, setTaches] = useState<Tache[]>([]);
  const [projetNom, setProjetNom] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingTache, setEditingTache] = useState<Tache | null>(null);
  const [selectedTache, setSelectedTache] = useState<Tache | null>(null);
  const [filters, setFilters] = useState<any>({
    search: '',
    priorite: 'ALL',
    hasEcheance: false,
    assigneA: null,
  });

  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [priorite, setPriorite] = useState<PrioriteTache>(PrioriteTache.MOYENNE);
  const [statut, setStatut] = useState<StatutTache>(StatutTache.A_FAIRE);
  const [dateEcheance, setDateEcheance] = useState('');
  const [assigneA, setAssigneA] = useState<string | null>(null);
  const [dateError, setDateError] = useState(''); 

  const aujourdhui = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (projetId) loadData();
  }, [projetId]);

  const loadData = async () => {
    try {
      const [tachesData, projetData] = await Promise.all([
        tachesService.getAllByProjet(projetId!),
        projetsService.getOne(projetId!),
      ]);
      setTaches(tachesData);
      setProjetNom(projetData.nom);
    } catch (error) {
      console.error('Erreur lors du chargement', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validerDate = (date: string): boolean => {
    if (!date) return true;
    const dateChoisie = new Date(date);
    const dateAujourdhui = new Date(aujourdhui);
    if (dateChoisie < dateAujourdhui) {
      setDateError('La date d\'échéance ne peut pas être dans le passé');
      return false;
    }
    setDateError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dateEcheance && !validerDate(dateEcheance)) return;

    try {
      if (editingTache) {
        const wasAssigned = editingTache.assigne_a;
        const newAssignee = assigneA;
        
        await tachesService.update(editingTache.id, {
          titre,
          description,
          priorite,
          statut,
          date_echeance: dateEcheance || undefined,
          assigne_a: assigneA || undefined,
        });
        
        // Message de confirmation pour réassignation
        if (wasAssigned !== newAssignee && newAssignee) {
          alert('✅ Tâche réassignée avec succès ! Une notification a été envoyée au nouveau membre.');
        }
      } else {
        await tachesService.create({
          titre,
          description,
          projet_id: projetId!,
          priorite,
          statut,
          date_echeance: dateEcheance || undefined,
          assigne_a: assigneA || undefined,
        });
        
        // Message de confirmation pour nouvelle assignation
        if (assigneA) {
          alert('✅ Tâche créée et assignée avec succès ! Une notification a été envoyée au membre.');
        }
      }
      resetForm();
      loadData();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde', error);
      alert('❌ Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.');
    }
  };

  const filteredTaches = taches.filter((tache) => {
    if (filters.search && !tache.titre.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.priorite !== 'ALL' && tache.priorite !== filters.priorite) return false;
    if (filters.hasEcheance && !tache.date_echeance) return false;
    
    // Filtre par assignation
    if (filters.assigneA !== null) {
      if (filters.assigneA === 'unassigned') {
        // Afficher seulement les tâches non assignées
        if (tache.assigne_a) return false;
      } else {
        // Afficher seulement les tâches assignées à cet utilisateur
        if (tache.assigne_a !== filters.assigneA) return false;
      }
    }
    
    return true;
  });

  const handleEdit = (tache: Tache) => {
    setEditingTache(tache);
    setTitre(tache.titre);
    setDescription(tache.description || '');
    setPriorite(tache.priorite);
    setStatut(tache.statut);
    setDateEcheance(tache.date_echeance ? tache.date_echeance.split('T')[0] : '');
    setAssigneA(tache.assigne_a || null);
    setDateError('');
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await tachesService.delete(id);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression', error);
    }
  };

  const resetForm = () => {
    setTitre('');
    setDescription('');
    setPriorite(PrioriteTache.MOYENNE);
    setStatut(StatutTache.A_FAIRE);
    setDateEcheance('');
    setAssigneA(null);
    setDateError('');
    setEditingTache(null);
    setShowModal(false);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nouvelleDate = e.target.value;
    setDateEcheance(nouvelleDate);
    validerDate(nouvelleDate);
  };

  const handleDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;

    const tache = taches.find((t) => t.id === draggableId);
    if (!tache) return;

    const nouveauStatut = destination.droppableId as StatutTache;
    try {
      setTaches(prev => prev.map(t => t.id === draggableId ? { ...t, statut: nouveauStatut } : t));
      await tachesService.update(draggableId, { statut: nouveauStatut });
    } catch (error) {
      console.error('Erreur lors du déplacement', error);
      loadData();
    }
  };

  const colonnes = [
    { titre: 'À faire', statut: StatutTache.A_FAIRE, bgColor: 'bg-slate-50', borderColor: 'border-slate-200' },
{ titre: 'En cours', statut: StatutTache.EN_COURS, bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
{ titre: 'Terminées', statut: StatutTache.TERMINEE, bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },

  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-900 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8 h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <button onClick={() => navigate('/projets')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Retour aux projets
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">{projetNom}</h1>
              <p className="text-slate-600 mt-2 text-lg">{taches.length} tâche{taches.length > 1 ? 's' : ''}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowInviteModal(true)} className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium">
                <UserPlus className="w-5 h-5" /> Inviter
              </button>
              <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition shadow-sm font-medium">
                <Plus className="w-5 h-5" /> Nouvelle tâche
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <ProjetStats
          totalTaches={taches.length}
          aFaire={taches.filter(t => t.statut === StatutTache.A_FAIRE).length}
enCours={taches.filter(t => t.statut === StatutTache.EN_COURS).length}
          terminees={taches.filter(t => t.statut === StatutTache.TERMINEE).length}
        />

        {/* Filtres */}
        <TacheFilters filters={filters} onFiltersChange={setFilters} projectId={projetId!} />

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 pb-6">
            {colonnes.map(colonne => {
              const tachesColonne = filteredTaches.filter(t => t.statut === colonne.statut);
              return (
                <div key={colonne.statut} className="flex flex-col min-h-0">
                  <div className={`${colonne.bgColor} ${colonne.borderColor} border rounded-lg p-3 mb-3`}>
                    <h2 className="font-bold text-slate-900 text-sm">{colonne.titre} <span className="ml-2 text-slate-500 font-normal">({tachesColonne.length})</span></h2>
                  </div>
                  <Droppable droppableId={colonne.statut}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className={`space-y-3 flex-1 p-2 rounded-lg transition-colors min-h-[200px] ${snapshot.isDraggingOver ? 'bg-slate-100' : 'bg-transparent'}`}>
                        {tachesColonne.map((tache, index) => (
                          <Draggable key={tache.id} draggableId={tache.id} index={index}>
                            {(provided, snapshot) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={snapshot.isDragging ? 'opacity-60' : ''}>
                                <TacheCard tache={tache} onEdit={handleEdit} onDelete={handleDelete} onClick={setSelectedTache} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>

        {/* Create/Edit Modal */}
        <ResponsiveModal
          isOpen={showModal}
          onClose={resetForm}
          title={editingTache ? 'Edit Task' : 'New Task'}
          size="md"
        >
          <div className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Title *</label>
                <input 
                  type="text" 
                  value={titre} 
                  onChange={e => setTitre(e.target.value)} 
                  className="w-full min-h-touch px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-base" 
                  placeholder="My task..." 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  className="w-full min-h-[88px] px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none resize-none text-base" 
                  rows={4} 
                  placeholder="Task details..." 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
                  <select 
                    value={priorite} 
                    onChange={e => setPriorite(e.target.value as PrioriteTache)} 
                    className="w-full min-h-touch px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-base"
                  >
                    <option value={PrioriteTache.BASSE}>Low</option>
                    <option value={PrioriteTache.MOYENNE}>Medium</option>
                    <option value={PrioriteTache.HAUTE}>High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                  <select 
                    value={statut} 
                    onChange={e => setStatut(e.target.value as StatutTache)} 
                    className="w-full min-h-touch px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-base"
                  >
                    <option value={StatutTache.A_FAIRE}>To Do</option>
                    <option value={StatutTache.EN_COURS}>In Progress</option>
                    <option value={StatutTache.TERMINEE}>Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Due Date</label>
                <input 
                  type="date" 
                  value={dateEcheance} 
                  onChange={handleDateChange} 
                  min={aujourdhui} 
                  className={`w-full min-h-touch px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-base ${dateError ? 'border-red-500' : 'border-slate-200'}`} 
                />
                {dateError && <p className="text-red-600 text-sm mt-2 flex items-center gap-1">⚠️ {dateError}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Assign to</label>
                <AssigneeSelector
                  value={assigneA}
                  onChange={setAssigneA}
                  projectId={projetId!}
                  placeholder="Select a member (optional)"
                  allowUnassigned={true}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={resetForm} 
                  className="w-full sm:flex-1 min-h-touch px-6 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-full sm:flex-1 min-h-touch px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium disabled:bg-slate-400 disabled:cursor-not-allowed" 
                  disabled={!!dateError}
                >
                  {editingTache ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </ResponsiveModal>

        {/* Invite Modal */}
        <InviterMembreModal projetId={projetId!} isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} onSuccess={() => alert('Invitation sent successfully! 📧')} />

        {/* Details Modal */}
        {selectedTache && <TacheDetailModal tache={selectedTache} onClose={() => setSelectedTache(null)} onEdit={() => { handleEdit(selectedTache); setSelectedTache(null); }} onUpdate={loadData} />}
      </div>
    </div>
  );
}
