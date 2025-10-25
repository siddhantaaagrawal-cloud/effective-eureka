import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

interface FriendCardProps {
  name: string;
  avatar: string;
  focusScore: number;
  trend?: 'up' | 'down';
}

export default function FriendCard({ name, avatar, focusScore, trend }: FriendCardProps) {
  const initials = name.split(' ').map(n => n[0]).join('');

  return (
    <Card className="p-4 flex items-center gap-3 backdrop-blur-xl bg-card/50 border-white/20 hover-elevate min-w-[200px]">
      <Avatar className="w-12 h-12">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="font-semibold text-sm">{name}</div>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <span className="tabular-nums">{focusScore}</span>
          {trend && (
            <span className={trend === 'up' ? 'text-chart-2' : 'text-chart-5'}>
              {trend === 'up' ? '↑' : '↓'}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
