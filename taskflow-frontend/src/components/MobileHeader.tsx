import { Layers, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Avatar from './Avatar';
import MobileMenuButton from './MobileMenuButton';

interface MobileHeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
  title?: string;
}

export default function MobileHeader({ onMenuToggle, isMenuOpen, title }: MobileHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-header bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg lg:hidden">
      <div className="flex items-center justify-between h-14 sm:h-16 px-4">
        {/* Hamburger Menu Button */}
        <MobileMenuButton isOpen={isMenuOpen} onClick={onMenuToggle} />

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Crown className="w-1.5 h-1.5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              TaskFlow
            </h1>
          </div>
        </div>

        {/* User Avatar */}
        {user && (
          <div className="flex items-center">
            <Avatar prenom={user.prenom} nom={user.nom} size="sm" />
          </div>
        )}
      </div>
    </header>
  );
}
