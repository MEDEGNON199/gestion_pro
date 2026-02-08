interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  ariaLabel?: string;
}

export default function MobileMenuButton({ isOpen, onClick, ariaLabel }: MobileMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className="min-h-touch min-w-touch flex items-center justify-center active:scale-95 transition-transform"
      aria-label={ariaLabel || (isOpen ? 'Close menu' : 'Open menu')}
      aria-expanded={isOpen}
      aria-controls="mobile-sidebar"
    >
      <div className="w-6 h-5 relative flex flex-col justify-between">
        <span className={`
          w-full h-0.5 bg-slate-900 rounded-full
          transition-all duration-300 origin-center
          ${isOpen ? 'rotate-45 translate-y-2' : ''}
        `} />
        <span className={`
          w-full h-0.5 bg-slate-900 rounded-full
          transition-all duration-300
          ${isOpen ? 'opacity-0' : 'opacity-100'}
        `} />
        <span className={`
          w-full h-0.5 bg-slate-900 rounded-full
          transition-all duration-300 origin-center
          ${isOpen ? '-rotate-45 -translate-y-2' : ''}
        `} />
      </div>
    </button>
  );
}
