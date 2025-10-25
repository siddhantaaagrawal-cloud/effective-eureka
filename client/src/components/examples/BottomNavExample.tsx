import BottomNav from '../BottomNav';
import { Home, Target, Users, Heart, User } from 'lucide-react';
import { useState } from 'react';

export default function BottomNavExample() {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = [
    { icon: Home, label: 'Home', active: activeIndex === 0, onClick: () => setActiveIndex(0) },
    { icon: Target, label: 'Focus', active: activeIndex === 1, onClick: () => setActiveIndex(1) },
    { icon: Users, label: 'Friends', active: activeIndex === 2, onClick: () => setActiveIndex(2) },
    { icon: Heart, label: 'Health', active: activeIndex === 3, onClick: () => setActiveIndex(3) },
    { icon: User, label: 'Profile', active: activeIndex === 4, onClick: () => setActiveIndex(4) },
  ];

  return (
    <div className="relative h-96 bg-background">
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-muted-foreground">Click navigation items below</p>
      </div>
      <BottomNav items={items} />
    </div>
  );
}
