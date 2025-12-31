/*
  # Initial Schema Setup for Wellness Focus Tracker

  1. New Tables
    - `users`
      - Core user information with unique 14-digit codes
      - Phone-based authentication support
      - Daily wellness goals (screen time, steps, active minutes)
      - Onboarding status and user preferences
      - Activity tracking for code expiration (30 days)
      - Referral system support
    
    - `otp_verifications`
      - Phone number OTP verification for authentication
      - Time-limited verification codes (10 minutes)
      - Tracks verification status
    
    - `focus_sessions`
      - User focus/productivity sessions
      - Different session types (deep, light, break)
      - Completion tracking with timestamps
    
    - `screen_time_entries`
      - Detailed app usage tracking
      - Hourly breakdown of screen time
      - App categorization (distract, neutral, productive)
    
    - `health_metrics`
      - Daily health data integration
      - Steps, sleep, active minutes, calories
      - Synced from health apps (Apple Health/Google Fit)
    
    - `friendships`
      - User connections and social features
      - Friend status tracking (pending, accepted, blocked)
      - Enables leaderboards and social motivation
    
    - `daily_stats`
      - Computed daily scores and metrics
      - Focus score, wellness score, streaks
      - Performance caching for leaderboards

  2. Security
    - Enable RLS on all tables
    - Authorization handled at application layer via Express sessions
    - Service role has full access for server-side operations

  3. Important Notes
    - User codes expire after 30 days of inactivity
    - OTP verifications expire after 10 minutes
    - All timestamps use UTC
    - Phone numbers are optional but recommended for auth
    - This app uses custom session-based auth, not Supabase Auth
*/

-- Users table: Core user accounts and settings
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  user_code TEXT NOT NULL UNIQUE,
  phone_number TEXT UNIQUE,
  name TEXT,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_activity TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  daily_screen_time_goal INTEGER,
  daily_step_goal INTEGER DEFAULT 10000,
  active_minutes_goal INTEGER DEFAULT 30,
  problems TEXT[],
  onboarding_completed BOOLEAN DEFAULT FALSE NOT NULL,
  
  referred_by INTEGER REFERENCES users(id)
);

-- OTP verifications table: Phone authentication
CREATE TABLE IF NOT EXISTS otp_verifications (
  id SERIAL PRIMARY KEY,
  phone_number TEXT NOT NULL,
  otp TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Focus sessions table: User productivity tracking
CREATE TABLE IF NOT EXISTS focus_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ
);

-- Screen time entries table: App usage tracking
CREATE TABLE IF NOT EXISTS screen_time_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL,
  app_icon TEXT,
  category TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  hour INTEGER NOT NULL
);

-- Health metrics table: Daily health data
CREATE TABLE IF NOT EXISTS health_metrics (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL,
  steps INTEGER DEFAULT 0,
  sleep_minutes INTEGER DEFAULT 0,
  active_minutes INTEGER DEFAULT 0,
  calories_burned INTEGER DEFAULT 0
);

-- Friendships table: User connections
CREATE TABLE IF NOT EXISTS friendships (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Daily stats table: Computed performance metrics
CREATE TABLE IF NOT EXISTS daily_stats (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL,
  focus_score INTEGER DEFAULT 0 NOT NULL,
  wellness_score INTEGER DEFAULT 0 NOT NULL,
  screen_time_minutes INTEGER DEFAULT 0 NOT NULL,
  focus_sessions_completed INTEGER DEFAULT 0 NOT NULL,
  streak INTEGER DEFAULT 0 NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_user_code ON users(user_code);
CREATE INDEX IF NOT EXISTS idx_otp_phone_number ON otp_verifications(phone_number, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_date ON focus_sessions(user_id, started_at);
CREATE INDEX IF NOT EXISTS idx_screen_time_user_date ON screen_time_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_date ON health_metrics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_friendships_user ON friendships(user_id, status);
CREATE INDEX IF NOT EXISTS idx_daily_stats_user_date ON daily_stats(user_id, date);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE screen_time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for application-level authorization)
CREATE POLICY "Service role has full access to users"
  ON users FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to otp_verifications"
  ON otp_verifications FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to focus_sessions"
  ON focus_sessions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to screen_time_entries"
  ON screen_time_entries FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to health_metrics"
  ON health_metrics FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to friendships"
  ON friendships FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to daily_stats"
  ON daily_stats FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
