# Database Setup Guide

This guide will help you set up the GenXCode Portal database in Supabase.

## Prerequisites

- A Supabase account and project
- Access to your Supabase project's SQL Editor

## Step-by-Step Setup

### 1. Open SQL Editor

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New query"

### 2. Run Initial Schema Migration

1. Open the file `supabase/migrations/001_initial_schema.sql` in your code editor
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Click "Run" (or press `Ctrl+Enter` / `Cmd+Enter`)

**What this does:**
- Creates all database tables (profiles, leaderboard, challenges, submissions, etc.)
- Sets up indexes for performance
- Creates helper functions (calculate_league, update_leaderboard_points, etc.)
- Sets up triggers for automatic profile/leaderboard creation on signup
- Enables Row Level Security on all tables

**Expected result:** You should see "Success. No rows returned" or similar success message.

### 3. Run RLS Policies Migration

1. Open the file `supabase/migrations/002_rls_policies.sql` in your code editor
2. Copy the entire contents
3. Paste into a new query in the Supabase SQL Editor
4. Click "Run"

**What this does:**
- Creates security policies for all tables
- Allows users to read/write their own data
- Restricts admin-only operations
- Enables public read access where appropriate (leaderboard, announcements, etc.)

**Expected result:** You should see "Success. No rows returned" or similar success message.

### 4. Verify Tables Were Created

1. Go to "Table Editor" in the Supabase dashboard
2. You should see the following tables:
   - `profiles`
   - `leaderboard`
   - `applications`
   - `challenges`
   - `submissions`
   - `announcements`
   - `attendance_sessions`
   - `attendance_logs`

### 5. Create Your First Admin User

After setting up the database, you need to create an admin user to access the admin panel.

#### Option A: Via Supabase Dashboard

1. Sign up for an account through your app (or create a user in Authentication → Users)
2. Go to Table Editor → `profiles`
3. Find your user (by email or user ID)
4. Click on the row to edit
5. Change `role` from `'member'` to `'admin'`
6. Save

#### Option B: Via SQL

```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
```

Run this in the SQL Editor.

### 6. Test the Setup

1. Try signing up a new user through your app
2. Check the `profiles` table - a new profile should be automatically created
3. Check the `leaderboard` table - a new entry with 0 points should be created
4. Log in as your admin user and try accessing `/admin`

## Troubleshooting

### Error: "relation already exists"

If you see this error, it means the tables already exist. You can either:
- Drop all tables and re-run (⚠️ **WARNING**: This will delete all data)
- Or skip the migration and just run the RLS policies

### Error: "permission denied"

Make sure you've run both migration files in order. RLS policies must be set up after the schema.

### Admin panel not accessible

1. Verify your user's `role` in the `profiles` table is set to `'admin'` (not `'member'`)
2. Make sure you're logged in with the correct account
3. Check the browser console for any error messages

### Triggers not working

1. Verify the triggers were created by running:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname LIKE '%user%' OR tgname LIKE '%submission%';
   ```
2. If triggers are missing, re-run the schema migration

## Database Functions

The schema includes several helpful functions:

- `calculate_league(points)` - Calculates league based on points
- `update_leaderboard_points()` - Updates leaderboard when submissions are approved/rejected
- `handle_new_user()` - Creates profile and leaderboard entry on signup
- `is_admin(user_id)` - Checks if a user is an admin (for RLS policies)

## League Thresholds

The default league thresholds are:
- Bronze: 0+ points
- Silver: 500+ points
- Gold: 1500+ points
- Crystal: 3000+ points
- Master: 4500+ points
- Champion: 6000+ points
- Titan: 7000+ points
- Legend: 8000+ points

To modify these, edit the `calculate_league()` function in `001_initial_schema.sql`.

## Next Steps

After setting up the database:

1. Configure your `.env` file with Supabase credentials
2. Start your development server: `npm run dev`
3. Test user signup and login
4. Create some test challenges via the admin panel
5. Test the full workflow: signup → submit challenge → review → earn points

## Support

If you encounter issues, check:
1. Supabase project is active and not paused
2. API keys are correct in `.env`
3. Both migration files ran successfully
4. Your user has admin role set correctly

For more help, contact: ofc.genxcode@gmail.com

