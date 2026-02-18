-- =====================================================
-- Fix Leaderboard Trigger RLS Issue
-- =====================================================
-- This migration fixes the RLS policy issue that prevents
-- the trigger from updating the leaderboard when submissions are approved
-- =====================================================

-- Update the trigger function to temporarily disable RLS
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

-- Alternative: If SET LOCAL doesn't work, we can also modify RLS policies
-- to allow the function to work. Uncomment the following if SET LOCAL fails:

-- Remove the blocking policy that prevents all operations
-- DROP POLICY IF EXISTS "System can manage leaderboard" ON public.leaderboard;

-- Create a more permissive policy that allows SECURITY DEFINER functions
-- This policy allows operations when called from a SECURITY DEFINER function
-- DROP POLICY IF EXISTS "Allow trigger updates" ON public.leaderboard;
-- CREATE POLICY "Allow trigger updates"
--   ON public.leaderboard FOR ALL
--   USING (current_setting('role') = 'postgres' OR current_setting('role') = 'service_role')
--   WITH CHECK (current_setting('role') = 'postgres' OR current_setting('role') = 'service_role');

