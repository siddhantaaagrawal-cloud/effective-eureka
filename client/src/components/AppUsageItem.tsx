import { LucideIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AppUsageItemProps {
  appName: string;
  icon: LucideIcon;
  duration: string;
  percentage: number;
  category: 'distract' | 'neutral' | 'productive';
}

export default function AppUsageItem({ 
  appName, 
  icon: Icon, 
  duration, 
  percentage,
  category 
}: AppUsageItemProps) {
  const getCategoryColor = () => {
    switch (category) {
      case 'productive': return 'text-chart-2';
      case 'neutral': return 'text-chart-3';
      case 'distract': return 'text-chart-5';
    }
  };

  const getCategoryBg = () => {
    switch (category) {
      case 'productive': return 'bg-chart-2/10';
      case 'neutral': return 'bg-chart-3/10';
      case 'distract': return 'bg-chart-5/10';
    }
  };

  return (
    <div className="flex items-center gap-3 py-3" data-testid={`app-usage-${appName.toLowerCase().replace(' ', '-')}`}>
      <div className={`p-2 rounded-lg ${getCategoryBg()}`}>
        <Icon className={`w-5 h-5 ${getCategoryColor()}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-sm">{appName}</span>
          <span className="text-sm text-muted-foreground tabular-nums">{duration}</span>
        </div>
        <Progress value={percentage} className="h-1" />
      </div>
    </div>
  );
}
