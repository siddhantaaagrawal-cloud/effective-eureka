import StatCard from '../StatCard';
import { Clock, Flame, TrendingUp, Footprints } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-2 gap-4 p-6 bg-background max-w-md">
      <StatCard icon={Clock} value="1h 23m" label="Time Saved" trend="up" trendValue="15%" />
      <StatCard icon={Flame} value="12" label="Day Streak" />
      <StatCard icon={TrendingUp} value="#3" label="Leaderboard" trend="up" trendValue="2 spots" />
      <StatCard icon={Footprints} value="8,432" label="Steps Today" />
    </div>
  );
}
