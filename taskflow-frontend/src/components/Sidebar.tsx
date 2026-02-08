import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Settings, LogOut, Layers, Mail, Star, Zap, Crown, ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Avatar from './Avatar';
import { useRef } from 'react';
import { useTouchGestures } from '../hooks/useTouchGestures';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef<HTMLElement>(null);

  // Add swipe-to-close gesture
  useTouchGestures(sidebarRef, {
    onSwipeLeft: onClose,
  });

  if (!user) return null;

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: LayoutDashboard,
    },
    { 
      name: 'Projects', 
      path: '/projets', 
      icon: FolderKanban,
    },
    { 
      name: 'Invitations', 
      path: '/mes-invitations', 
      icon: Mail,
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: Settings,
    },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose(); // Close menu on navigation (mobile)
  };

  return (
    <aside 
      ref={sidebarRef}
      id="mobile-sidebar"
      role="navigation"
      aria-label="Main navigation"
      className={`
        fixed top-0 left-0 h-screen z-sidebar
        w-[80%] max-w-[280px]
        lg:w-72 lg:sticky
        bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
        overflow-hidden
        relative
      `}
    >
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-500/10 to-blue-500/10 rounded-full translate-y-12 -translate-x-12"></div>
      
      {/* Logo Section */}
      <div className="p-6 border-b border-white/20 relative">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Crown className="w-2 h-2 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <div className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold rounded-full">
                PRO
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium">Project Management Suite</p>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center gap-2 mt-4 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold text-green-700">All Systems Online</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="mb-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-3">
            Navigation
          </p>
        </div>
        
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <div
              key={item.path}
              className="relative group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-semibold text-sm relative overflow-hidden group min-h-touch ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:shadow-md hover:scale-[1.02]'
                }`}
              >
                {/* Background decoration for active item */}
                {isActive && (
                  <div className="absolute inset-0 bg-white/20 rounded-2xl"></div>
                )}
                
                <div className="relative flex items-center gap-4 flex-1">
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20' : 'bg-white shadow-sm'} transition-all duration-300`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                  </div>
                  <span className="flex-1 text-left">{item.name}</span>
                  
                  {/* Arrow for active item */}
                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-white/80" />
                  )}
                </div>
              </button>
              
              {/* Hover glow effect */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl ${
                isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-slate-50'
              }`}></div>
            </div>
          );
        })}
        
        {/* Quick Actions */}
        <div className="mt-8 pt-4 border-t border-white/20">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-3">
            Quick Actions
          </p>
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-600 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 hover:text-orange-600 transition-all duration-300 font-medium text-sm group">
            <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all">
              <Zap className="w-5 h-5 text-orange-500" />
            </div>
            <span>Create Project</span>
            <div className="ml-auto">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-orange-600">+</span>
              </div>
            </div>
          </button>
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/20 relative">
        <div className="mb-4">
          <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50 hover:from-slate-100 hover:to-blue-100 transition-all duration-300 cursor-pointer group border border-white/50 hover:border-blue-200 hover:shadow-lg">
            <div className="relative">
              <Avatar prenom={user.prenom} nom={user.nom} size="md" />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {user.prenom} {user.nom}
                </p>
                <Sparkles className="w-3 h-3 text-yellow-500" />
              </div>
              <p className="text-xs text-slate-500 truncate font-medium">{user.email}</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600 font-semibold">Online</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
        </div>
        
        <button
          onClick={() => {
            logout();
            navigate('/auth');
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300 group hover:shadow-md border border-transparent hover:border-red-200"
        >
          <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md group-hover:bg-red-50 transition-all">
            <LogOut className="w-4 h-4 group-hover:text-red-600" />
          </div>
          <span>Sign Out</span>
          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
        
        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-xs text-slate-400 text-center font-medium">
            TaskFlow v2.0 • Premium
          </p>
        </div>
      </div>
    </aside>
  );
}