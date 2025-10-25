import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import GradientGlow from '@/components/GradientGlow';
import { Settings, Bell, Shield, HelpCircle, LogOut, Trophy, Target, Award } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import avatar from '@assets/generated_images/Male_profile_avatar_professional_8445cdd2.png';

export default function ProfilePage() {
  // todo: remove mock functionality
  const achievements = [
    { icon: Trophy, label: '7 Day Streak', unlocked: true },
    { icon: Target, label: 'Focus Master', unlocked: true },
    { icon: Award, label: 'Early Bird', unlocked: false },
  ];

  const menuItems = [
    { icon: Settings, label: 'Settings', action: () => console.log('Settings') },
    { icon: Bell, label: 'Notifications', action: () => console.log('Notifications') },
    { icon: Shield, label: 'Privacy', action: () => console.log('Privacy') },
    { icon: HelpCircle, label: 'Help & Support', action: () => console.log('Help') },
  ];

  return (
    <div className="relative min-h-screen pb-24">
      <GradientGlow color="orange" position="top" size="lg" />
      
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div className="p-6 space-y-6 max-w-2xl mx-auto">
          {/* Profile Header */}
          <div className="text-center pt-4">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src={avatar} alt="Profile" />
              <AvatarFallback>JC</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold mb-1">James Chen</h1>
            <p className="text-sm text-muted-foreground mb-4">Member since Jan 2025</p>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Pro Member
              </Badge>
              <Badge variant="secondary">
                Rank #3
              </Badge>
            </div>
          </div>

          {/* Stats Overview */}
          <Card className="p-6 backdrop-blur-xl bg-card/50 border-white/20">
            <h3 className="text-sm font-semibold mb-4">Your Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold tabular-nums">12</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
              <div>
                <div className="text-2xl font-bold tabular-nums">78</div>
                <div className="text-xs text-muted-foreground">Avg Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold tabular-nums">142</div>
                <div className="text-xs text-muted-foreground">Total Sessions</div>
              </div>
            </div>
          </Card>

          {/* Achievements */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Achievements</h3>
            <div className="grid grid-cols-3 gap-3">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <Card 
                    key={index} 
                    className={`p-4 backdrop-blur-xl border-white/20 ${
                      achievement.unlocked 
                        ? 'bg-card/50' 
                        : 'bg-card/20 opacity-50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className={`p-3 rounded-full ${
                        achievement.unlocked 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-muted/20 text-muted-foreground'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-medium">{achievement.label}</div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

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
            onClick={() => console.log('Logout')}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}
