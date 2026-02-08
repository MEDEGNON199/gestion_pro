import { useState, useCallback, useEffect } from 'react';

export interface MobileMenuState {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export function useMobileMenu(): MobileMenuState {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, close]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return { isOpen, toggle, open, close };
}
