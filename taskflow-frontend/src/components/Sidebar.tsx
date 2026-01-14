import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Settings, LogOut, Layers, Mail, ChevronLeft, ChevronRight, Sparkles, Zap, TrendingUp, Award, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Avatar from './Avatar';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const [streak] = useState(7);

  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelector('.sidebar-container')?.classList.add('sidebar-visible');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!user) return null;

  const handleToggle = () => {
    console.log('Toggle clicked, current state:', isCollapsed);
    setIsCollapsed(prev => !prev);
  };

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: LayoutDashboard,
      gradient: 'from-blue-500 to-purple-600',
      badge: 'Live',
      badgeColor: 'bg-emerald-500',
    },
    { 
      name: 'Projets', 
      path: '/projets', 
      icon: FolderKanban,
      gradient: 'from-purple-500 to-pink-600',
    },
    { 
      name: 'Invitations', 
      path: '/mes-invitations', 
      icon: Mail,
      gradient: 'from-orange-500 to-red-600',
    },
    { 
      name: 'Paramètres', 
      path: '/settings', 
      icon: Settings,
      gradient: 'from-slate-500 to-slate-700',
    },
  ];

  const stats = [
    { label: 'Tâches', value: '24', icon: Zap, color: 'text-blue-400' },
    { label: 'Score', value: '95%', icon: TrendingUp, color: 'text-emerald-400' },
  ];

  return (
    <aside
      className={`
        sidebar-container
        flex-shrink-0
        ${isCollapsed ? 'w-20' : 'w-72'}
        bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950
        border-r border-white/10
        h-screen sticky top-0 flex flex-col transition-all duration-500 ease-in-out
        backdrop-blur-xl
        relative overflow-hidden
        opacity-0
      `}
      style={{ minWidth: isCollapsed ? '5rem' : '18rem' }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Logo Section */}
        <div className="px-6 py-6 border-b border-white/10">
          {!isCollapsed ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-lg opacity-60 animate-pulse-glow" />
                    <div className="relative bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-2.5 rounded-xl shadow-2xl">
                      <Layers className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <span className="text-xl font-black text-white tracking-tight">
                      TaskFlow
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Crown className="w-3 h-3 text-yellow-400" />
                      <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">Premium</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleToggle}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-300 group z-50"
                  type="button"
                  aria-label="Réduire la sidebar"
                >
                  <ChevronLeft className="w-4 h-4 text-white/60 group-hover:text-white" />
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Icon className={`w-4 h-4 ${stat.color}`} />
                        <span className="text-xs font-bold text-white/40 group-hover:text-white/60 transition-colors">{stat.label}</span>
                      </div>
                      <p className="text-xl font-black text-white">{stat.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Streak Badge */}
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-3 border border-orange-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">🔥</div>
                    <div>
                      <p className="text-xs font-bold text-orange-300">Streak actuel</p>
                      <p className="text-sm font-black text-white">{streak} jours</p>
                    </div>
                  </div>
                  <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={handleToggle}
                className="relative p-2 hover:bg-white/10 rounded-lg transition-all duration-300 group z-50"
                type="button"
                aria-label="Ouvrir la sidebar"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-60 transition-opacity" />
                <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white relative z-10" />
              </button>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-lg opacity-60 animate-pulse-glow" />
                <div className="relative bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-2.5 rounded-xl shadow-2xl">
                  <Layers className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isHovered = activeHover === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                onMouseEnter={() => setActiveHover(item.path)}
                onMouseLeave={() => setActiveHover(null)}
                type="button"
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 font-semibold text-sm
                  relative overflow-hidden group
                  ${isActive
                    ? 'text-white shadow-xl'
                    : 'text-white/60 hover:text-white'
                  }
                `}
              >
                {/* Active/Hover Background */}
                {(isActive || isHovered) && (
                  <div 
                    className={`absolute inset-0 bg-gradient-to-r ${item.gradient} transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-50'}`}
                  />
                )}
                {!isActive && !isHovered && (
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
                )}

                {/* Glow Effect */}
                {isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} blur-xl opacity-40`} />
                )}

                {/* Content */}
                <div className="relative z-10 flex items-center gap-3 w-full">
                  <div className={`${isActive ? 'scale-110' : 'scale-100'} transition-transform duration-300`}>
                    <Icon className="w-5 h-5 flex-shrink-0" />
                  </div>
                  {!isCollapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className={`${item.badgeColor} text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Premium Banner */}
        {!isCollapsed && (
          <div className="mx-3 mb-4">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-black text-white mb-1">Compte Premium</h4>
                  <p className="text-xs text-white/60 mb-3">Accès illimité à toutes les fonctionnalités</p>
                  <button className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 px-3 rounded-lg transition-all duration-300">
                    Gérer l'abonnement
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Section */}
        <div className="p-4 border-t border-white/10">
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-60 transition-opacity" />
                  <Avatar prenom={user.prenom} nom={user.nom} size="md" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {user.prenom} {user.nom}
                  </p>
                  <p className="text-xs text-white/50 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/auth');
                }}
                type="button"
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 group"
              >
                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Déconnexion</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur opacity-60 animate-pulse-glow" />
                <Avatar prenom={user.prenom} nom={user.nom} size="md" />
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/auth');
                }}
                type="button"
                className="w-full flex justify-center p-2.5 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 group"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .sidebar-container {
          transition: opacity 0.6s ease-out, transform 0.6s ease-out, width 0.5s ease-in-out !important;
          transform: translateX(-20px);
        }
        .sidebar-visible {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
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
    </aside>
  );
}