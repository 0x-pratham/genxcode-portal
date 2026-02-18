-- =====================================================
-- Fix League Calculation - Comprehensive Fix
-- =====================================================
-- This migration ensures leagues are properly calculated
-- and provides a function to recalculate all existing leagues
-- =====================================================

-- First, ensure the trigger function is correct and always updates league
CREATE OR REPLACE FUNCTION public.recalculate_league_on_update()
RETURNS TRIGGER AS $$
DECLARE
  new_league TEXT;
BEGIN
  -- Only recalculate if points changed
  IF OLD.points = NEW.points AND OLD.league = NEW.league THEN
    RETURN NEW;
  END IF;

  -- Always recalculate league based on current points
  -- This ensures league is correct even if manually set incorrectly
  SELECT public.calculate_league(NEW.points) INTO new_league;

  -- Force update league to calculated value
  IF new_league IS NOT NULL THEN
    NEW.league := new_league;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger to ensure it's active
DROP TRIGGER IF EXISTS on_leaderboard_points_update ON public.leaderboard;
CREATE TRIGGER on_leaderboard_points_update
  BEFORE UPDATE ON public.leaderboard
  FOR EACH ROW
  WHEN (OLD.points IS DISTINCT FROM NEW.points OR OLD.league IS DISTINCT FROM NEW.league)
  EXECUTE FUNCTION public.recalculate_league_on_update();

-- Function to recalculate all leagues (useful for fixing existing data)
CREATE OR REPLACE FUNCTION public.recalculate_all_leagues()
RETURNS void AS $$
DECLARE
  rec RECORD;
  new_league TEXT;
BEGIN
  -- Temporarily disable RLS to allow updates
  SET LOCAL row_security = off;
  
  FOR rec IN SELECT user_id, points FROM public.leaderboard
  LOOP
    SELECT public.calculate_league(rec.points) INTO new_league;
    
    -- Force update league for all users to ensure correctness
    UPDATE public.leaderboard
    SET league = new_league
    WHERE user_id = rec.user_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to recalculate league for a specific user
CREATE OR REPLACE FUNCTION public.recalculate_user_league(p_user_id UUID)
RETURNS void AS $$
DECLARE
  user_points INTEGER;
  new_league TEXT;
BEGIN
  SELECT points INTO user_points FROM public.leaderboard WHERE user_id = p_user_id;
  
  IF user_points IS NOT NULL THEN
    SELECT public.calculate_league(user_points) INTO new_league;
    
    UPDATE public.leaderboard
    SET league = new_league
    WHERE user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the recalculation function to fix any existing incorrect leagues
SELECT public.recalculate_all_leagues();

