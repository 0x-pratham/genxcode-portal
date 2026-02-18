-- =====================================================
-- GenXCode Portal - Row Level Security Policies
-- =====================================================
-- Run this AFTER 001_initial_schema.sql
-- =====================================================

-- =====================================================
-- HELPER FUNCTION: Check if user is admin
-- =====================================================
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

-- Anyone can read profiles (for leaderboard, etc.)
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (for initial creation)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admins can update any profile
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- =====================================================
-- LEADERBOARD POLICIES
-- =====================================================

-- Anyone can read leaderboard
DROP POLICY IF EXISTS "Leaderboard is viewable by everyone" ON public.leaderboard;
CREATE POLICY "Leaderboard is viewable by everyone"
  ON public.leaderboard FOR SELECT
  USING (true);

-- Users cannot directly insert into leaderboard (only triggers can)
DROP POLICY IF EXISTS "Users cannot insert leaderboard" ON public.leaderboard;
CREATE POLICY "Users cannot insert leaderboard"
  ON public.leaderboard FOR INSERT
  WITH CHECK (false);

-- Users cannot directly update leaderboard (only triggers and admins can)
DROP POLICY IF EXISTS "Users cannot update leaderboard" ON public.leaderboard;
CREATE POLICY "Users cannot update leaderboard"
  ON public.leaderboard FOR UPDATE
  USING (false)
  WITH CHECK (false);

-- Admins can update leaderboard manually if needed
DROP POLICY IF EXISTS "Admins can update leaderboard" ON public.leaderboard;
CREATE POLICY "Admins can update leaderboard"
  ON public.leaderboard FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Note: Trigger functions with SECURITY DEFINER can bypass RLS
-- The update_leaderboard_points() function uses SET LOCAL row_security = off
-- to allow trigger-based updates while maintaining security

-- =====================================================
-- APPLICATIONS POLICIES
-- =====================================================

-- Users can read their own applications
DROP POLICY IF EXISTS "Users can view own applications" ON public.applications;
CREATE POLICY "Users can view own applications"
  ON public.applications FOR SELECT
  USING (auth.uid() = user_id);

-- Anyone can create an application (for public signup)
DROP POLICY IF EXISTS "Anyone can create applications" ON public.applications;
CREATE POLICY "Anyone can create applications"
  ON public.applications FOR INSERT
  WITH CHECK (true);

-- Users can update their own pending applications
DROP POLICY IF EXISTS "Users can update own pending applications" ON public.applications;
CREATE POLICY "Users can update own pending applications"
  ON public.applications FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

-- Admins can read all applications
DROP POLICY IF EXISTS "Admins can read all applications" ON public.applications;
CREATE POLICY "Admins can read all applications"
  ON public.applications FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Admins can update any application
DROP POLICY IF EXISTS "Admins can update any application" ON public.applications;
CREATE POLICY "Admins can update any application"
  ON public.applications FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- =====================================================
-- CHALLENGES POLICIES
-- =====================================================

-- Anyone can read active challenges
DROP POLICY IF EXISTS "Active challenges are viewable by everyone" ON public.challenges;
CREATE POLICY "Active challenges are viewable by everyone"
  ON public.challenges FOR SELECT
  USING (is_active = true OR public.is_admin(auth.uid()));

-- Admins can read all challenges (including inactive)
-- (covered by above policy with is_admin check)

-- Admins can create challenges
DROP POLICY IF EXISTS "Admins can create challenges" ON public.challenges;
CREATE POLICY "Admins can create challenges"
  ON public.challenges FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- Admins can update challenges
DROP POLICY IF EXISTS "Admins can update challenges" ON public.challenges;
CREATE POLICY "Admins can update challenges"
  ON public.challenges FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Admins can delete challenges
DROP POLICY IF EXISTS "Admins can delete challenges" ON public.challenges;
CREATE POLICY "Admins can delete challenges"
  ON public.challenges FOR DELETE
  USING (public.is_admin(auth.uid()));

-- =====================================================
-- SUBMISSIONS POLICIES
-- =====================================================

-- Users can read their own submissions
DROP POLICY IF EXISTS "Users can view own submissions" ON public.submissions;
CREATE POLICY "Users can view own submissions"
  ON public.submissions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own submissions
DROP POLICY IF EXISTS "Users can create own submissions" ON public.submissions;
CREATE POLICY "Users can create own submissions"
  ON public.submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending submissions
DROP POLICY IF EXISTS "Users can update own pending submissions" ON public.submissions;
CREATE POLICY "Users can update own pending submissions"
  ON public.submissions FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

-- Admins can read all submissions
DROP POLICY IF EXISTS "Admins can read all submissions" ON public.submissions;
CREATE POLICY "Admins can read all submissions"
  ON public.submissions FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Admins can update any submission (for reviewing)
DROP POLICY IF EXISTS "Admins can update any submission" ON public.submissions;
CREATE POLICY "Admins can update any submission"
  ON public.submissions FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- =====================================================
-- ANNOUNCEMENTS POLICIES
-- =====================================================

-- Anyone can read announcements
DROP POLICY IF EXISTS "Announcements are viewable by everyone" ON public.announcements;
CREATE POLICY "Announcements are viewable by everyone"
  ON public.announcements FOR SELECT
  USING (true);

-- Admins can create announcements
DROP POLICY IF EXISTS "Admins can create announcements" ON public.announcements;
CREATE POLICY "Admins can create announcements"
  ON public.announcements FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- Admins can update announcements
DROP POLICY IF EXISTS "Admins can update announcements" ON public.announcements;
CREATE POLICY "Admins can update announcements"
  ON public.announcements FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Admins can delete announcements
DROP POLICY IF EXISTS "Admins can delete announcements" ON public.announcements;
CREATE POLICY "Admins can delete announcements"
  ON public.announcements FOR DELETE
  USING (public.is_admin(auth.uid()));

-- =====================================================
-- ATTENDANCE SESSIONS POLICIES
-- =====================================================

-- Anyone can read attendance sessions
DROP POLICY IF EXISTS "Attendance sessions are viewable by everyone" ON public.attendance_sessions;
CREATE POLICY "Attendance sessions are viewable by everyone"
  ON public.attendance_sessions FOR SELECT
  USING (true);

-- Admins can create sessions
DROP POLICY IF EXISTS "Admins can create attendance sessions" ON public.attendance_sessions;
CREATE POLICY "Admins can create attendance sessions"
  ON public.attendance_sessions FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- Admins can update sessions
DROP POLICY IF EXISTS "Admins can update attendance sessions" ON public.attendance_sessions;
CREATE POLICY "Admins can update attendance sessions"
  ON public.attendance_sessions FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Admins can delete sessions
DROP POLICY IF EXISTS "Admins can delete attendance sessions" ON public.attendance_sessions;
CREATE POLICY "Admins can delete attendance sessions"
  ON public.attendance_sessions FOR DELETE
  USING (public.is_admin(auth.uid()));

-- =====================================================
-- ATTENDANCE LOGS POLICIES
-- =====================================================

-- Users can read their own attendance logs
DROP POLICY IF EXISTS "Users can view own attendance logs" ON public.attendance_logs;
CREATE POLICY "Users can view own attendance logs"
  ON public.attendance_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own attendance logs (check-in)
DROP POLICY IF EXISTS "Users can check in to sessions" ON public.attendance_logs;
CREATE POLICY "Users can check in to sessions"
  ON public.attendance_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can read all attendance logs
DROP POLICY IF EXISTS "Admins can read all attendance logs" ON public.attendance_logs;
CREATE POLICY "Admins can read all attendance logs"
  ON public.attendance_logs FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Admins can insert attendance logs for any user (manual marking)
DROP POLICY IF EXISTS "Admins can insert attendance logs" ON public.attendance_logs;
CREATE POLICY "Admins can insert attendance logs"
  ON public.attendance_logs FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- Admins can delete attendance logs (for corrections)
DROP POLICY IF EXISTS "Admins can delete attendance logs" ON public.attendance_logs;
CREATE POLICY "Admins can delete attendance logs"
  ON public.attendance_logs FOR DELETE
  USING (public.is_admin(auth.uid()));

