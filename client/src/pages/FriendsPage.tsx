import LeaderboardItem from '@/components/LeaderboardItem';
import GradientGlow from '@/components/GradientGlow';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import avatar1 from '@assets/generated_images/Female_profile_avatar_friendly_45946ac8.png';
import avatar2 from '@assets/generated_images/Male_profile_avatar_professional_8445cdd2.png';
import avatar3 from '@assets/generated_images/Profile_avatar_with_glasses_1fb5674b.png';

export default function FriendsPage() {
  // todo: remove mock functionality
  const leaderboard = [
    { name: 'Alex Morgan', avatar: avatar3, score: 92, trend: 'up' as const, trendValue: 5 },
    { name: 'Emma Wilson', avatar: avatar1, score: 85, trend: 'up' as const, trendValue: 3 },
    { name: 'You', avatar: avatar2, score: 78, trend: 'down' as const, trendValue: 2, isCurrentUser: true },
    { name: 'Sarah Lee', avatar: avatar1, score: 72, trend: 'up' as const, trendValue: 1 },
    { name: 'Mike Johnson', avatar: avatar2, score: 68, trend: 'down' as const, trendValue: 4 },
    { name: 'Lisa Park', avatar: avatar3, score: 65, trend: 'up' as const, trendValue: 2 },
    { name: 'Tom Brown', avatar: avatar1, score: 61, trend: 'down' as const, trendValue: 3 },
  ];

  const friends = [
    { name: 'Emma Wilson', avatar: avatar1, score: 85, streak: 14, status: 'In focus mode' },
    { name: 'James Chen', avatar: avatar2, score: 78, streak: 8, status: 'Active 2h ago' },
    { name: 'Alex Morgan', avatar: avatar3, score: 92, streak: 21, status: 'In focus mode' },
  ];

  return (
    <div className="relative min-h-screen pb-24">
      <GradientGlow color="green" position="top" size="lg" />
      
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Friends & Community</h1>
          <p className="text-sm text-muted-foreground">
            Compare progress and stay motivated together
          </p>
        </div>

        <Tabs defaultValue="leaderboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="leaderboard" data-testid="tab-leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="friends" data-testid="tab-friends">Friends</TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="space-y-2 pr-4">
                {leaderboard.map((user, index) => (
                  <LeaderboardItem
                    key={index}
                    rank={index + 1}
                    name={user.name}
                    avatar={user.avatar}
                    score={user.score}
                    isCurrentUser={user.isCurrentUser}
                    trend={user.trend}
                    trendValue={user.trendValue}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="friends">
            <div className="mb-4">
              <Button variant="outline" className="w-full" data-testid="button-add-friend">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Friends
              </Button>
            </div>
            
            <ScrollArea className="h-[calc(100vh-18rem)]">
              <div className="space-y-3 pr-4">
                {friends.map((friend, index) => (
                  <Card key={index} className="p-4 backdrop-blur-xl bg-card/50 border-white/20">
                    <div className="flex items-center gap-4">
                      <img 
                        src={friend.avatar} 
                        alt={friend.name}
                        className="w-14 h-14 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">{friend.name}</div>
                        <div className="text-xs text-muted-foreground">{friend.status}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold tabular-nums">{friend.score}</div>
                        <div className="text-xs text-muted-foreground">{friend.streak} day streak</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
