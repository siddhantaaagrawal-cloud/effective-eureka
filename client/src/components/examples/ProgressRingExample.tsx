import ProgressRing from '../ProgressRing';

export default function ProgressRingExample() {
  return (
    <div className="flex gap-8 p-8 bg-background">
      <ProgressRing score={82} label="Focus Score" subtitle="Great job!" />
      <ProgressRing score={65} label="Wellness" size={160} strokeWidth={10} />
      <ProgressRing score={45} label="Activity" size={120} strokeWidth={8} />
    </div>
  );
}
