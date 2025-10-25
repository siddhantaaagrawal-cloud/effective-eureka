import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import GradientGlow from '@/components/GradientGlow';
import { 
  Smartphone, 
  Brain, 
  Activity, 
  TrendingDown, 
  TrendingUp,
  Heart,
  Moon,
  Eye,
  Zap,
  CheckCircle2,
  ArrowRight,
  Target
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

type OnboardingData = {
  name: string;
  username: string;
  password: string;
  currentScreenTime: number;
  problems: string[];
  dailyStepGoal: number;
  activeMinutesGoal: number;
};

const problemOptions = [
  { id: 'distraction', label: 'Too Distracted', icon: Brain },
  { id: 'sleep', label: 'Poor Sleep', icon: Moon },
  { id: 'anxiety', label: 'Anxiety', icon: Heart },
  { id: 'eyestrain', label: 'Eye Strain', icon: Eye },
  { id: 'productivity', label: 'Low Productivity', icon: Zap },
  { id: 'addiction', label: 'Phone Addiction', icon: Smartphone },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [data, setData] = useState<OnboardingData>({
    name: '',
    username: '',
    password: '',
    currentScreenTime: 4,
    problems: [],
    dailyStepGoal: 10000,
    activeMinutesGoal: 30,
  });

  const signupMutation = useMutation({
    mutationFn: async (signupData: OnboardingData) => {
      const response = await apiRequest('POST', '/api/auth/signup', {
        name: signupData.name,
        username: signupData.username,
        password: signupData.password,
        dailyScreenTimeGoal: Math.max(1, signupData.currentScreenTime - 1) * 60,
        problems: signupData.problems,
        dailyStepGoal: signupData.dailyStepGoal,
        activeMinutesGoal: signupData.activeMinutesGoal,
        onboardingCompleted: true,
      });
      return response.json();
    },
    onSuccess: () => {
      setLocation('/');
    },
    onError: (error: any) => {
      toast({
        title: 'Signup failed',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  const totalSteps = 7;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleComplete = () => {
    signupMutation.mutate(data);
  };

  const toggleProblem = (problemId: string) => {
    setData(prev => ({
      ...prev,
      problems: prev.problems.includes(problemId)
        ? prev.problems.filter(p => p !== problemId)
        : [...prev.problems, problemId]
    }));
  };

  // Calculate lifestyle predictions
  const predictions = {
    screenTime: {
      yearly: data.currentScreenTime * 365,
      monthlyIncrease: Math.round((data.currentScreenTime * 365) / 12),
    },
    health: {
      sleepLoss: Math.max(0, (data.currentScreenTime - 3) * 30),
      eyeStrainRisk: data.currentScreenTime > 6 ? 'High' : data.currentScreenTime > 4 ? 'Medium' : 'Low',
    },
    fitness: {
      caloriesBurned: Math.round(data.dailyStepGoal * 0.04 * 365),
      milesWalked: Math.round((data.dailyStepGoal / 2000) * 365),
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold">Welcome to Your Journey</h1>
              <p className="text-muted-foreground">
                Let's understand your digital wellbeing and set you up for success
              </p>
            </div>
            
            <div className="pt-8">
              <Button 
                onClick={handleNext}
                size="lg"
                className="w-full"
                data-testid="button-get-started"
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold">What's Your Name?</h2>
              <p className="text-muted-foreground">
                Let's personalize your experience
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  data-testid="input-name"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="Enter your name"
                  autoComplete="name"
                />
              </div>
            </div>

            <Button 
              onClick={handleNext}
              disabled={!data.name.trim()}
              size="lg"
              className="w-full"
              data-testid="button-continue-name"
            >
              Continue
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold">Create Your Account</h2>
              <p className="text-muted-foreground">
                Choose a username and secure password
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  data-testid="input-username"
                  value={data.username}
                  onChange={(e) => setData({ ...data, username: e.target.value })}
                  placeholder="Enter your username"
                  autoComplete="off"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  data-testid="input-password"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <Button 
              onClick={handleNext}
              disabled={!data.username || data.password.length < 6}
              size="lg"
              className="w-full"
              data-testid="button-continue-account"
            >
              Continue
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold">Daily Screen Time</h2>
              <p className="text-muted-foreground">
                About how many hours do you spend on your phone daily?
              </p>
            </div>

            <Card className="p-8 backdrop-blur-xl bg-card/50 border-white/20">
              <div className="text-center space-y-6">
                <div className="text-7xl font-bold tabular-nums bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  {data.currentScreenTime}h
                </div>
                
                <input
                  type="range"
                  min="1"
                  max="16"
                  value={data.currentScreenTime}
                  onChange={(e) => setData({ ...data, currentScreenTime: parseInt(e.target.value) })}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                  data-testid="slider-screen-time"
                />
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1h</span>
                  <span>16h</span>
                </div>
              </div>
            </Card>

            <Button 
              onClick={handleNext}
              size="lg"
              className="w-full"
              data-testid="button-continue-screen-time"
            >
              Continue
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold">What Challenges Do You Face?</h2>
              <p className="text-muted-foreground">
                Select all that apply - we'll personalize your experience
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {problemOptions.map((problem) => {
                const Icon = problem.icon;
                const isSelected = data.problems.includes(problem.id);
                
                return (
                  <button
                    key={problem.id}
                    onClick={() => toggleProblem(problem.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                    data-testid={`button-problem-${problem.id}`}
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`text-sm font-medium ${isSelected ? 'text-primary' : ''}`}>
                        {problem.label}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-primary absolute top-2 right-2" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <Button 
              onClick={handleNext}
              disabled={data.problems.length === 0}
              size="lg"
              className="w-full"
              data-testid="button-continue-problems"
            >
              Continue
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold">Fitness Goals</h2>
              <p className="text-muted-foreground">
                Let's set your daily activity targets
              </p>
            </div>

            <div className="space-y-6">
              <Card className="p-6 backdrop-blur-xl bg-card/50 border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Daily Step Goal</Label>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="text-xl font-bold tabular-nums">{data.dailyStepGoal.toLocaleString()}</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="20000"
                    step="1000"
                    value={data.dailyStepGoal}
                    onChange={(e) => setData({ ...data, dailyStepGoal: parseInt(e.target.value) })}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                    data-testid="slider-step-goal"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1,000</span>
                    <span>20,000</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 backdrop-blur-xl bg-card/50 border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Active Minutes</Label>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      <span className="text-xl font-bold tabular-nums">{data.activeMinutesGoal} min</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="120"
                    step="5"
                    value={data.activeMinutesGoal}
                    onChange={(e) => setData({ ...data, activeMinutesGoal: parseInt(e.target.value) })}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                    data-testid="slider-active-minutes"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>10 min</span>
                    <span>120 min</span>
                  </div>
                </div>
              </Card>
            </div>

            <Button 
              onClick={handleNext}
              size="lg"
              className="w-full"
              data-testid="button-continue-fitness"
            >
              Continue
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold">Your Lifestyle Report</h2>
              <p className="text-muted-foreground">
                Here's what your future looks like if you continue current habits
              </p>
            </div>

            <div className="space-y-4">
              {/* Screen Time Impact */}
              <Card className="p-5 backdrop-blur-xl bg-destructive/5 border-destructive/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <TrendingDown className="w-5 h-5 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Screen Time Impact</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      At {data.currentScreenTime}h/day, you'll spend <span className="font-bold text-destructive">{predictions.screenTime.yearly} hours</span> this year on your phone
                    </p>
                    <Badge variant="destructive" className="text-xs">
                      That's {Math.round(predictions.screenTime.yearly / 24)} full days
                    </Badge>
                  </div>
                </div>
              </Card>

              {data.problems.includes('sleep') && (
                <Card className="p-5 backdrop-blur-xl bg-destructive/5 border-destructive/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-destructive/10 rounded-lg">
                      <Moon className="w-5 h-5 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Sleep Quality</h3>
                      <p className="text-sm text-muted-foreground">
                        High screen time is affecting your sleep. You could lose <span className="font-bold text-destructive">{predictions.health.sleepLoss} hours</span> of quality sleep per month
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Positive Fitness Impact */}
              <Card className="p-5 backdrop-blur-xl bg-chart-2/5 border-chart-2/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-chart-2/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-chart-2" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Fitness Potential</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      With your {data.dailyStepGoal.toLocaleString()} step goal, you'll walk <span className="font-bold text-chart-2">{predictions.fitness.milesWalked} miles</span> and burn <span className="font-bold text-chart-2">{predictions.fitness.caloriesBurned.toLocaleString()} calories</span> this year!
                    </p>
                    <Badge className="text-xs bg-chart-2/20 text-chart-2 border-chart-2/30">
                      Amazing Progress
                    </Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-5 backdrop-blur-xl bg-primary/5 border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Our Recommendation</h3>
                    <p className="text-sm text-muted-foreground">
                      Reduce screen time to <span className="font-bold text-primary">{Math.max(1, data.currentScreenTime - 1)}h/day</span> to improve focus, sleep, and wellbeing. We'll help you get there!
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <Button 
              onClick={handleComplete}
              disabled={signupMutation.isPending}
              size="lg"
              className="w-full"
              data-testid="button-complete-onboarding"
            >
              {signupMutation.isPending ? 'Creating Your Account...' : 'Start My Journey'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen">
      <GradientGlow color="blue" position="top" size="lg" />
      <GradientGlow color="purple" position="bottom" size="md" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Progress Bar */}
        <div className="p-4">
          <div className="max-w-md mx-auto">
            <Progress value={progress} className="h-1" />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-muted-foreground">Step {step} of {totalSteps}</span>
              <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
}
