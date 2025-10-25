import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";
import HomePage from "@/pages/HomePage";
import FocusPage from "@/pages/FocusPage";
import FriendsPage from "@/pages/FriendsPage";
import HealthPage from "@/pages/HealthPage";
import ProfilePage from "@/pages/ProfilePage";
import { Home, Target, Users, Heart, User } from 'lucide-react';

function Router() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', active: location === '/', onClick: () => setLocation('/') },
    { icon: Target, label: 'Focus', active: location === '/focus', onClick: () => setLocation('/focus') },
    { icon: Users, label: 'Friends', active: location === '/friends', onClick: () => setLocation('/friends') },
    { icon: Heart, label: 'Health', active: location === '/health', onClick: () => setLocation('/health') },
    { icon: User, label: 'Profile', active: location === '/profile', onClick: () => setLocation('/profile') },
  ];

  return (
    <>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/focus" component={FocusPage} />
        <Route path="/friends" component={FriendsPage} />
        <Route path="/health" component={HealthPage} />
        <Route path="/profile" component={ProfilePage} />
      </Switch>
      <BottomNav items={navItems} />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
