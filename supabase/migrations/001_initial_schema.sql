-- =====================================================
-- GenXCode Portal - Initial Database Schema
-- =====================================================
-- This migration creates all tables, functions, and triggers
-- Run this first, then run 002_rls_policies.sql
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  branch TEXT,
  year TEXT,
  github TEXT,
  phone TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- LEADERBOARD TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0 CHECK (points >= 0),
  league TEXT DEFAULT 'Bronze' CHECK (league IN ('Bronze', 'Silver', 'Gold', 'Crystal', 'Master', 'Champion', 'Titan', 'Legend')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- =====================================================
-- APPLICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  branch TEXT,
  year TEXT,
  phone TEXT,
  github TEXT,
  why_join TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CHALLENGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  points INTEGER DEFAULT 10 CHECK (points >= 0),
  tags TEXT[], -- Array of tags
  github_template TEXT, -- Link to starter template
  resources TEXT, -- Additional resources/links
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SUBMISSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  github_link TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  points_awarded INTEGER DEFAULT 0 CHECK (points_awarded >= 0),
  feedback TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, challenge_id) -- Prevent duplicate submissions for same challenge
);

-- =====================================================
-- ANNOUNCEMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ATTENDANCE SESSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.attendance_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  session_date TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ATTENDANCE LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.attendance_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.attendance_sessions(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, session_id) -- Prevent duplicate check-ins
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Leaderboard indexes
CREATE INDEX IF NOT EXISTS idx_leaderboard_points ON public.leaderboard(points DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_id ON public.leaderboard(user_id);

-- Submissions indexes
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_challenge_id ON public.submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);

-- Challenges indexes
CREATE INDEX IF NOT EXISTS idx_challenges_is_active ON public.challenges(is_active);
CREATE INDEX IF NOT EXISTS idx_challenges_created_at ON public.challenges(created_at DESC);

-- Announcements indexes
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON public.announcements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_is_pinned ON public.announcements(is_pinned);

-- Applications indexes
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications(created_at DESC);

-- Attendance indexes
CREATE INDEX IF NOT EXISTS idx_attendance_logs_user_id ON public.attendance_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_logs_session_id ON public.attendance_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_sessions_date ON public.attendance_sessions(session_date DESC);

-- =====================================================
-- FUNCTION: Calculate League from Points
-- =====================================================
CREATE OR REPLACE FUNCTION public.calculate_league(points INTEGER)
RETURNS TEXT AS $$
BEGIN
  CASE
    WHEN points >= 8000 THEN RETURN 'Legend';
    WHEN points >= 7000 THEN RETURN 'Titan';
    WHEN points >= 6000 THEN RETURN 'Champion';
    WHEN points >= 4500 THEN RETURN 'Master';
    WHEN points >= 3000 THEN RETURN 'Crystal';
    WHEN points >= 1500 THEN RETURN 'Gold';
    WHEN points >= 500 THEN RETURN 'Silver';
    ELSE RETURN 'Bronze';
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- FUNCTION: Update Leaderboard Points
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_leaderboard_points()
RETURNS TRIGGER AS $$
DECLARE
  new_points INTEGER;
  new_league TEXT;
  should_update BOOLEAN := false;
BEGIN
  -- Check if we need to update (status is/was approved)
  IF TG_OP = 'INSERT' THEN
    -- For INSERT, only update if status is approved
    should_update := (NEW.status = 'approved');
  ELSIF TG_OP = 'UPDATE' THEN
    -- For UPDATE, update if status changed to/from approved
    should_update := (NEW.status = 'approved' OR OLD.status = 'approved');
  END IF;

  -- Only proceed if we need to update
  IF NOT should_update THEN
    RETURN NEW;
  END IF;

  -- Calculate total points for user
  SELECT COALESCE(SUM(points_awarded), 0) INTO new_points
  FROM public.submissions
  WHERE user_id = NEW.user_id AND status = 'approved';

  -- Calculate league
  SELECT calculate_league(new_points) INTO new_league;

  -- Temporarily disable RLS to allow trigger to update leaderboard
  -- This is safe because the function is SECURITY DEFINER and only called by triggers
  SET LOCAL row_security = off;

  -- Update or insert leaderboard entry
  INSERT INTO public.leaderboard (user_id, points, league, updated_at)
  VALUES (NEW.user_id, new_points, new_league, NOW())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    points = new_points,
    league = new_league,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Handle New User Signup
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile from user metadata
  INSERT INTO public.profiles (id, full_name, branch, year, github, phone, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'branch',
    NEW.raw_user_meta_data->>'year',
    NEW.raw_user_meta_data->>'github',
    NEW.raw_user_meta_data->>'phone',
    'member'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create initial leaderboard entry
  INSERT INTO public.leaderboard (user_id, points, league)
  VALUES (NEW.id, 0, 'Bronze')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger: Auto-create profile and leaderboard on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Update leaderboard when submission is approved/rejected
DROP TRIGGER IF EXISTS on_submission_status_change ON public.submissions;
CREATE TRIGGER on_submission_status_change
  AFTER INSERT OR UPDATE OF status, points_awarded ON public.submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_leaderboard_points();

-- =====================================================
-- FUNCTION: Recalculate League on Leaderboard Update
-- =====================================================
CREATE OR REPLACE FUNCTION public.recalculate_league_on_update()
RETURNS TRIGGER AS $$
DECLARE
  new_league TEXT;
BEGIN
  -- Only recalculate if points changed
  IF OLD.points = NEW.points THEN
    RETURN NEW;
  END IF;

  -- Calculate league based on new points
  SELECT calculate_league(NEW.points) INTO new_league;

  -- Always update league to ensure it's correct
  IF new_league IS NOT NULL THEN
    NEW.league := new_league;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Recalculate league when leaderboard points are updated
DROP TRIGGER IF EXISTS on_leaderboard_points_update ON public.leaderboard;
CREATE TRIGGER on_leaderboard_points_update
  BEFORE UPDATE OF points ON public.leaderboard
  FOR EACH ROW
  EXECUTE FUNCTION public.recalculate_league_on_update();

-- Trigger: Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_leaderboard_updated_at ON public.leaderboard;
CREATE TRIGGER update_leaderboard_updated_at
  BEFORE UPDATE ON public.leaderboard
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_applications_updated_at ON public.applications;
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_challenges_updated_at ON public.challenges;
CREATE TRIGGER update_challenges_updated_at
  BEFORE UPDATE ON public.challenges
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_submissions_updated_at ON public.submissions;
CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_announcements_updated_at ON public.announcements;
CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_attendance_sessions_updated_at ON public.attendance_sessions;
CREATE TRIGGER update_attendance_sessions_updated_at
  BEFORE UPDATE ON public.attendance_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================
-- Enable Row Level Security (policies will be set in next migration)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;

