import FocusTimer from '@/components/FocusTimer';
import GradientGlow from '@/components/GradientGlow';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import mountainBg from '@assets/generated_images/Mountain_landscape_focus_background_7fc4ccfe.png';

export default function FocusPage() {
  const [sessionType, setSessionType] = useState<'deep' | 'light' | 'break'>('deep');
  
  const getSessionMinutes = () => {
    switch (sessionType) {
      case 'deep': return 25;
      case 'light': return 15;
      case 'break': return 5;
    }
  };

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${mountainBg})`,
          filter: 'blur(8px)',
          transform: 'scale(1.1)'
        }}
      />
      <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
      
      <GradientGlow color="blue" position="center" size="lg" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] px-6">
        {/* Session Type Selector */}
        <Card className="p-6 backdrop-blur-xl bg-card/70 border-white/30 shadow-2xl mb-8">
          <Tabs value={sessionType} onValueChange={(v) => setSessionType(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="deep" data-testid="tab-deep-focus">Deep Focus</TabsTrigger>
              <TabsTrigger value="light" data-testid="tab-light-focus">Light Focus</TabsTrigger>
              <TabsTrigger value="break" data-testid="tab-break">Break</TabsTrigger>
            </TabsList>
          </Tabs>

          <FocusTimer key={sessionType} initialMinutes={getSessionMinutes()} />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {sessionType === 'deep' && 'Maximum focus. Minimize all distractions.'}
              {sessionType === 'light' && 'Moderate focus. Some apps allowed.'}
              {sessionType === 'break' && 'Time to rest and recharge.'}
            </p>
          </div>
        </Card>

        {/* Recent Sessions */}
        <div className="w-full max-w-md">
          <h3 className="text-sm font-semibold mb-3 px-1 text-foreground/90">Recent Sessions</h3>
          <div className="space-y-2">
            {/* todo: remove mock functionality */}
            {[
              { type: 'Deep Focus', duration: '25:00', completed: true, time: '2 hours ago' },
              { type: 'Light Focus', duration: '15:00', completed: true, time: '4 hours ago' },
              { type: 'Deep Focus', duration: '18:32', completed: false, time: '6 hours ago' },
            ].map((session, i) => (
              <Card key={i} className="p-4 backdrop-blur-xl bg-card/60 border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{session.type}</div>
                    <div className="text-xs text-muted-foreground">{session.time}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm">{session.duration}</div>
                    <div className={`text-xs ${session.completed ? 'text-chart-2' : 'text-chart-5'}`}>
                      {session.completed ? 'Completed' : 'Interrupted'}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
