import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";
import HomePage from "@/pages/HomePage";
import FocusPage from "@/pages/FocusPage";
import FriendsPage from "@/pages/FriendsPage";
import HealthPage from "@/pages/HealthPage";
import ProfilePage from "@/pages/ProfilePage";
import OnboardingPage from "@/pages/OnboardingPage";
import { Home, Target, Users, Heart, User } from 'lucide-react';
import { useEffect } from 'react';

function Router() {
  const [location, setLocation] = useLocation();

  // Check authentication status
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false,
  });

  // Redirect to onboarding if not authenticated
  useEffect(() => {
    if (!isLoading && !user && location !== '/onboarding') {
      setLocation('/onboarding');
    }
  }, [user, isLoading, location, setLocation]);

  const navItems = [
    { icon: Home, label: 'Home', active: location === '/', onClick: () => setLocation('/') },
    { icon: Target, label: 'Focus', active: location === '/focus', onClick: () => setLocation('/focus') },
    { icon: Users, label: 'Friends', active: location === '/friends', onClick: () => setLocation('/friends') },
    { icon: Heart, label: 'Health', active: location === '/health', onClick: () => setLocation('/health') },
    { icon: User, label: 'Profile', active: location === '/profile', onClick: () => setLocation('/profile') },
  ];

  // Show onboarding if not authenticated
  if (location === '/onboarding') {
    return <Route path="/onboarding" component={OnboardingPage} />;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
