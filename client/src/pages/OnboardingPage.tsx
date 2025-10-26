import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import GradientGlow from '@/components/GradientGlow';
import PhoneInput, { countries } from '@/components/PhoneInput';
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
  Target,
  Copy,
  Key,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

type AuthMode = 'signup' | 'signin';

type OnboardingData = {
  phoneNumber: string;
  otp: string;
  name: string;
  friendCode: string;
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
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [otpSent, setOtpSent] = useState(false);
  
  const [data, setData] = useState<OnboardingData>({
    phoneNumber: '',
    otp: '',
    name: '',
    friendCode: '',
    currentScreenTime: 4,
    problems: [],
    dailyStepGoal: 10000,
    activeMinutesGoal: 30,
  });

  const sendOtpMutation = useMutation({
    mutationFn: async (phoneNumber: string) => {
      const response = await apiRequest('POST', '/api/auth/send-otp', { phoneNumber });
      return await response.json();
    },
    onSuccess: () => {
      setOtpSent(true);
      toast({
        title: 'OTP Sent',
        description: 'Check your phone for the verification code',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to send OTP',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (signupData: OnboardingData) => {
      const response = await apiRequest('POST', '/api/auth/signup', {
        phoneNumber: signupData.phoneNumber,
        otp: signupData.otp,
        name: signupData.name || undefined,
        friendCode: signupData.friendCode || undefined,
        dailyScreenTimeGoal: Math.max(1, signupData.currentScreenTime - 1) * 60,
        dailyStepGoal: signupData.dailyStepGoal,
        activeMinutesGoal: signupData.activeMinutesGoal,
        problems: signupData.problems.length > 0 ? signupData.problems : undefined,
      });
      return await response.json();
    },
    onSuccess: (user) => {
      setGeneratedCode(user.userCode);
      setStep(10);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Signup failed',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  const signinMutation = useMutation({
    mutationFn: async (signinData: { phoneNumber: string; otp: string }) => {
      const response = await apiRequest('POST', '/api/auth/signin', signinData);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in',
      });
      setLocation('/');
    },
    onError: (error: any) => {
      toast({
        title: 'Sign in failed',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  const totalSteps = authMode === 'signup' ? 9 : 2;
  const progress = (step / totalSteps) * 100;

  const handleSendOtp = () => {
    if (!data.phoneNumber) {
      toast({
        title: 'Invalid phone number',
        description: 'Please enter a phone number',
        variant: 'destructive',
      });
      return;
    }
    
    const country = countries.find(c => data.phoneNumber.startsWith(c.code));
    if (country) {
      const numberPart = data.phoneNumber.slice(country.code.length);
      if (numberPart.length < country.minLength || numberPart.length > country.maxLength) {
        toast({
          title: 'Invalid phone number',
          description: `${country.name} requires ${country.minLength}-${country.maxLength} digits`,
          variant: 'destructive',
        });
        return;
      }
    }
    
    sendOtpMutation.mutate(data.phoneNumber);
  };

  const handleVerifyOtp = () => {
    if (data.otp.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter the 6-digit code',
        variant: 'destructive',
      });
      return;
    }

    if (authMode === 'signin') {
      signinMutation.mutate({ phoneNumber: data.phoneNumber, otp: data.otp });
    } else {
      setStep(3);
    }
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleCompleteSignup = () => {
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

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: 'Code copied!',
      description: 'Your 14-digit code has been copied to clipboard',
    });
  };

  const goToDashboard = () => {
    setLocation('/');
  };


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
    if (step === 1) {
      return (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Welcome!</h1>
            <p className="text-muted-foreground">
              Sign up or sign in to continue
            </p>
          </div>

          <Tabs 
            value={authMode} 
            onValueChange={(value) => {
              setAuthMode(value as AuthMode);
              setOtpSent(false);
              setData(prev => ({ ...prev, otp: '' }));
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup" data-testid="tab-signup">Sign Up</TabsTrigger>
              <TabsTrigger value="signin" data-testid="tab-signin">Sign In</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            <PhoneInput
              value={data.phoneNumber}
              onChange={(value) => setData({ ...data, phoneNumber: value })}
              disabled={otpSent}
              testIdPrefix="onboarding"
            />

            <Button 
              onClick={handleSendOtp}
              disabled={sendOtpMutation.isPending || !data.phoneNumber}
              size="lg"
              className="w-full"
              data-testid="button-send-otp"
            >
              {sendOtpMutation.isPending ? 'Sending...' : 'Send OTP'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          {otpSent && (
            <Card className="p-4 bg-primary/5 border-primary/20 animate-in fade-in duration-300">
              <p className="text-sm text-center">
                <CheckCircle2 className="w-4 h-4 inline mr-2 text-primary" />
                OTP sent! Check your phone
              </p>
            </Card>
          )}

          {otpSent && (
            <Button
              onClick={() => setStep(2)}
              variant="outline"
              size="sm"
              className="w-full"
              data-testid="button-next-to-otp"
            >
              I have my code
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold">Enter Verification Code</h2>
            <p className="text-muted-foreground">
              Enter the 6-digit code sent to {data.phoneNumber}
            </p>
          </div>

          <div className="flex flex-col items-center space-y-6">
            <InputOTP
              maxLength={6}
              value={data.otp}
              onChange={(value) => setData({ ...data, otp: value })}
              data-testid="input-otp"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <Button
              onClick={() => {
                setOtpSent(false);
                setData({ ...data, otp: '' });
                setStep(1);
              }}
              variant="ghost"
              size="sm"
              data-testid="button-change-number"
            >
              Change phone number
            </Button>
          </div>

          <Button 
            onClick={handleVerifyOtp}
            disabled={data.otp.length !== 6 || (authMode === 'signin' && signinMutation.isPending)}
            size="lg"
            className="w-full"
            data-testid="button-verify-otp"
          >
            {authMode === 'signin' && signinMutation.isPending ? 'Signing In...' : 'Verify & Continue'}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      );
    }

    if (authMode === 'signup') {
      switch (step) {
        case 3:
          return (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold">What's Your Name?</h2>
                <p className="text-muted-foreground">
                  Optional - helps personalize your experience
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name (Optional)</Label>
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
                size="lg"
                className="w-full"
                data-testid="button-continue-name"
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
                <h2 className="text-2xl font-bold">Have a Friend Code?</h2>
                <p className="text-muted-foreground">
                  Enter a friend's 14-digit code to connect (optional)
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="friendCode">Friend's 14-Digit Code (Optional)</Label>
                  <Input
                    id="friendCode"
                    data-testid="input-friend-code"
                    value={data.friendCode}
                    onChange={(e) => setData({ ...data, friendCode: e.target.value.replace(/\D/g, '').slice(0, 14) })}
                    placeholder="12345678901234"
                    maxLength={14}
                    autoComplete="off"
                  />
                  {data.friendCode && data.friendCode.length !== 14 && (
                    <p className="text-xs text-muted-foreground">
                      {14 - data.friendCode.length} more digits needed
                    </p>
                  )}
                </div>
              </div>

              <Button 
                onClick={handleNext}
                size="lg"
                className="w-full"
                data-testid="button-continue-friend-code"
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

        case 6:
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
                      className={`p-4 rounded-xl border-2 transition-all relative ${
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

        case 7:
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

        case 8:
          return (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold">Permissions Setup</h2>
                <p className="text-muted-foreground">
                  For the best experience, we need access to some data
                </p>
              </div>

              <div className="space-y-4">
                <Card className="p-5 backdrop-blur-xl bg-card/50 border-white/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Screen Time Access</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Track and manage your app usage
                      </p>
                      <div className="space-y-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        <p className="font-medium">How to enable:</p>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                          <li>Go to Settings → Screen Time</li>
                          <li>Enable "Share Across Devices"</li>
                          <li>Allow this app to access data</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-5 backdrop-blur-xl bg-card/50 border-white/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Step Tracking</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Monitor your physical activity and steps
                      </p>
                      <div className="space-y-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        <p className="font-medium">How to enable:</p>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                          <li>Go to Settings → Health</li>
                          <li>Tap "Data Access & Devices"</li>
                          <li>Select this app and enable "Steps"</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Your data is encrypted and private. We never share your information with third parties.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleNext}
                size="lg"
                className="w-full"
                data-testid="button-continue-permissions"
              >
                Continue
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          );

        case 9:
          return (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold">Your Lifestyle Report</h2>
                <p className="text-muted-foreground">
                  Here's what your future looks like if you continue current habits
                </p>
              </div>

              <div className="space-y-4">
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
                onClick={handleCompleteSignup}
                disabled={signupMutation.isPending}
                size="lg"
                className="w-full"
                data-testid="button-complete-onboarding"
              >
                {signupMutation.isPending ? 'Creating Your Account...' : 'Create My Account'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          );

        case 10:
          return (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold">Welcome Aboard!</h1>
                <p className="text-muted-foreground">
                  Your account has been created
                </p>
              </div>

              <Card className="p-6 backdrop-blur-xl bg-primary/5 border-primary/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 justify-center">
                    <Key className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Your Unique 14-Digit Code</h3>
                  </div>
                  
                  <div className="bg-background/50 p-4 rounded-lg">
                    <div className="text-3xl font-mono font-bold text-center tracking-wider" data-testid="text-user-code">
                      {generatedCode}
                    </div>
                  </div>

                  <Button
                    onClick={copyCode}
                    variant="outline"
                    className="w-full"
                    data-testid="button-copy-code"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Code
                  </Button>

                  <div className="space-y-2 pt-2">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Important:</span> Save this code! You'll need it to:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Log in to your account</li>
                      <li>Connect with friends</li>
                      <li>Access your data</li>
                    </ul>
                    <p className="text-xs text-muted-foreground pt-2">
                      Your code will expire after 30 days of inactivity
                    </p>
                  </div>
                </div>
              </Card>

              <Button 
                onClick={goToDashboard}
                size="lg"
                className="w-full"
                data-testid="button-go-dashboard"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          );

        default:
          return null;
      }
    }

    return null;
  };

  const shouldShowProgress = step <= totalSteps && !(authMode === 'signup' && step === 10);

  return (
    <div className="relative min-h-screen">
      <GradientGlow color="blue" position="top" size="lg" />
      <GradientGlow color="purple" position="bottom" size="md" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {shouldShowProgress && (
          <div className="p-4">
            <div className="max-w-md mx-auto">
              <Progress value={progress} className="h-1" />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-muted-foreground">Step {step} of {totalSteps}</span>
                <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
}
