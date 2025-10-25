import { 
  Flame, 
  Target, 
  Trophy, 
  Award, 
  Star, 
  Zap, 
  TrendingDown, 
  Clock, 
  Users, 
  Gift, 
  Crown, 
  Sparkles, 
  Heart, 
  Shield, 
  Rocket,
  type LucideIcon
} from 'lucide-react';

export type AchievementCategory = 'streak' | 'referrals' | 'focus' | 'score' | 'screentime';

export interface Achievement {
  id: string;
  category: AchievementCategory;
  icon: LucideIcon;
  label: string;
  description: string;
  requirement: (stats: UserStats) => boolean;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface UserStats {
  streak: number;
  totalReferrals: number;
  activeReferrals: number;
  totalFocusSessions: number;
  currentFocusScore: number;
  avgFocusScore: number;
  screenTimeMinutes: number;
  screenTimeGoal: number;
  daysUnderGoal: number;
  longestStreak: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Streak Achievements (7)
  {
    id: 'first-week',
    category: 'streak',
    icon: Flame,
    label: 'First Week',
    description: 'Maintain a 7-day streak',
    requirement: (stats) => stats.streak >= 7,
    tier: 'bronze',
  },
  {
    id: 'two-weeks',
    category: 'streak',
    icon: Flame,
    label: 'Two Weeks Strong',
    description: 'Maintain a 14-day streak',
    requirement: (stats) => stats.streak >= 14,
    tier: 'silver',
  },
  {
    id: 'monthly-master',
    category: 'streak',
    icon: Flame,
    label: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    requirement: (stats) => stats.streak >= 30,
    tier: 'gold',
  },
  {
    id: 'fifty-days',
    category: 'streak',
    icon: Crown,
    label: 'Fifty Days',
    description: 'Maintain a 50-day streak',
    requirement: (stats) => stats.streak >= 50,
    tier: 'platinum',
  },
  {
    id: 'century-club',
    category: 'streak',
    icon: Trophy,
    label: 'Century Club',
    description: 'Maintain a 100-day streak',
    requirement: (stats) => stats.streak >= 100,
    tier: 'platinum',
  },
  {
    id: 'comeback-kid',
    category: 'streak',
    icon: Rocket,
    label: 'Comeback Kid',
    description: 'Rebuild a 7-day streak after losing one',
    requirement: (stats) => stats.longestStreak > 0 && stats.streak >= 7 && stats.longestStreak > stats.streak,
    tier: 'bronze',
  },
  {
    id: 'unstoppable',
    category: 'streak',
    icon: Shield,
    label: 'Unstoppable',
    description: 'Your current streak matches your longest ever (14+ days)',
    requirement: (stats) => stats.longestStreak > 0 && stats.streak >= 14 && stats.streak === stats.longestStreak,
    tier: 'gold',
  },

  // Referral Achievements (6)
  {
    id: 'first-friend',
    category: 'referrals',
    icon: Gift,
    label: 'First Friend',
    description: 'Refer your first friend',
    requirement: (stats) => stats.totalReferrals >= 1,
    tier: 'bronze',
  },
  {
    id: 'social-butterfly',
    category: 'referrals',
    icon: Users,
    label: 'Social Butterfly',
    description: 'Refer 5 friends',
    requirement: (stats) => stats.totalReferrals >= 5,
    tier: 'silver',
  },
  {
    id: 'influencer',
    category: 'referrals',
    icon: Star,
    label: 'Influencer',
    description: 'Refer 10 friends',
    requirement: (stats) => stats.totalReferrals >= 10,
    tier: 'gold',
  },
  {
    id: 'community-builder',
    category: 'referrals',
    icon: Crown,
    label: 'Community Builder',
    description: 'Refer 25 friends',
    requirement: (stats) => stats.totalReferrals >= 25,
    tier: 'platinum',
  },
  {
    id: 'active-network',
    category: 'referrals',
    icon: Sparkles,
    label: 'Active Network',
    description: '5+ referred friends active this week',
    requirement: (stats) => stats.activeReferrals >= 5,
    tier: 'gold',
  },
  {
    id: 'mentor',
    category: 'referrals',
    icon: Heart,
    label: 'Mentor',
    description: '3+ referred friends active this week',
    requirement: (stats) => stats.activeReferrals >= 3,
    tier: 'silver',
  },

  // Focus Session Achievements (5)
  {
    id: 'first-focus',
    category: 'focus',
    icon: Target,
    label: 'First Focus',
    description: 'Complete your first focus session',
    requirement: (stats) => stats.totalFocusSessions >= 1,
    tier: 'bronze',
  },
  {
    id: 'focus-enthusiast',
    category: 'focus',
    icon: Target,
    label: 'Focus Enthusiast',
    description: 'Complete 10 focus sessions',
    requirement: (stats) => stats.totalFocusSessions >= 10,
    tier: 'bronze',
  },
  {
    id: 'focus-master',
    category: 'focus',
    icon: Target,
    label: 'Focus Master',
    description: 'Complete 50 focus sessions',
    requirement: (stats) => stats.totalFocusSessions >= 50,
    tier: 'silver',
  },
  {
    id: 'focus-legend',
    category: 'focus',
    icon: Crown,
    label: 'Focus Legend',
    description: 'Complete 100 focus sessions',
    requirement: (stats) => stats.totalFocusSessions >= 100,
    tier: 'gold',
  },
  {
    id: 'focus-deity',
    category: 'focus',
    icon: Trophy,
    label: 'Focus Deity',
    description: 'Complete 500 focus sessions',
    requirement: (stats) => stats.totalFocusSessions >= 500,
    tier: 'platinum',
  },

  // Focus Score Achievements (5)
  {
    id: 'good-start',
    category: 'score',
    icon: Zap,
    label: 'Good Start',
    description: 'Reach a focus score of 50',
    requirement: (stats) => stats.currentFocusScore >= 50,
    tier: 'bronze',
  },
  {
    id: 'highly-focused',
    category: 'score',
    icon: Zap,
    label: 'Highly Focused',
    description: 'Reach a focus score of 70',
    requirement: (stats) => stats.currentFocusScore >= 70,
    tier: 'silver',
  },
  {
    id: 'excellence',
    category: 'score',
    icon: Star,
    label: 'Excellence',
    description: 'Reach a focus score of 90',
    requirement: (stats) => stats.currentFocusScore >= 90,
    tier: 'gold',
  },
  {
    id: 'perfection',
    category: 'score',
    icon: Crown,
    label: 'Near Perfection',
    description: 'Reach a focus score of 95',
    requirement: (stats) => stats.currentFocusScore >= 95,
    tier: 'platinum',
  },
  {
    id: 'consistent-performer',
    category: 'score',
    icon: Award,
    label: 'Consistent Performer',
    description: 'Maintain average score of 80+',
    requirement: (stats) => stats.avgFocusScore >= 80,
    tier: 'gold',
  },

  // Screen Time Achievements (4)
  {
    id: 'under-goal',
    category: 'screentime',
    icon: TrendingDown,
    label: 'Under Goal',
    description: 'Stay under screen time goal today',
    requirement: (stats) => stats.screenTimeGoal > 0 && stats.screenTimeMinutes < stats.screenTimeGoal,
    tier: 'bronze',
  },
  {
    id: 'week-under-goal',
    category: 'screentime',
    icon: TrendingDown,
    label: 'Week Under Goal',
    description: '7 consecutive days under goal',
    requirement: (stats) => stats.daysUnderGoal >= 7,
    tier: 'silver',
  },
  {
    id: 'month-under-goal',
    category: 'screentime',
    icon: Shield,
    label: 'Month Under Goal',
    description: '30 consecutive days under goal',
    requirement: (stats) => stats.daysUnderGoal >= 30,
    tier: 'gold',
  },
  {
    id: 'digital-minimalist',
    category: 'screentime',
    icon: Clock,
    label: 'Digital Minimalist',
    description: 'Screen time 50% below goal',
    requirement: (stats) => stats.screenTimeGoal > 0 && stats.screenTimeMinutes <= stats.screenTimeGoal * 0.5,
    tier: 'platinum',
  },
];

export function calculateUnlockedAchievements(stats: UserStats): Achievement[] {
  return ACHIEVEMENTS.filter(achievement => achievement.requirement(stats));
}

export function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
  return ACHIEVEMENTS.filter(achievement => achievement.category === category);
}

export function getAchievementProgress(stats: UserStats): {
  total: number;
  unlocked: number;
  percentage: number;
} {
  const unlocked = calculateUnlockedAchievements(stats);
  return {
    total: ACHIEVEMENTS.length,
    unlocked: unlocked.length,
    percentage: Math.round((unlocked.length / ACHIEVEMENTS.length) * 100),
  };
}
