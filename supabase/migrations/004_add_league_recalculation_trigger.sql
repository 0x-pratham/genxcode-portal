-- =====================================================
-- Add League Recalculation Trigger
-- =====================================================
-- This migration adds a trigger to automatically recalculate
-- the league when leaderboard points are updated manually
-- =====================================================

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

