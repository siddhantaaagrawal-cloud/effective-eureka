import { LucideIcon } from 'lucide-react';

interface NavItem {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

interface BottomNavProps {
  items: NavItem[];
}

export default function BottomNav({ items }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-20 px-2">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={item.onClick}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                item.active 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover-elevate'
              }`}
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <Icon className={`w-6 h-6 ${item.active ? 'fill-current' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
