import { Card } from '@/components/ui/card';

interface SubScore {
  label: string;
  value: number;
  color: string;
}

interface WellnessBreakdownProps {
  scores: SubScore[];
}

export default function WellnessBreakdown({ scores }: WellnessBreakdownProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {scores.map((score, index) => (
        <Card key={index} className="p-4 backdrop-blur-xl bg-card/50 border-white/20">
          <div className="flex flex-col items-center gap-2">
            <svg width="80" height="80" className="transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke={score.color}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(score.value / 100) * 200} 200`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute" style={{ marginTop: '18px' }}>
              <div className="text-xl font-bold tabular-nums">{score.value}</div>
            </div>
          </div>
          <div className="text-center mt-2">
            <div className="text-xs text-muted-foreground">{score.label}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}
