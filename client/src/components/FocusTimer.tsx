import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square } from 'lucide-react';

interface FocusTimerProps {
  initialMinutes?: number;
}

export default function FocusTimer({ initialMinutes = 25 }: FocusTimerProps) {
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setSeconds(initialMinutes * 60);
    setIsRunning(false);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-8xl font-bold tabular-nums tracking-tight">
        {formatTime(seconds)}
      </div>
      <div className="flex gap-3">
        <Button
          size="lg"
          variant={isRunning ? "secondary" : "default"}
          onClick={() => setIsRunning(!isRunning)}
          data-testid="button-timer-toggle"
          className="min-w-24"
        >
          {isRunning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={handleReset}
          data-testid="button-timer-reset"
        >
          <Square className="w-5 h-5 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
}
