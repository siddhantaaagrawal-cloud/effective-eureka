import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  trend?: 'up' | 'down';
  trendValue?: string;
}

export default function StatCard({ icon: Icon, value, label, trend, trendValue }: StatCardProps) {
  return (
    <Card className="p-4 backdrop-blur-xl bg-card/50 border-white/20">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-2xl font-bold tabular-nums">{value}</div>
          <div className="text-sm text-muted-foreground mt-1">{label}</div>
        </div>
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      {trend && trendValue && (
        <div className={`text-xs mt-2 ${trend === 'up' ? 'text-chart-2' : 'text-chart-5'}`}>
          {trend === 'up' ? '↑' : '↓'} {trendValue}
        </div>
      )}
    </Card>
  );
}
