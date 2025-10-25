import ProgressRing from '@/components/ProgressRing';
import StatCard from '@/components/StatCard';
import HourlyChart from '@/components/HourlyChart';
import AppUsageItem from '@/components/AppUsageItem';
import FriendCard from '@/components/FriendCard';
import GradientGlow from '@/components/GradientGlow';
import { Card } from '@/components/ui/card';
import { Clock, Flame, TrendingUp, Footprints, Instagram, Chrome, Code, Music, MessageSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import avatar1 from '@assets/generated_images/Female_profile_avatar_friendly_45946ac8.png';
import avatar2 from '@assets/generated_images/Male_profile_avatar_professional_8445cdd2.png';
import avatar3 from '@assets/generated_images/Profile_avatar_with_glasses_1fb5674b.png';

export default function HomePage() {
  // todo: remove mock functionality
  const hourlyData = [0, 0, 0, 0, 0, 0, 0, 5, 12, 8, 15, 20, 18, 22, 25, 30, 28, 35, 32, 25, 18, 12, 8, 3];
  const friends = [
    { name: 'Emma Wilson', avatar: avatar1, score: 85, trend: 'up' as const },
    { name: 'James Chen', avatar: avatar2, score: 78, trend: 'down' as const },
    { name: 'Alex Morgan', avatar: avatar3, score: 92, trend: 'up' as const },
  ];

  return (
    <div className="relative min-h-screen pb-24">
      <GradientGlow color="blue" position="top" size="lg" />
      
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div className="p-6 space-y-6 max-w-2xl mx-auto">
          {/* Hero Section */}
          <div className="text-center pt-4">
            <div className="text-sm text-muted-foreground mb-2">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            <ProgressRing score={82} label="Focus Score" subtitle="Keep up the great work!" />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={Clock} value="1h 23m" label="Time Saved" trend="up" trendValue="15%" />
            <StatCard icon={Flame} value="12" label="Day Streak" />
            <StatCard icon={TrendingUp} value="#3" label="Leaderboard" trend="up" trendValue="2 spots" />
            <StatCard icon={Footprints} value="8,432" label="Steps Today" />
          </div>

          {/* Hourly Breakdown */}
          <Card className="p-6 backdrop-blur-xl bg-card/50 border-white/20">
            <h3 className="text-sm font-semibold mb-4">Screen Time Today</h3>
            <HourlyChart data={hourlyData} />
          </Card>

          {/* Top Apps */}
          <Card className="p-6 backdrop-blur-xl bg-card/50 border-white/20">
            <h3 className="text-sm font-semibold mb-3">Top Apps</h3>
            <div className="space-y-1">
              <AppUsageItem appName="Instagram" icon={Instagram} duration="2h 15m" percentage={45} category="distract" />
              <AppUsageItem appName="Chrome" icon={Chrome} duration="1h 30m" percentage={30} category="neutral" />
              <AppUsageItem appName="VS Code" icon={Code} duration="1h 10m" percentage={23} category="productive" />
              <AppUsageItem appName="Spotify" icon={Music} duration="45m" percentage={15} category="neutral" />
              <AppUsageItem appName="Messages" icon={MessageSquare} duration="32m" percentage={11} category="distract" />
            </div>
          </Card>

          {/* Friends Preview */}
          <div>
            <h3 className="text-sm font-semibold mb-3 px-1">Friends Activity</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {friends.map((friend, i) => (
                <FriendCard key={i} {...friend} focusScore={friend.score} />
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
