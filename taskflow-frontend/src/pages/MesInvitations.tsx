import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { invitationsService } from '../services/invitations.service';
import { Mail, Check, X, Clock, User, Calendar, Shield, Gift, Crown, AlertCircle, ArrowRight } from 'lucide-react';

interface Invitation {
  id: string;
  projet_id: string;
  email: string;
  role: string;
  statut: string;
  date_creation: string;
  date_expiration: string;
  token?: string; // <--- ici tu mets "?" pour dire que ce n’est pas obligatoire
  projet?: {
    id: string;
    nom: string;
  };
  inviteur?: {
    prenom: string;
    nom: string;
  };
}


const MyInvitations: React.FC = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingToken, setProcessingToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      const data = await invitationsService.getMesInvitations();
      setInvitations(data);
    } catch (error) {
      console.error('Error loading invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (token: string) => {
    setProcessingToken(token);
    try {
      const result = await invitationsService.accepter(token);
      setTimeout(() => {
        navigate(`/projects/${result.projet.id}`);
      }, 1000);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error accepting invitation');
      setProcessingToken(null);
    }
  };

  const handleDecline = async (token: string) => {
    setProcessingToken(token);
    try {
      await invitationsService.refuser(token);
      loadInvitations();
      setProcessingToken(null);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error declining invitation');
      setProcessingToken(null);
    }
  };

  const getRoleBadge = (role: string) => {
    const roles: { [key: string]: { label: string; bgColor: string; textColor: string; icon: any } } = {
      admin: { label: 'Admin', bgColor: 'bg-purple-100', textColor: 'text-purple-700', icon: Crown },
      membre: { label: 'Member', bgColor: 'bg-blue-100', textColor: 'text-blue-700', icon: User },
      viewer: { label: 'Viewer', bgColor: 'bg-slate-100', textColor: 'text-slate-700', icon: Shield },
    };
    return roles[role] || roles.membre;
  };

  const getTimeRemaining = (dateExpiration: string) => {
    const now = new Date();
    const expiration = new Date(dateExpiration);
    const diff = expiration.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return { text: 'Expired', color: 'text-red-600', bgColor: 'bg-red-50', urgent: true };
    if (days === 0) return { text: 'Expires today', color: 'text-orange-600', bgColor: 'bg-orange-50', urgent: true };
    if (days === 1) return { text: 'Expires tomorrow', color: 'text-amber-600', bgColor: 'bg-amber-50', urgent: true };
    return { text: `${days} days left`, color: 'text-emerald-600', bgColor: 'bg-emerald-50', urgent: false };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading invitations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                My Invitations
              </h1>
              <p className="text-slate-600 text-lg">
                Manage your collaborative project invitations
              </p>
            </div>
            {invitations.length > 0 && (
              <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold">
                {invitations.length} invitation{invitations.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {invitations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-2">Pending</p>
                  <p className="text-3xl font-bold text-slate-900">{invitations.length}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-2">Urgent</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {invitations.filter(i => getTimeRemaining(i.date_expiration).urgent).length}
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-2">This Week</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {invitations.filter(i => {
                      const days = Math.floor((new Date(i.date_expiration).getTime() - new Date().getTime()) / (1000*60*60*24));
                      return days <= 7;
                    }).length}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {invitations.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-2xl mb-6">
              <Mail className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              No Invitations
            </h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              You currently have no pending invitations
            </p>
            <button
              onClick={() => navigate('/projects')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              <span>Back to Projects</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {invitations.map((invitation) => {
              const roleInfo = getRoleBadge(invitation.role);
              const RoleIcon = roleInfo.icon;
              const timeInfo = getTimeRemaining(invitation.date_expiration);
              const isProcessing = processingToken === invitation.token;

              return (
                <div
                  key={invitation.id}
                  className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                          <Gift className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {invitation.projet?.nom}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 text-slate-600">
                              <User className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {invitation.inviteur?.prenom} {invitation.inviteur?.nom}
                              </span>
                            </div>
                            <div className={`inline-flex items-center gap-1 px-3 py-1 ${roleInfo.bgColor} rounded-lg`}>
                              <RoleIcon className={`w-3.5 h-3.5 ${roleInfo.textColor}`} />
                              <span className={`text-xs font-semibold ${roleInfo.textColor} uppercase tracking-wider`}>{roleInfo.label}</span>
                            </div>
                            <div className={`inline-flex items-center gap-1 px-3 py-1 ${timeInfo.bgColor} rounded-lg`}>
                              <Clock className={`w-3.5 h-3.5 ${timeInfo.color}`} />
                              <span className={`text-xs font-semibold ${timeInfo.color} uppercase tracking-wider`}>{timeInfo.text}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-slate-500">
                        Expires on {new Date(invitation.date_expiration).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => invitation.token && handleAccept(invitation.token)}
                        disabled={isProcessing}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                      >
                        <Check className="w-5 h-5" />
                        <span>Accept</span>
                        {isProcessing && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                      </button>
                      <button
                        onClick={() => invitation.token && handleDecline(invitation.token)}
                        disabled={isProcessing}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-700 hover:text-red-700 rounded-xl transition-all font-semibold"
                      >
                        <X className="w-5 h-5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInvitations;
