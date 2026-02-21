-- =====================================================
-- Attendance Points Automation
-- =====================================================
-- When attendance is marked (insert into attendance_logs),
-- add 10 points to the user's leaderboard automatically.
-- When attendance is removed (delete), points are recalculated
-- so the total is always: submission points + (10 × attendance count).
-- This migration introduces a single recalc function so we never
-- overwrite or lose points from either source.
-- =====================================================

-- =====================================================
-- FUNCTION: Recalculate leaderboard for one user
-- (submission points + 10 per attendance)
-- =====================================================
CREATE OR REPLACE FUNCTION public.recalculate_leaderboard_for_user(p_user_id UUID)
RETURNS void AS $$
DECLARE
  submission_pts INTEGER;
  attendance_count INTEGER;
  total_pts INTEGER;
  new_league TEXT;
BEGIN
  IF p_user_id IS NULL THEN
    RETURN;
  END IF;

  -- Points from approved submissions
  SELECT COALESCE(SUM(points_awarded), 0) INTO submission_pts
  FROM public.submissions
  WHERE user_id = p_user_id AND status = 'approved';

  -- 10 points per attendance record
  SELECT COUNT(*)::INTEGER INTO attendance_count
  FROM public.attendance_logs
  WHERE user_id = p_user_id;

  total_pts := COALESCE(submission_pts, 0) + (COALESCE(attendance_count, 0) * 10);
  SELECT public.calculate_league(total_pts) INTO new_league;

  -- Allow this function to update leaderboard (bypass RLS)
  SET LOCAL row_security = off;

  INSERT INTO public.leaderboard (user_id, points, league, updated_at)
  VALUES (p_user_id, total_pts, new_league, NOW())
  ON CONFLICT (user_id)
  DO UPDATE SET
    points = total_pts,
    league = new_league,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Replace submission trigger to use shared recalc
-- (so leaderboard = submissions + attendance always)
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_leaderboard_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Recalculate only when submission status/points matter
  IF TG_OP = 'INSERT' THEN
    IF NEW.status = 'approved' THEN
      PERFORM public.recalculate_leaderboard_for_user(NEW.user_id);
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF (OLD.status IS DISTINCT FROM NEW.status) OR (OLD.points_awarded IS DISTINCT FROM NEW.points_awarded) THEN
      PERFORM public.recalculate_leaderboard_for_user(NEW.user_id);
      IF OLD.user_id IS DISTINCT FROM NEW.user_id THEN
        PERFORM public.recalculate_leaderboard_for_user(OLD.user_id);
      END IF;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.status = 'approved' THEN
      PERFORM public.recalculate_leaderboard_for_user(OLD.user_id);
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger exists on submissions (recreate to be sure)
DROP TRIGGER IF EXISTS on_submission_status_change ON public.submissions;
CREATE TRIGGER on_submission_status_change
  AFTER INSERT OR UPDATE OR DELETE ON public.submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_leaderboard_points();

-- =====================================================
-- Trigger: Recalc leaderboard when attendance is added/removed
-- =====================================================
CREATE OR REPLACE FUNCTION public.on_attendance_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.recalculate_leaderboard_for_user(NEW.user_id);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.recalculate_leaderboard_for_user(OLD.user_id);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_attendance_log_points ON public.attendance_logs;
CREATE TRIGGER on_attendance_log_points
  AFTER INSERT OR DELETE ON public.attendance_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.on_attendance_change();

-- =====================================================
-- Fix existing data: recalc all users so current
-- attendance counts are reflected in leaderboard
-- =====================================================
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT DISTINCT user_id FROM public.leaderboard
  LOOP
    PERFORM public.recalculate_leaderboard_for_user(r.user_id);
  END LOOP;
  -- Also recalc for any user who has attendance but no leaderboard row yet
  FOR r IN SELECT DISTINCT user_id FROM public.attendance_logs al
             WHERE NOT EXISTS (SELECT 1 FROM public.leaderboard lb WHERE lb.user_id = al.user_id)
  LOOP
    PERFORM public.recalculate_leaderboard_for_user(r.user_id);
  END LOOP;
END $$;
