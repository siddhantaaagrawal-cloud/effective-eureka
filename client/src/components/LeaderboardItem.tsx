import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal } from 'lucide-react';

interface LeaderboardItemProps {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  isCurrentUser?: boolean;
  trend?: 'up' | 'down';
  trendValue?: number;
}

export default function LeaderboardItem({ 
  rank, 
  name, 
  avatar, 
  score, 
  isCurrentUser,
  trend,
  trendValue
}: LeaderboardItemProps) {
  const initials = name.split(' ').map(n => n[0]).join('');
  const isTopThree = rank <= 3;

  return (
    <div 
      className={`p-4 rounded-xl flex items-center gap-4 ${
        isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'bg-card/30'
      } ${isTopThree ? 'p-5' : ''}`}
      data-testid={`leaderboard-item-${rank}`}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className={`font-bold tabular-nums ${isTopThree ? 'text-2xl' : 'text-lg'} min-w-8`}>
          {rank === 1 && <Trophy className="w-6 h-6 text-chart-3 inline" />}
          {rank === 2 && <Medal className="w-5 h-5 text-muted-foreground inline" />}
          {rank === 3 && <Medal className="w-5 h-5 text-chart-3/70 inline" />}
          {rank > 3 && `#${rank}`}
        </div>
        <Avatar className={isTopThree ? 'w-14 h-14' : 'w-10 h-10'}>
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className={`font-semibold ${isTopThree ? 'text-base' : 'text-sm'}`}>
            {name} {isCurrentUser && <span className="text-xs text-primary">(You)</span>}
          </div>
          {trend && trendValue && (
            <div className={`text-xs ${trend === 'up' ? 'text-chart-2' : 'text-chart-5'}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue} from last week
            </div>
          )}
        </div>
      </div>
      <div className={`font-bold tabular-nums ${isTopThree ? 'text-2xl' : 'text-lg'}`}>
        {score}
      </div>
    </div>
  );
}
