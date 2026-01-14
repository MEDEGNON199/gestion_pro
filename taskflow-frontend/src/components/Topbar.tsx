import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, LogOut, User, Mail, ChevronDown, Sparkles, Zap, TrendingUp, Command, Crown, Shield, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Avatar from './Avatar';

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  if (!user) return null;

  const notifications = [
    { id: 1, type: 'invitation', message: 'Nouvelle invitation à un projet', temps: 'Il y a 5 min', unread: true, icon: Mail, color: 'purple' },
    { id: 2, type: 'task', message: 'Tâche assignée: Design review', temps: 'Il y a 1h', unread: true, icon: Zap, color: 'blue' },
    { id: 3, type: 'comment', message: 'Nouveau commentaire sur votre tâche', temps: 'Il y a 2h', unread: false, icon: Star, color: 'amber' },
    { id: 4, type: 'achievement', message: 'Badge "Expert" débloqué! 🏆', temps: 'Il y a 3h', unread: false, icon: TrendingUp, color: 'emerald' },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Recherche:', searchQuery);
    }
  };

  const quickActions = [
    { label: 'Nouveau projet', icon: Sparkles, action: () => navigate('/projets'), gradient: 'from-blue-500 to-purple-600' },
    { label: 'Nouvelle tâche', icon: Zap, action: () => {}, gradient: 'from-purple-500 to-pink-600' },
  ];

  return (
    <div className="sticky top-0 z-40 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-white/10 backdrop-blur-xl">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
      
      <div className="px-6 py-4 relative z-10">
        <div className="flex items-center justify-between gap-6">
          {/* Barre de recherche premium */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${searchFocused ? 'opacity-30' : ''}`} />
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Search className={`w-5 h-5 transition-colors duration-300 ${searchFocused ? 'text-blue-400' : 'text-white/40'}`} />
                  {!searchFocused && !searchQuery && (
                    <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md border border-white/10">
                      <Command className="w-3 h-3 text-white/40" />
                      <span className="text-xs font-bold text-white/40">K</span>
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Rechercher des projets, tâches, membres..."
                  className="w-full pl-14 pr-4 py-3.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all duration-300 text-sm text-white placeholder-white/40 font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Actions rapides */}
          <div className="flex items-center gap-3">
            {/* Quick Actions - Desktop only */}
            <div className="hidden xl:flex items-center gap-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className="group relative px-4 py-2.5 rounded-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors duration-300" />
                    <div className="relative flex items-center gap-2">
                      <Icon className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                      <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">{action.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Separator */}
            <div className="hidden xl:block w-px h-8 bg-white/10" />

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="relative p-3 hover:bg-white/10 rounded-xl transition-all duration-300 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <Bell className="w-5 h-5 text-white/60 group-hover:text-white transition-colors relative z-10" />
                {unreadCount > 0 && (
                  <>
                    <span className="absolute top-2 right-2 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-[10px] font-black text-white z-20 animate-pulse">
                      {unreadCount}
                    </span>
                    <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 rounded-full animate-ping z-10" />
                  </>
                )}
              </button>

              {/* Dropdown Notifications Premium */}
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 top-16 w-96 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl shadow-2xl border border-white/10 z-40 backdrop-blur-xl overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                            <Bell className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="font-black text-white">Notifications</h3>
                        </div>
                        {unreadCount > 0 && (
                          <span className="text-xs font-black text-white bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 rounded-full">
                            {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                      {notifications.map((notif, index) => {
                        const Icon = notif.icon;
                        const colors = {
                          purple: 'from-purple-500 to-purple-600',
                          blue: 'from-blue-500 to-blue-600',
                          amber: 'from-amber-500 to-amber-600',
                          emerald: 'from-emerald-500 to-emerald-600',
                        };
                        return (
                          <div
                            key={notif.id}
                            className={`px-6 py-4 hover:bg-white/5 transition-all duration-300 cursor-pointer border-b border-white/5 group ${
                              notif.unread ? 'bg-blue-500/5' : ''
                            }`}
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`relative p-3 rounded-xl bg-gradient-to-br ${colors[notif.color as keyof typeof colors]} shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                                <div className="absolute inset-0 bg-white/20 rounded-xl blur-sm" />
                                <Icon className="w-4 h-4 text-white relative z-10" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-semibold">{notif.message}</p>
                                <p className="text-xs text-white/40 mt-1 font-medium">{notif.temps}</p>
                              </div>
                              {notif.unread && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 animate-pulse" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-white/10 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
                      <button
                        onClick={() => {
                          navigate('/mes-invitations');
                          setShowNotifications(false);
                        }}
                        className="w-full text-center text-sm font-bold text-white/60 hover:text-white transition-colors py-2 hover:bg-white/5 rounded-lg"
                      >
                        Voir toutes les notifications →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profil Premium */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-xl transition-all duration-300 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-60 transition-opacity duration-300 animate-pulse-glow" />
                  <Avatar prenom={user.prenom} nom={user.nom} size="sm" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full border-2 border-slate-900 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
                <div className="hidden md:block text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white">
                      {user.prenom} {user.nom}
                    </p>
                    <Crown className="w-3 h-3 text-yellow-400" />
                  </div>
                  <p className="text-xs text-white/40 font-medium">{user.email}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Profil Premium */}
              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 top-16 w-80 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl shadow-2xl border border-white/10 z-40 backdrop-blur-xl overflow-hidden">
                    {/* Profile Header */}
                    <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-lg opacity-60 animate-pulse-glow" />
                          <Avatar prenom={user.prenom} nom={user.nom} size="lg" />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full border-2 border-slate-900 flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-base font-black text-white">
                              {user.prenom} {user.nom}
                            </p>
                            <div className="px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center gap-1">
                              <Crown className="w-3 h-3 text-white" />
                              <span className="text-[10px] font-black text-white uppercase">Pro</span>
                            </div>
                          </div>
                          <p className="text-xs text-white/40 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-3 px-6 py-4 border-b border-white/10">
                      {[
                        { label: 'Projets', value: '8', icon: Sparkles, gradient: 'from-blue-500 to-blue-600' },
                        { label: 'Tâches', value: '24', icon: Zap, gradient: 'from-purple-500 to-purple-600' },
                      ].map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                          <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                            <div className="flex items-center justify-between mb-2">
                              <Icon className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                              <span className="text-xs font-bold text-white/40 group-hover:text-white/60 transition-colors">{stat.label}</span>
                            </div>
                            <p className="text-2xl font-black text-white">{stat.value}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {[
                        { label: 'Mon profil', icon: User, action: () => navigate('/settings'), gradient: 'from-blue-500 to-blue-600' },
                        { label: 'Paramètres', icon: Settings, action: () => navigate('/settings'), gradient: 'from-purple-500 to-purple-600' },
                        { label: 'Mes invitations', icon: Mail, action: () => navigate('/mes-invitations'), gradient: 'from-pink-500 to-pink-600' },
                      ].map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              item.action();
                              setShowProfileMenu(false);
                            }}
                            className="w-full px-6 py-3 text-left hover:bg-white/5 flex items-center gap-3 text-white/80 hover:text-white text-sm font-semibold transition-all duration-300 group"
                          >
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${item.gradient} group-hover:scale-110 transition-transform duration-300`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-white/10 p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full px-6 py-3 text-left hover:bg-red-500/10 flex items-center gap-3 text-red-400 hover:text-red-300 text-sm font-bold transition-all duration-300 rounded-xl group"
                      >
                        <div className="p-2 rounded-lg bg-red-500/20 group-hover:bg-red-500/30 group-hover:scale-110 transition-all duration-300">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}