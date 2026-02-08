import { ReactNode } from 'react';
import { useMobileMenu } from '../hooks/useMobileMenu';
import { useBreakpoint } from '../hooks/useBreakpoint';
import Sidebar from '../components/Sidebar';
import MobileHeader from '../components/MobileHeader';
import Overlay from '../components/Overlay';

interface ResponsiveLayoutProps {
  children: ReactNode;
}

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const { isOpen, toggle, close } = useMobileMenu();
  const { isMobile } = useBreakpoint();

  return (
    <div className="relative min-h-screen flex">
      {/* Mobile Header - visible only on mobile/tablet */}
      {isMobile && (
        <MobileHeader onMenuToggle={toggle} isMenuOpen={isOpen} />
      )}

      {/* Overlay - visible only when menu is open on mobile */}
      {isMobile && (
        <Overlay isVisible={isOpen} onClick={close} zIndex={30} />
      )}

      {/* Sidebar - responsive behavior */}
      <Sidebar isOpen={isOpen || !isMobile} onClose={close} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 pt-14 sm:pt-16 lg:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
