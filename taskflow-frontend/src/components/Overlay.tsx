interface OverlayProps {
  isVisible: boolean;
  onClick: () => void;
  zIndex?: number;
}

export default function Overlay({ isVisible, onClick, zIndex = 30 }: OverlayProps) {
  if (!isVisible) return null;

  return (
    <div
      role="presentation"
      aria-hidden="true"
      onClick={onClick}
      className={`
        fixed inset-0 bg-black/50 
        transition-opacity duration-300
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      style={{ zIndex }}
    />
  );
}
