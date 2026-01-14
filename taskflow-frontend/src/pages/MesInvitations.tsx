import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { invitationsService } from '../services/invitations.service';
import { Mail, Check, X, Clock, User, Calendar, Shield, Gift, Sparkles, Crown, Star, Zap, ArrowRight, AlertCircle } from 'lucide-react';

interface Invitation {
  id: string;
  projet_id: string;
  email: string;
  role: string;
  statut: string;
  date_creation: string;
  date_expiration: string;
  token: string;
  projet?: {
    id: string;
    nom: string;
  };
  inviteur?: {
    prenom: string;
    nom: string;
  };
}

const MesInvitations: React.FC = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [animateCards, setAnimateCards] = useState(false);
  const [processingToken, setProcessingToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadInvitations();
  }, []);

  useEffect(() => {
    if (invitations.length > 0) {
      setTimeout(() => setAnimateCards(true), 100);
    }
  }, [invitations]);

  const loadInvitations = async () => {
    try {
      const data = await invitationsService.getMesInvitations();
      setInvitations(data);
    } catch (error) {
      console.error('Erreur lors du chargement des invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccepter = async (token: string) => {
    setProcessingToken(token);
    try {
      const result = await invitationsService.accepter(token);
      // Animation de succès
      setTimeout(() => {
        navigate(`/projets/${result.projet.id}`);
      }, 1000);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de l\'acceptation');
      setProcessingToken(null);
    }
  };

  const handleRefuser = async (token: string) => {
    setProcessingToken(token);
    try {
      await invitationsService.refuser(token);
      loadInvitations();
      setProcessingToken(null);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors du refus');
      setProcessingToken(null);
    }
  };

  const getRoleBadge = (role: string) => {
    const roles: { [key: string]: { label: string; gradient: string; icon: any } } = {
      admin: { label: 'Admin', gradient: 'from-purple-500 to-purple-600', icon: Crown },
      membre: { label: 'Membre', gradient: 'from-blue-500 to-blue-600', icon: User },
      viewer: { label: 'Viewer', gradient: 'from-slate-500 to-slate-600', icon: Shield },
    };
    return roles[role] || roles.membre;
  };

  const getTimeRemaining = (dateExpiration: string) => {
    const now = new Date();
    const expiration = new Date(dateExpiration);
    const diff = expiration.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return { text: 'Expirée', color: 'text-red-400', urgent: true };
    if (days === 0) return { text: 'Expire aujourd\'hui', color: 'text-orange-400', urgent: true };
    if (days === 1) return { text: 'Expire demain', color: 'text-yellow-400', urgent: true };
    return { text: `${days} jours restants`, color: 'text-emerald-400', urgent: false };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="max-w-5xl mx-auto px-6 py-8 relative z-10">
          <div className="mb-8">
            <div className="w-80 h-12 bg-white/10 rounded-2xl mb-3 animate-pulse" />
            <div className="w-[500px] h-6 bg-white/10 rounded-xl animate-pulse" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
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
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-rose-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-[900px] h-[900px] bg-gradient-to-tr from-blue-500/15 via-cyan-500/15 to-teal-500/15 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

      <div className="max-w-5xl mx-auto px-6 py-8 relative z-10">
        {/* Premium Header */}
        <div className="mb-10 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur-xl opacity-60 animate-pulse-glow" />
              <div className="relative bg-gradient-to-br from-purple-500 via-pink-600 to-rose-500 p-3 rounded-2xl">
                <Gift className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-5xl font-black text-white tracking-tight">
                  Mes Invitations
                </h1>
                {invitations.length > 0 && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 blur-lg opacity-60 animate-pulse" />
                    <span className="relative px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-black rounded-full shadow-lg">
                      {invitations.length} invitation{invitations.length > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-white/60 text-lg mt-2 font-medium">
                Gérez vos invitations aux projets collaboratifs
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {invitations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { 
                label: 'En attente', 
                value: invitations.length, 
                icon: Clock, 
                gradient: 'from-blue-500 to-blue-600' 
              },
              { 
                label: 'Urgent', 
                value: invitations.filter(i => getTimeRemaining(i.date_expiration).urgent).length, 
                icon: AlertCircle, 
                gradient: 'from-orange-500 to-red-600' 
              },
              { 
                label: 'Cette semaine', 
                value: invitations.filter(i => {
                  const days = Math.floor((new Date(i.date_expiration).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return days <= 7;
                }).length, 
                icon: Calendar, 
                gradient: 'from-purple-500 to-purple-600' 
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="group relative rounded-2xl p-5 transition-all duration-500 cursor-pointer hover:scale-105"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
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
        )}

        {/* Invitations List */}
        {invitations.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl blur-2xl opacity-40 animate-pulse-glow" />
              <div className="relative inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-3xl backdrop-blur-xl border border-white/10">
                <Mail className="w-16 h-16 text-white/60" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-white mb-3">
              Aucune invitation
            </h3>
            <p className="text-white/60 text-lg mb-8 max-w-md mx-auto">
              Vous n'avez aucune invitation en attente pour le moment
            </p>
            <button
              onClick={() => navigate('/projets')}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-xl hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-500 font-bold overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Sparkles className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Retour aux projets</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {invitations.map((invitation, index) => {
              const roleInfo = getRoleBadge(invitation.role);
              const RoleIcon = roleInfo.icon;
              const timeInfo = getTimeRemaining(invitation.date_expiration);
              const isProcessing = processingToken === invitation.token;

              return (
                <div
                  key={invitation.id}
                  className={`group relative rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02] ${
                    animateCards ? 'animate-fade-in-up' : 'opacity-0'
                  } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500" />

                  <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left Content */}
                    <div className="flex-1 space-y-4">
                      {/* Project Name */}
                      <div className="flex items-start gap-3">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-xl">
                          <Gift className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
                            {invitation.projet?.nom}
                            <Star className="w-5 h-5 text-yellow-400 animate-pulse" />
                          </h3>
                          <div className="flex flex-wrap items-center gap-3">
                            {/* Inviter */}
                            <div className="flex items-center gap-2 text-white/60">
                              <User className="w-4 h-4" />
                              <span className="text-sm font-semibold">
                                {invitation.inviteur?.prenom} {invitation.inviteur?.nom}
                              </span>
                            </div>
                            {/* Role Badge */}
                            <div className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r ${roleInfo.gradient} rounded-lg`}>
                              <RoleIcon className="w-3.5 h-3.5 text-white" />
                              <span className="text-xs font-black text-white uppercase tracking-wider">
                                {roleInfo.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expiration Info */}
                      <div className="flex items-center gap-2">
                        <Clock className={`w-4 h-4 ${timeInfo.color} ${timeInfo.urgent ? 'animate-pulse' : ''}`} />
                        <span className={`text-sm font-bold ${timeInfo.color}`}>
                          {timeInfo.text}
                        </span>
                        <span className="text-white/40 text-sm">•</span>
                        <span className="text-white/40 text-sm font-medium">
                          Expire le {new Date(invitation.date_expiration).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 lg:flex-col">
                      <button
                        onClick={() => handleAccepter(invitation.token)}
                        disabled={isProcessing}
                        className="group/btn relative px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 font-bold overflow-hidden flex items-center justify-center gap-2"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                        <Check className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">Accepter</span>
                        {isProcessing && (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10" />
                        )}
                      </button>
                      <button
                        onClick={() => handleRefuser(invitation.token)}
                        disabled={isProcessing}
                        className="group/btn relative px-6 py-3 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 text-white/80 hover:text-red-400 rounded-xl transition-all duration-300 font-bold flex items-center justify-center gap-2"
                      >
                        <X className="w-5 h-5" />
                        <span>Refuser</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
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
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 25s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default MesInvitations;