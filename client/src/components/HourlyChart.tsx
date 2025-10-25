interface HourlyChartProps {
  data: number[];
}

export default function HourlyChart({ data }: HourlyChartProps) {
  const maxValue = Math.max(...data, 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-1 h-32">
        {data.map((value, index) => {
          const height = (value / maxValue) * 100;
          const isCurrentHour = new Date().getHours() === index;
          
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div className="w-full flex items-end justify-center" style={{ height: '100%' }}>
                <div
                  className={`w-full rounded-t-sm transition-all duration-300 ${
                    isCurrentHour ? 'bg-primary' : 'bg-chart-1'
                  }`}
                  style={{ height: `${height}%`, minHeight: value > 0 ? '4px' : '0' }}
                />
              </div>
              {index % 4 === 0 && (
                <div className="text-[10px] text-muted-foreground tabular-nums">
                  {index}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
