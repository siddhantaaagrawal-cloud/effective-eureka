import HourlyChart from '../HourlyChart';

export default function HourlyChartExample() {
  const mockData = [
    0, 0, 0, 0, 0, 0, 0, 5, 12, 8, 15, 20, 18, 22, 25, 30, 28, 35, 32, 25, 18, 12, 8, 3
  ];

  return (
    <div className="p-6 bg-background max-w-2xl">
      <h3 className="text-sm font-semibold mb-4">Screen Time by Hour</h3>
      <HourlyChart data={mockData} />
    </div>
  );
}
