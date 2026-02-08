import type { ReactNode } from 'react';
import { useMobileMenu } from '../hooks/useMobileMenu';
import { useBreakpoint } from '../hooks/useBreakpoint';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileHeader from './MobileHeader';
import Overlay from './Overlay';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isOpen, toggle, close } = useMobileMenu();
  const { isMobile } = useBreakpoint();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Header - visible only on mobile/tablet (< 1024px) */}
      {isMobile && (
        <MobileHeader onMenuToggle={toggle} isMenuOpen={isOpen} />
      )}

      {/* Overlay - visible only when menu is open on mobile */}
      {isMobile && (
        <Overlay isVisible={isOpen} onClick={close} zIndex={30} />
      )}

      {/* Sidebar - responsive behavior */}
      <Sidebar isOpen={isOpen || !isMobile} onClose={close} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar - hidden on mobile, visible on desktop */}
        <div className="hidden lg:block">
          <Topbar />
        </div>

        {/* Main Content with proper spacing for mobile header */}
        <main className="flex-1 overflow-y-auto pt-14 sm:pt-16 lg:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}