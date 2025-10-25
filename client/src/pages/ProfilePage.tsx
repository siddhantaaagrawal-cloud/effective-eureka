import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GradientGlow from '@/components/GradientGlow';
import { Settings, Bell, Shield, HelpCircle, LogOut, Copy, Check, Users, Gift } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { useState, useMemo } from 'react';
import { 
  calculateUnlockedAchievements, 
  getAchievementsByCategory, 
  getAchievementProgress,
  type UserStats 
} from '@/lib/achievements';

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Fetch current user data
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/auth/me'],
  });

  // Fetch user stats from today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { data: dailyStats } = useQuery({
    queryKey: ['/api/stats/daily'],
    enabled: !!user,
  });

  const { data: userStreak } = useQuery({
    queryKey: ['/api/stats/streak'],
    enabled: !!user,
  });

  const { data: focusSessions } = useQuery({
    queryKey: ['/api/focus-sessions'],
    enabled: !!user,
  });

  // Fetch referral data
  const { data: referralStats } = useQuery({
    queryKey: ['/api/referrals/stats'],
    enabled: !!user,
  });

  const { data: referredUsers } = useQuery<Array<{ id: number; username: string; name: string | null; avatar: string | null }>>({
    queryKey: ['/api/referrals/referred-users'],
    enabled: !!user,
  });

  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout', {});
      queryClient.clear();
      setLocation('/onboarding');
      toast({
        title: 'Logged out successfully',
      });
    } catch (error) {
      toast({
        title: 'Logout failed',
        variant: 'destructive',
      });
    }
  };

  const menuItems = [
    { icon: Settings, label: 'Settings', action: () => console.log('Settings') },
    { icon: Bell, label: 'Notifications', action: () => console.log('Notifications') },
    { icon: Shield, label: 'Privacy', action: () => console.log('Privacy') },
    { icon: HelpCircle, label: 'Help & Support', action: () => console.log('Help') },
  ];

  // Calculate user stats for achievements
  const userStats = useMemo<UserStats>(() => ({
    streak: userStreak || 0,
    totalReferrals: referralStats?.totalReferred || 0,
    activeReferrals: referralStats?.activeReferred || 0,
    totalFocusSessions: focusSessions?.length || 0,
    currentFocusScore: dailyStats?.focusScore || 0,
    avgFocusScore: dailyStats?.focusScore || 0,
    screenTimeMinutes: dailyStats?.screenTimeMinutes || 0,
    screenTimeGoal: user?.dailyScreenTimeGoal || 0,
    daysUnderGoal: 0, // TODO: Needs backend support to track consecutive days under goal
    longestStreak: 0, // TODO: Needs backend support to track historical longest streak
  }), [userStreak, referralStats, focusSessions, dailyStats, user]);

  const unlockedAchievements = useMemo(() => 
    calculateUnlockedAchievements(userStats), 
    [userStats]
  );

  const achievementProgress = useMemo(() => 
    getAchievementProgress(userStats), 
    [userStats]
  );

  const achievementCategories = [
    { id: 'streak' as const, label: 'Streaks' },
    { id: 'referrals' as const, label: 'Referrals' },
    { id: 'focus' as const, label: 'Focus' },
    { id: 'score' as const, label: 'Score' },
    { id: 'screentime' as const, label: 'Screen Time' },
  ];

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleCopyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      toast({
        title: 'Referral code copied!',
        description: 'Share it with your friends',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative min-h-screen pb-24">
      <GradientGlow color="orange" position="top" size="lg" />
      
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div className="p-6 space-y-6 max-w-2xl mx-auto">
          {/* Profile Header */}
          {isLoading ? (
            <div className="text-center pt-4">
              <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
              <Skeleton className="h-8 w-48 mx-auto mb-2" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>
          ) : (
            <div className="text-center pt-4">
              <Avatar className="w-24 h-24 mx-auto mb-4 bg-muted">
                {user?.avatar && <AvatarImage src={user.avatar} alt={user.name || user.username} />}
                <AvatarFallback className="bg-muted text-foreground text-2xl">
                  {getInitials(user?.name || user?.username || 'User')}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-bold mb-1" data-testid="text-user-name">
                {user?.name || user?.username || 'User'}
              </h1>
              <p className="text-sm text-muted-foreground mb-4">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}
              </p>
            </div>
          )}

          {/* Stats Overview */}
          <Card className="p-6 backdrop-blur-xl bg-card/50 border-white/20">
            <h3 className="text-sm font-semibold mb-4">Your Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold tabular-nums" data-testid="text-streak">
                  {userStreak || 0}
                </div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
              <div>
                <div className="text-2xl font-bold tabular-nums" data-testid="text-avg-score">
                  {dailyStats?.focusScore || 0}
                </div>
                <div className="text-xs text-muted-foreground">Focus Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold tabular-nums" data-testid="text-total-sessions">
                  {focusSessions?.length || 0}
                </div>
                <div className="text-xs text-muted-foreground">Total Sessions</div>
              </div>
            </div>
          </Card>

          {/* Referral Section */}
          <Card className="p-6 backdrop-blur-xl bg-card/50 border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <Gift className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-semibold">Invite Friends</h3>
            </div>
            
            <p className="text-xs text-muted-foreground mb-4">
              Share your referral code and help your friends improve their digital wellbeing
            </p>

            {/* Referral Code */}
            <div className="bg-muted/30 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Your Referral Code</div>
                  <div className="text-2xl font-bold tracking-wider" data-testid="text-referral-code">
                    {user?.referralCode || 'Loading...'}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyReferralCode}
                  data-testid="button-copy-referral-code"
                  disabled={!user?.referralCode}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Referral Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold tabular-nums" data-testid="text-total-referred">
                  {referralStats?.totalReferred || 0}
                </div>
                <div className="text-xs text-muted-foreground">Friends Invited</div>
              </div>
              <div className="bg-muted/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold tabular-nums" data-testid="text-active-referred">
                  {referralStats?.activeReferred || 0}
                </div>
                <div className="text-xs text-muted-foreground">Active This Week</div>
              </div>
            </div>

            {/* Referred Users List */}
            {referredUsers && referredUsers.length > 0 && (
              <div className="mt-4">
                <div className="text-xs font-semibold mb-2 text-muted-foreground">Friends You've Invited</div>
                <div className="space-y-2">
                  {referredUsers.slice(0, 3).map((referredUser) => (
                    <div 
                      key={referredUser.id} 
                      className="flex items-center gap-3 p-2 bg-muted/20 rounded-lg"
                      data-testid={`referred-user-${referredUser.id}`}
                    >
                      <Avatar className="w-8 h-8 bg-muted">
                        {referredUser.avatar && <AvatarImage src={referredUser.avatar} alt={referredUser.name || referredUser.username} />}
                        <AvatarFallback className="bg-muted text-foreground text-xs">
                          {getInitials(referredUser.name || referredUser.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {referredUser.name || referredUser.username}
                        </div>
                      </div>
                    </div>
                  ))}
                  {referredUsers.length > 3 && (
                    <div className="text-xs text-center text-muted-foreground pt-1">
                      +{referredUsers.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Achievements */}
          <Card className="p-6 backdrop-blur-xl bg-card/50 border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Achievements</h3>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {achievementProgress.unlocked}/{achievementProgress.total}
              </Badge>
            </div>
            
            <div className="mb-4">
              <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                  style={{ width: `${achievementProgress.percentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {achievementProgress.percentage}% Complete
              </p>
            </div>

            <Tabs defaultValue="streak" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-4">
                {achievementCategories.map(category => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="text-xs px-1"
                    data-testid={`tab-${category.id}`}
                  >
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {achievementCategories.map(category => {
                const categoryAchievements = getAchievementsByCategory(category.id);
                const unlockedInCategory = categoryAchievements.filter(a => 
                  unlockedAchievements.some(ua => ua.id === a.id)
                );

                return (
                  <TabsContent key={category.id} value={category.id} className="mt-0">
                    <ScrollArea className="h-[240px] pr-4">
                      <div className="space-y-2">
                        {categoryAchievements.map((achievement) => {
                          const isUnlocked = unlockedAchievements.some(ua => ua.id === achievement.id);
                          const Icon = achievement.icon;
                          
                          return (
                            <div
                              key={achievement.id}
                              className={`p-3 rounded-lg border transition-all ${
                                isUnlocked
                                  ? 'bg-primary/5 border-primary/20'
                                  : 'bg-muted/20 border-muted/40 opacity-60'
                              }`}
                              data-testid={`achievement-${achievement.id}`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-full flex-shrink-0 ${
                                  isUnlocked
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-muted/30 text-muted-foreground'
                                }`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-sm font-semibold">
                                      {achievement.label}
                                    </h4>
                                    {achievement.tier && (
                                      <Badge 
                                        variant="secondary" 
                                        className={`text-xs ${
                                          achievement.tier === 'platinum' ? 'bg-slate-500/20 text-slate-300' :
                                          achievement.tier === 'gold' ? 'bg-yellow-500/20 text-yellow-300' :
                                          achievement.tier === 'silver' ? 'bg-gray-500/20 text-gray-300' :
                                          'bg-orange-500/20 text-orange-300'
                                        }`}
                                      >
                                        {achievement.tier}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {achievement.description}
                                  </p>
                                </div>
                                {isUnlocked && (
                                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                    <div className="text-xs text-center text-muted-foreground mt-3 pt-3 border-t border-muted/20">
                      {unlockedInCategory.length} of {categoryAchievements.length} unlocked
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </Card>

          {/* Menu Items */}
          <div className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card 
                  key={index}
                  className="backdrop-blur-xl bg-card/50 border-white/20 hover-elevate cursor-pointer"
                  onClick={item.action}
                  data-testid={`menu-${item.label.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}
                >
                  <div className="p-4 flex items-center gap-3">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-sm flex-1">{item.label}</span>
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Logout Button */}
          <Button 
            variant="outline" 
            className="w-full text-destructive hover:bg-destructive/10"
            data-testid="button-logout"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}
