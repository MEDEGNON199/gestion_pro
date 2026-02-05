interface AvatarProps {
  prenom: string;
  nom: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Avatar({ prenom, nom, size = 'md', className = '' }: AvatarProps) {
  // Générer les initiales
  const initiales = `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();

  // Générer une couleur basée sur le nom (toujours la même pour la même personne)
  const getColorFromName = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      'bg-gradient-to-br from-violet-500 to-purple-600',
      'bg-gradient-to-br from-pink-500 to-rose-600',
      'bg-gradient-to-br from-blue-500 to-indigo-600',
      'bg-gradient-to-br from-green-500 to-emerald-600',
      'bg-gradient-to-br from-orange-500 to-amber-600',
      'bg-gradient-to-br from-red-500 to-pink-600',
      'bg-gradient-to-br from-purple-500 to-indigo-600',
      'bg-gradient-to-br from-teal-500 to-cyan-600',
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${getColorFromName(prenom + nom)}
        ${className}
        rounded-full
        flex items-center justify-center
        text-white font-bold
        shadow-lg
        ring-2 ring-white
      `}
    >
      {initiales}
    </div>
  );
}