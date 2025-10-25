import AppUsageItem from '../AppUsageItem';
import { Instagram, Chrome, Code, Music, MessageSquare } from 'lucide-react';

export default function AppUsageItemExample() {
  return (
    <div className="p-6 bg-background max-w-md space-y-1">
      <AppUsageItem appName="Instagram" icon={Instagram} duration="2h 15m" percentage={45} category="distract" />
      <AppUsageItem appName="Chrome" icon={Chrome} duration="1h 30m" percentage={30} category="neutral" />
      <AppUsageItem appName="VS Code" icon={Code} duration="1h 10m" percentage={23} category="productive" />
      <AppUsageItem appName="Spotify" icon={Music} duration="45m" percentage={15} category="neutral" />
      <AppUsageItem appName="Messages" icon={MessageSquare} duration="32m" percentage={11} category="distract" />
    </div>
  );
}
