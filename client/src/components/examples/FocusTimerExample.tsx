import FocusTimer from '../FocusTimer';

export default function FocusTimerExample() {
  return (
    <div className="flex items-center justify-center p-12 bg-background">
      <FocusTimer initialMinutes={25} />
    </div>
  );
}
