import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { useBreakpoint } from '../hooks/useBreakpoint';

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export default function ResponsiveModal({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  showCloseButton = true,
}: ResponsiveModalProps) {
  const { isMobile } = useBreakpoint();

  // Lock body scroll when modal is open
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

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Size classes for desktop
  const sizeClasses = {
    sm: 'sm:max-w-md',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
    xl: 'sm:max-w-3xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className={`
          relative w-full
          ${isMobile 
            ? 'h-full rounded-none' 
            : `${sizeClasses[size]} max-h-[90vh] rounded-2xl m-4`
          }
          bg-white shadow-2xl
          flex flex-col
          overflow-hidden
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Header with title and close button */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200">
            {title && (
              <h2
                id="modal-title"
                className="text-lg sm:text-xl font-bold text-slate-900 truncate pr-4"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="min-h-touch min-w-touch flex items-center justify-center p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
