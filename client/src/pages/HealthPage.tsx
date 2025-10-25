import ProgressRing from '@/components/ProgressRing';
import WellnessBreakdown from '@/components/WellnessBreakdown';
import GradientGlow from '@/components/GradientGlow';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Link2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function HealthPage() {
  // todo: remove mock functionality
  const wellnessScores = [
    { label: 'Screen Balance', value: 78, color: 'hsl(var(--chart-1))' },
    { label: 'Activity Level', value: 85, color: 'hsl(var(--chart-2))' },
    { label: 'Sleep Quality', value: 72, color: 'hsl(var(--chart-4))' },
    { label: 'Movement', value: 90, color: 'hsl(var(--chart-3))' },
  ];

  const healthTips = [
    { title: 'Great activity level!', description: 'You exceeded your daily step goal by 23%', type: 'success' },
    { title: 'Screen time trending down', description: 'Down 18% from last week', type: 'success' },
    { title: 'Improve sleep consistency', description: 'Try going to bed at the same time each night', type: 'tip' },
  ];

  const isConnected = true; // todo: replace with actual connection status

  return (
    <div className="relative min-h-screen pb-24">
      <GradientGlow color="green" position="top" size="lg" />
      <GradientGlow color="orange" position="bottom" size="md" />
      
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div className="p-6 space-y-6 max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Health & Wellness</h1>
            <p className="text-sm text-muted-foreground">
              Holistic view of your digital and physical wellbeing
            </p>
          </div>

          {/* Overall Wellness Score */}
          <div className="text-center">
            <ProgressRing score={81} label="Wellness Score" subtitle="Based on 4 key metrics" />
          </div>

          {/* Connection Status */}
          <Card className="p-4 backdrop-blur-xl bg-card/50 border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-chart-2" />
                <div>
                  <div className="font-semibold text-sm">Health Apps Connected</div>
                  <div className="text-xs text-muted-foreground">
                    {isConnected ? 'Syncing data automatically' : 'Connect to track fitness'}
                  </div>
                </div>
              </div>
              {isConnected ? (
                <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">
                  Connected
                </Badge>
              ) : (
                <Button size="sm" variant="outline" data-testid="button-connect-health">
                  <Link2 className="w-4 h-4 mr-1" />
                  Connect
                </Button>
              )}
            </div>
          </Card>

          {/* Wellness Breakdown */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Score Breakdown</h3>
            <WellnessBreakdown scores={wellnessScores} />
          </div>

          {/* Health Insights */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Insights & Tips</h3>
            <div className="space-y-2">
              {healthTips.map((tip, index) => (
                <Card key={index} className="p-4 backdrop-blur-xl bg-card/50 border-white/20">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      tip.type === 'success' ? 'bg-chart-2' : 'bg-chart-3'
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{tip.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{tip.description}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Weekly Stats */}
          <Card className="p-6 backdrop-blur-xl bg-card/50 border-white/20">
            <h3 className="text-sm font-semibold mb-4">This Week</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold tabular-nums">54,231</div>
                <div className="text-xs text-muted-foreground">Total Steps</div>
              </div>
              <div>
                <div className="text-2xl font-bold tabular-nums">7h 45m</div>
                <div className="text-xs text-muted-foreground">Avg Sleep</div>
              </div>
              <div>
                <div className="text-2xl font-bold tabular-nums">23h 12m</div>
                <div className="text-xs text-muted-foreground">Screen Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold tabular-nums">4.2</div>
                <div className="text-xs text-muted-foreground">Active Days</div>
              </div>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
