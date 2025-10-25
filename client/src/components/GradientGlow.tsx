interface GradientGlowProps {
  color: 'blue' | 'green' | 'orange';
  position?: 'top' | 'center' | 'bottom';
  size?: 'sm' | 'md' | 'lg';
}

export default function GradientGlow({ color, position = 'top', size = 'md' }: GradientGlowProps) {
  const getGradient = () => {
    switch (color) {
      case 'blue':
        return 'from-[hsl(var(--gradient-blue-from))] to-[hsl(var(--gradient-blue-to))]';
      case 'green':
        return 'from-[hsl(var(--gradient-green-from))] to-[hsl(var(--gradient-green-to))]';
      case 'orange':
        return 'from-[hsl(var(--gradient-orange-from))] to-[hsl(var(--gradient-orange-to))]';
    }
  };

  const getPosition = () => {
    switch (position) {
      case 'top': return 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'bottom': return 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2';
    }
  };

  const getSize = () => {
    switch (size) {
      case 'sm': return 'w-48 h-48';
      case 'md': return 'w-72 h-72';
      case 'lg': return 'w-96 h-96';
    }
  };

  return (
    <div 
      className={`absolute ${getPosition()} ${getSize()} rounded-full bg-gradient-to-br ${getGradient()} blur-3xl opacity-20 pointer-events-none`}
      aria-hidden="true"
    />
  );
}
