interface ProgressRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  subtitle?: string;
}

export default function ProgressRing({ 
  score, 
  size = 200, 
  strokeWidth = 12,
  label,
  subtitle
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (value: number) => {
    if (value >= 80) return "hsl(var(--chart-2))";
    if (value >= 50) return "hsl(var(--chart-3))";
    return "hsl(var(--chart-1))";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getColor(score)}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-bold tabular-nums">{score}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </div>
      {subtitle && (
        <div className="text-sm text-muted-foreground">{subtitle}</div>
      )}
    </div>
  );
}
