// =====================================================
// Database Helper Functions
// =====================================================
// Utility functions for common database operations
// =====================================================

import { supabase, isSupabaseConfigured } from "./supabaseClient";

// =====================================================
// PROFILE HELPERS
// =====================================================

/**
 * Get user profile by ID
 */
export async function getProfile(userId) {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not configured");
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

/**
 * Update user profile
 */
export async function updateProfile(userId, updates) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    throw error;
  }

  return data;
}

// =====================================================
// LEADERBOARD HELPERS
// =====================================================

/**
 * Get leaderboard with profiles (top N)
 */
export async function getLeaderboard(limit = 100) {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not configured");
    return [];
  }

  const { data, error } = await supabase
    .from("leaderboard")
    .select(`
      *,
      profiles:user_id (
        full_name,
        branch,
        year,
        github
      )
    `)
    .order("points", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }

  return data || [];
}

/**
 * Get user's leaderboard entry
 */
export async function getUserLeaderboard(userId) {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not configured");
    return null;
  }

  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching user leaderboard:", error);
    return null;
  }

  return data;
}

/**
 * Get user's rank
 */
export async function getUserRank(userId) {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not configured");
    return null;
  }

  const { data: userData } = await supabase
    .from("leaderboard")
    .select("points")
    .eq("user_id", userId)
    .single();

  if (!userData) return null;

  const { count } = await supabase
    .from("leaderboard")
    .select("*", { count: "exact", head: true })
    .gt("points", userData.points);

  return (count || 0) + 1;
}

// =====================================================
// CHALLENGE HELPERS
// =====================================================

/**
 * Get all active challenges
 */
export async function getActiveChallenges() {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not configured");
    return [];
  }

  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching challenges:", error);
    return [];
  }

  return data || [];
}

/**
 * Get challenge by ID
 */
export async function getChallenge(challengeId) {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not configured");
    return null;
  }

  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", challengeId)
    .single();

  if (error) {
    console.error("Error fetching challenge:", error);
    return null;
  }

  return data;
}

/**
 * Create a new challenge (admin only)
 */
export async function createChallenge(challengeData) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  const { data, error } = await supabase
    .from("challenges")
    .insert([challengeData])
    .select()
    .single();

  if (error) {
    console.error("Error creating challenge:", error);
    throw error;
  }

  return data;
}

// =====================================================
// SUBMISSION HELPERS
// =====================================================

/**
 * Get user's submissions
 */
export async function getUserSubmissions(userId) {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not configured");
    return [];
  }

  const { data, error } = await supabase
    .from("submissions")
    .select(`
      *,
      challenges (
        id,
        title,
        difficulty,
        points
      )
    `)
    .eq("user_id", userId)
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Error fetching submissions:", error);
    return [];
  }

  return data || [];
}

/**
 * Submit a challenge solution
 */
export async function submitChallenge(userId, challengeId, githubLink) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  const { data, error } = await supabase
    .from("submissions")
    .insert([
      {
        user_id: userId,
        challenge_id: challengeId,
        github_link: githubLink,
        status: "pending",
        points_awarded: 0,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error submitting challenge:", error);
    throw error;
  }

  return data;
}

/**
 * Review submission (admin only)
 */
export async function reviewSubmission(
  submissionId,
  status,
  pointsAwarded,
  feedback,
  reviewerId
) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  const { data, error } = await supabase
    .from("submissions")
    .update({
      status,
      points_awarded: pointsAwarded,
      feedback,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", submissionId)
    .select()
    .single();

  if (error) {
    console.error("Error reviewing submission:", error);
    throw error;
  }

  return data;
}

// =====================================================
// ANNOUNCEMENT HELPERS
// =====================================================

/**
 * Get all announcements
 */
export async function getAnnouncements(limit = null) {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not configured");
    return [];
  }

  let query = supabase
    .from("announcements")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }

  return data || [];
}

/**
 * Create announcement (admin only)
 */
export async function createAnnouncement(announcementData) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  const { data, error } = await supabase
    .from("announcements")
    .insert([announcementData])
    .select()
    .single();

  if (error) {
    console.error("Error creating announcement:", error);
    throw error;
  }

  return data;
}

// =====================================================
// ATTENDANCE HELPERS
// =====================================================

/**
 * Get all sessions
 */
export async function getSessions() {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not configured");
    return [];
  }

  const { data, error } = await supabase
    .from("attendance_sessions")
    .select("*")
    .order("session_date", { ascending: false });

  if (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }

  return data || [];
}

/**
 * Get user's attendance
 */
export async function getUserAttendance(userId) {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not configured");
    return [];
  }

  const { data, error } = await supabase
    .from("attendance_logs")
    .select(`
      *,
      attendance_sessions (
        id,
        title,
        session_date,
        description
      )
    `)
    .eq("user_id", userId)
    .order("checked_in_at", { ascending: false });

  if (error) {
    console.error("Error fetching attendance:", error);
    return [];
  }

  return data || [];
}

/**
 * Check in to a session
 */
export async function checkInToSession(userId, sessionId) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  const { data, error } = await supabase
    .from("attendance_logs")
    .insert([
      {
        user_id: userId,
        session_id: sessionId,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error checking in:", error);
    throw error;
  }

  return data;
}

// =====================================================
// APPLICATION HELPERS
// =====================================================

/**
 * Get all applications (admin only)
 */
export async function getApplications() {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not configured");
    return [];
  }

  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching applications:", error);
    return [];
  }

  return data || [];
}

/**
 * Submit application
 */
export async function submitApplication(applicationData) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  const { data, error } = await supabase
    .from("applications")
    .insert([{ ...applicationData, status: "pending" }])
    .select()
    .single();

  if (error) {
    console.error("Error submitting application:", error);
    throw error;
  }

  return data;
}

/**
 * Review application (admin only)
 */
export async function reviewApplication(
  applicationId,
  status,
  notes,
  reviewerId
) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  const { data, error } = await supabase
    .from("applications")
    .update({
      status,
      notes,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", applicationId)
    .select()
    .single();

  if (error) {
    console.error("Error reviewing application:", error);
    throw error;
  }

  return data;
}

// =====================================================
// STATS HELPERS
// =====================================================

/**
 * Get dashboard stats (admin only)
 */
export async function getDashboardStats() {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not configured");
    return {
      users: 0,
      submissions: 0,
      challenges: 0,
      announcements: 0,
    };
  }

  const [users, submissions, challenges, announcements] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("submissions").select("id", { count: "exact", head: true }),
    supabase.from("challenges").select("id", { count: "exact", head: true }),
    supabase
      .from("announcements")
      .select("id", { count: "exact", head: true }),
  ]);

  return {
    users: users.count || 0,
    submissions: submissions.count || 0,
    challenges: challenges.count || 0,
    announcements: announcements.count || 0,
  };
}











