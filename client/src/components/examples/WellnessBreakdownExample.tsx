import WellnessBreakdown from '../WellnessBreakdown';

export default function WellnessBreakdownExample() {
  const scores = [
    { label: 'Screen Balance', value: 78, color: 'hsl(var(--chart-1))' },
    { label: 'Activity Level', value: 85, color: 'hsl(var(--chart-2))' },
    { label: 'Sleep Quality', value: 72, color: 'hsl(var(--chart-4))' },
    { label: 'Movement', value: 90, color: 'hsl(var(--chart-3))' },
  ];

  return (
    <div className="p-6 bg-background max-w-md">
      <h3 className="text-lg font-semibold mb-4">Wellness Breakdown</h3>
      <WellnessBreakdown scores={scores} />
    </div>
  );
}
