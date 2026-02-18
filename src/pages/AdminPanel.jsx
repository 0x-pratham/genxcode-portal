// ===================== GENXCODE ADMIN PANEL — UPGRADED V2 =====================
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { motion, useReducedMotion } from "framer-motion";
void motion;

/* -------------------------------------------------------------------------- */
/* UI HELPERS (UNCHANGED STYLE, REUSED)                                        */
/* -------------------------------------------------------------------------- */

const FrostCard = ({ children, className = "" }) => (
  <div className={`rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl p-5 transition-transform transform-gpu hover:scale-[1.01] ${className}`}>
    {children}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400/40"
  />
);

const TextArea = (props) => (
  <textarea
    {...props}
    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400/40"
  />
);

const Select = (props) => (
  <select
    {...props}
    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-400/40"
  />
);

const TabButton = ({ id, active, children, onClick }) => {
  const reduce = useReducedMotion();
  const hoverProps = reduce ? {} : { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } };

  return (
    <motion.button
      {...hoverProps}
      onClick={() => onClick(id)}
      className={`px-4 py-2 rounded-xl text-sm ${
        active
          ? "bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border border-cyan-400/30"
          : "bg-white/5 border border-white/10"
      }`}
    >
      {children}
    </motion.button>
  );
};

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                                                              */
/* -------------------------------------------------------------------------- */

export default function AdminPanel() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState("overview");
  

  // local helpers / UI state
  const [appQuery, setAppQuery] = useState("");

  /* ----------------------------- DATA STATES ------------------------------ */
  const [stats, setStats] = useState({
    users: 0,
    submissions: 0,
    challenges: 0,
    announcements: 0,
  });

  const [applications, setApplications] = useState([]);
  const [applicationsError, setApplicationsError] = useState(null);
  const [debugAuth, setDebugAuth] = useState(null); // { userId, email, role }
  const [debugProfileError, setDebugProfileError] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [profiles, setProfiles] = useState([]); // For showing user names
  const [challenges, setChallenges] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [logs, setLogs] = useState([]);

  const [loadingAll, setLoadingAll] = useState(false);
  
  // Manual attendance marking state
  const [selectedSessionForMarking, setSelectedSessionForMarking] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [sessionAttendanceMap, setSessionAttendanceMap] = useState(new Map()); // session_id -> Set of user_ids
  const [markingAttendance, setMarkingAttendance] = useState(false);
  const [attendanceSearchQuery, setAttendanceSearchQuery] = useState("");
  
  // Manual points adjustment state
  const [selectedUser, setSelectedUser] = useState(null);
  const [pointsAdjustment, setPointsAdjustment] = useState({
    points: "",
    reason: "",
  });
  const [adjustingPoints, setAdjustingPoints] = useState(false);

  /* ----------------------------- FORM STATES ------------------------------- */
  const [ann, setAnn] = useState({ title: "", content: "" });
  const [challenge, setChallenge] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    points: 10,
    tags: "",
    github_template: "",
    resources: "",
    is_active: true,
  });
  const [session, setSession] = useState({
    title: "",
    session_date: "",
    description: "",
  });

  /* -------------------------------------------------------------------------- */
  /* ADMIN AUTH GUARD                                                           */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        if (!supabase) {
          console.error("Supabase is not configured");
          navigate("/login");
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return navigate("/login");

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role,id")
          .eq("id", user.id)
          .single();

        // store debug info (helps diagnose 403/RLS issues)
        setDebugAuth({ userId: user.id, email: user.email, role: profile?.role || null });

        if (error || profile?.role !== "admin") {
          navigate("/dashboard");
          return;
        }

        setChecking(false);
      } catch (err) {
        console.error("Error checking admin:", err);
        navigate("/login");
      }
    };

    checkAdmin();
  }, [navigate]);

  // helper to fetch current user's profile info (useful for debugging RLS 403s)
  const fetchProfileDebug = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setDebugAuth({ userId: null, email: null, role: null });
        return null;
      }
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('id', user.id)
        .maybeSingle();
      setDebugAuth({ userId: user.id, email: user.email, role: profile?.role || null });
      // surface profile fetch error for diagnostics
      setDebugProfileError(error || null);
      return { user, profile, error };
    } catch (err) {
      console.error('Error fetching profile debug:', err);
      setDebugAuth({ userId: null, email: null, role: null });
      setDebugProfileError(err || null);
      return null;
    }
  };


  /* -------------------------------------------------------------------------- */
  /* LOAD ALL DATA                                                              */
  /* -------------------------------------------------------------------------- */
  const loadAll = async () => {
    setLoadingAll(true);
    try {
      const [u, s, c, a] = await Promise.all([
        supabase.from("profiles").select("id"),
        supabase.from("submissions").select("id"),
        supabase.from("challenges").select("id"),
        supabase.from("announcements").select("id"),
      ]);

      setStats({
        users: u.data?.length || 0,
        submissions: s.data?.length || 0,
        challenges: c.data?.length || 0,
        announcements: a.data?.length || 0,
      });

      const apps = await supabase.from("applications").select("*");
      if (apps.error) {
        console.error("Error loading applications:", apps.error);
        setApplications([]);
        setApplicationsError({ status: apps.error.status, message: apps.error.message || String(apps.error) });
        // fetch profile info to diagnose why RLS may be blocking the request (e.g., missing admin role)
        const pd = await fetchProfileDebug();
        console.info('Profile debug data for applications fetch:', pd);

        // No server fallback here - rely on Supabase RLS policies only
      } else {
        setApplications(apps.data || []);
        setApplicationsError(null);
      }

      const an = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
      if (an.error) {
        console.error("Error loading announcements:", an.error);
        setAnnouncements([]);
      } else {
        setAnnouncements(an.data || []);
      }

      const lb = await supabase.from("leaderboard").select("*").order("points", { ascending: false });
      if (lb.error) {
        console.error("Error loading leaderboard:", lb.error);
        setLeaders([]);
      } else {
        setLeaders(lb.data || []);
      }

      // Load profiles for user names
      const prof = await supabase.from("profiles").select("id, full_name, branch, year");
      if (prof.error) {
        console.error("Error loading profiles:", prof.error);
        setProfiles([]);
      } else {
        setProfiles(prof.data || []);
      }

      const ch = await supabase.from("challenges").select("*");
      if (ch.error) {
        console.error("Error loading challenges:", ch.error);
        setChallenges([]);
      } else {
        setChallenges(ch.data || []);
      }

      const subs = await supabase
        .from("submissions")
        .select(`id, status, github_link, points_awarded, submitted_at, user_id,
          challenges ( title, difficulty, points )`);
      if (subs.error) {
        console.error("Error loading submissions:", subs.error);
        setSubmissions([]);
      } else {
        // Merge profile information with submissions using the fetched profiles data
        const profilesData = prof.data || [];
        const submissionsWithProfiles = (subs.data || []).map(sub => {
          const profile = profilesData.find(p => p.id === sub.user_id);
          return {
            ...sub,
            profiles: profile ? {
              id: profile.id,
              full_name: profile.full_name,
              branch: profile.branch,
              year: profile.year
            } : null
          };
        });
        setSubmissions(submissionsWithProfiles);
      }

      const sess = await supabase.from("attendance_sessions").select("*");
      if (sess.error) {
        console.error("Error loading sessions:", sess.error);
        setSessions([]);
      } else {
        setSessions(sess.data || []);
      }

      const lg = await supabase.from("attendance_logs").select("*");
      if (lg.error) {
        console.error("Error loading logs:", lg.error);
        setLogs([]);
      } else {
        setLogs(lg.data || []);
        // Build attendance map for quick lookup
        const attendanceMap = new Map();
        (lg.data || []).forEach(log => {
          if (!attendanceMap.has(log.session_id)) {
            attendanceMap.set(log.session_id, new Set());
          }
          attendanceMap.get(log.session_id).add(log.user_id);
        });
        setSessionAttendanceMap(attendanceMap);
      }

      // Load all students (profiles) for manual attendance marking
      const students = await supabase
        .from("profiles")
        .select("id, full_name, branch, year")
        .order("full_name", { ascending: true });
      if (students.error) {
        console.error("Error loading students:", students.error);
        setAllStudents([]);
      } else {
        setAllStudents(students.data || []);
      }
    } catch (err) {
      console.error("Error loading all data:", err);
    } finally {
      setLoadingAll(false);
    }
  };

  useEffect(() => {
    if (checking) return;
    // defer loadAll to avoid sync setState within effect
    Promise.resolve().then(() => loadAll());
  }, [checking]);

  /* -------------------------------------------------------------------------- */
  /* ACTIONS                                                                    */
  /* -------------------------------------------------------------------------- */

  const postAnnouncement = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in to post announcements.");
      return;
    }

    const { data, error } = await supabase
      .from("announcements")
      .insert([{ ...ann, created_by: user.id }])
      .select()
      .single();

    if (error) {
      console.error("Error posting announcement:", error);
      alert("Failed to post announcement. Please try again.");
      return;
    }

    setAnnouncements(p => [data, ...p]);
    setAnn({ title: "", content: "" });
  };

  const addChallenge = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in to add challenges.");
      return;
    }

    const tagsArray =
      challenge.tags && challenge.tags.trim().length
        ? challenge.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : null;

    const challengeData = {
      title: challenge.title.trim(),
      description: challenge.description.trim(),
      difficulty: challenge.difficulty.toLowerCase(),
      points: Number(challenge.points) || 0,
      created_by: user.id,
      is_active: !!challenge.is_active,
      tags: tagsArray,
      github_template: challenge.github_template.trim() || null,
      resources: challenge.resources.trim() || null,
    };

    const { data, error } = await supabase
      .from("challenges")
      .insert([challengeData])
      .select()
      .single();

    if (error) {
      console.error("Error adding challenge:", error);
      alert("Failed to add challenge. Please try again.");
      return;
    }

    setChallenges((p) => [data, ...p]);
    setChallenge({
      title: "",
      description: "",
      difficulty: "Easy",
      points: 10,
      tags: "",
      github_template: "",
      resources: "",
      is_active: true,
    });
  };

  const approveSubmission = async (s) => {
    if (!s?.challenges?.points || !s?.user_id) {
      alert("Invalid submission data.");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in to approve submissions.");
      return;
    }

    const { error: updateError } = await supabase
      .from("submissions")
      .update({
        status: "approved",
        points_awarded: s.challenges.points,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", s.id);

    if (updateError) {
      console.error("Error approving submission:", updateError);
      alert("Failed to approve submission: " + (updateError.message || "Unknown error"));
      return;
    }

    // Refresh all data to ensure leaderboard and points are updated
    await loadAll();

    alert(`Submission approved! ${s.challenges.points} points awarded.`);
  };

  const rejectSubmission = async (s) => {
    if (!s?.id) {
      alert("Invalid submission data.");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in to reject submissions.");
      return;
    }

    const { error: updateError } = await supabase
      .from("submissions")
      .update({
        status: "rejected",
        points_awarded: 0,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", s.id);

    if (updateError) {
      console.error("Error rejecting submission:", updateError);
      alert("Failed to reject submission: " + (updateError.message || "Unknown error"));
      return;
    }

    // Refresh all data to ensure leaderboard is updated
    await loadAll();

    alert("Submission rejected.");
  };

  const createSession = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in to create sessions.");
      return;
    }

    const sessionData = {
      ...session,
      created_by: user.id,
    };

    const { data, error } = await supabase
      .from("attendance_sessions")
      .insert([sessionData])
      .select()
      .single();

    if (error) {
      console.error("Error creating session:", error);
      alert("Failed to create session. Please try again.");
      return;
    }

    setSessions(p => [data, ...p]);
    setSession({ title: "", session_date: "", description: "" });
  };

  const handleApproveApp = async (app) => {
    if (!app || !app.id) return;
    if (app.status && app.status !== "pending") {
      alert("This application has already been reviewed.");
      return;
    }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("applications")
        .update({
          status: "approved",
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", app.id);
      if (error) {
        console.error("Approve app error:", error);
        alert("Failed to approve application: " + (error.message || "Unknown error"));
        return;
      }
      setApplications(p => p.map(a => a.id === app.id ? { ...a, status: "approved", reviewed_by: user?.id } : a));
    } catch (err) {
      console.error("Approve app unexpected error:", err);
      alert("Failed to approve application. See console for details.");
    }
  };

  const handleRejectApp = async (app) => {
    if (!app || !app.id) return;
    if (app.status && app.status !== "pending") {
      alert("This application has already been reviewed.");
      return;
    }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("applications")
        .update({
          status: "rejected",
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", app.id);
      if (error) {
        console.error("Reject app error:", error);
        alert("Failed to reject application: " + (error.message || "Unknown error"));
        return;
      }
      setApplications(p => p.map(a => a.id === app.id ? { ...a, status: "rejected", reviewed_by: user?.id } : a));
    } catch (err) {
      console.error("Reject app unexpected error:", err);
      alert("Failed to reject application. See console for details.");
    }
  };

  /* -------------------------------------------------------------------------- */
  /* MANUAL ATTENDANCE MARKING                                                  */
  /* -------------------------------------------------------------------------- */

  const handleSelectSessionForMarking = (sessionId) => {
    setSelectedSessionForMarking(sessionId);
    setAttendanceSearchQuery("");
  };

  const isStudentMarkedPresent = (userId, sessionId) => {
    const sessionSet = sessionAttendanceMap.get(sessionId);
    return sessionSet ? sessionSet.has(userId) : false;
  };

  const markStudentAttendance = async (userId, sessionId, markAsPresent) => {
    if (!userId || !sessionId) return;

    setMarkingAttendance(true);
    try {
      if (markAsPresent) {
        // Mark as present - insert attendance log
        const { error } = await supabase
          .from("attendance_logs")
          .insert([{
            user_id: userId,
            session_id: sessionId,
            checked_in_at: new Date().toISOString(),
          }]);

        if (error) {
          // If it's a unique constraint error, the student is already marked
          if (error.code === '23505') {
            console.log("Student already marked present");
          } else {
            console.error("Error marking attendance:", error);
            alert("Failed to mark attendance: " + (error.message || "Unknown error"));
            setMarkingAttendance(false);
            return;
          }
        } else {
          // Update local state
          const newMap = new Map(sessionAttendanceMap);
          if (!newMap.has(sessionId)) {
            newMap.set(sessionId, new Set());
          }
          newMap.get(sessionId).add(userId);
          setSessionAttendanceMap(newMap);
        }
      } else {
        // Mark as absent - delete attendance log
        const { error } = await supabase
          .from("attendance_logs")
          .delete()
          .eq("user_id", userId)
          .eq("session_id", sessionId);

        if (error) {
          console.error("Error unmarking attendance:", error);
          alert("Failed to unmark attendance: " + (error.message || "Unknown error"));
          setMarkingAttendance(false);
          return;
        } else {
          // Update local state
          const newMap = new Map(sessionAttendanceMap);
          if (newMap.has(sessionId)) {
            newMap.get(sessionId).delete(userId);
            setSessionAttendanceMap(newMap);
          }
        }
      }

      // Refresh logs to keep data in sync
      const lg = await supabase.from("attendance_logs").select("*");
      if (!lg.error) {
        setLogs(lg.data || []);
        // Rebuild attendance map
        const attendanceMap = new Map();
        (lg.data || []).forEach(log => {
          if (!attendanceMap.has(log.session_id)) {
            attendanceMap.set(log.session_id, new Set());
          }
          attendanceMap.get(log.session_id).add(log.user_id);
        });
        setSessionAttendanceMap(attendanceMap);
      }
    } catch (err) {
      console.error("Error in attendance marking:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setMarkingAttendance(false);
    }
  };

  const toggleAllStudents = async (sessionId, markAllAsPresent) => {
    if (!sessionId || allStudents.length === 0) return;

    setMarkingAttendance(true);
    try {
      const studentsToProcess = attendanceSearchQuery
        ? allStudents.filter(s => 
            (s.full_name || "").toLowerCase().includes(attendanceSearchQuery.toLowerCase()) ||
            (s.branch || "").toLowerCase().includes(attendanceSearchQuery.toLowerCase())
          )
        : allStudents;

      if (markAllAsPresent) {
        // Mark all as present
        const newLogs = studentsToProcess
          .filter(s => !isStudentMarkedPresent(s.id, sessionId))
          .map(s => ({
            user_id: s.id,
            session_id: sessionId,
            checked_in_at: new Date().toISOString(),
          }));

        if (newLogs.length > 0) {
          const { error } = await supabase
            .from("attendance_logs")
            .insert(newLogs);

          if (error) {
            console.error("Error marking all attendance:", error);
            alert("Failed to mark all attendance. Some students may already be marked.");
          }
        }
      } else {
        // Mark all as absent
        const userIds = studentsToProcess.map(s => s.id);
        if (userIds.length > 0) {
          const { error } = await supabase
            .from("attendance_logs")
            .delete()
            .in("user_id", userIds)
            .eq("session_id", sessionId);

          if (error) {
            console.error("Error unmarking all attendance:", error);
            alert("Failed to unmark all attendance.");
          }
        }
      }

      // Refresh data
      await loadAll();
    } catch (err) {
      console.error("Error in bulk attendance marking:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setMarkingAttendance(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* MANUAL POINTS ADJUSTMENT                                                   */
  /* -------------------------------------------------------------------------- */
  
  const openPointsAdjustment = (leader) => {
    setSelectedUser(leader);
    setPointsAdjustment({ points: "", reason: "" });
  };

  const closePointsAdjustment = () => {
    setSelectedUser(null);
    setPointsAdjustment({ points: "", reason: "" });
  };

  const adjustUserPoints = async () => {
    if (!selectedUser || !pointsAdjustment.points) {
      alert("Please enter points to adjust.");
      return;
    }

    const pointsToAdd = Number(pointsAdjustment.points);
    if (isNaN(pointsToAdd) || pointsToAdd === 0) {
      alert("Please enter a valid number of points (positive or negative).");
      return;
    }

    setAdjustingPoints(true);

    try {
      // Get current leaderboard entry
      const { data: currentEntry, error: fetchError } = await supabase
        .from("leaderboard")
        .select("points")
        .eq("user_id", selectedUser.user_id)
        .single();

      if (fetchError) {
        console.error("Error fetching current points:", fetchError);
        alert("Failed to fetch current points. Please try again.");
        setAdjustingPoints(false);
        return;
      }

      const newPoints = Math.max(0, (currentEntry.points || 0) + pointsToAdd);

      // Calculate league based on points
      let newLeague = "Bronze";
      if (newPoints >= 8000) newLeague = "Legend";
      else if (newPoints >= 7000) newLeague = "Titan";
      else if (newPoints >= 6000) newLeague = "Champion";
      else if (newPoints >= 4500) newLeague = "Master";
      else if (newPoints >= 3000) newLeague = "Crystal";
      else if (newPoints >= 1500) newLeague = "Gold";
      else if (newPoints >= 500) newLeague = "Silver";

      // Update leaderboard - explicitly set league to ensure it's correct
      const { error: updateError } = await supabase
        .from("leaderboard")
        .update({
          points: newPoints,
          league: newLeague,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", selectedUser.user_id);

      if (updateError) {
        console.error("Error updating points:", updateError);
        alert("Failed to update points. Please try again.");
        setAdjustingPoints(false);
        return;
      }

      // Double-check: Force league recalculation via RPC call if available
      // This ensures league is correct even if trigger didn't fire
      const { error: rpcError } = await supabase.rpc('recalculate_user_league', {
        p_user_id: selectedUser.user_id
      });
      
      if (rpcError) {
        // RPC might not exist, that's okay - the update should have worked
        console.log("RPC call optional, continuing...");
      }

      // Refresh leaderboard data
      await loadAll();
      
      alert(
        `Successfully ${pointsToAdd > 0 ? "added" : "subtracted"} ${Math.abs(pointsToAdd)} points. ` +
        `New total: ${newPoints} points.`
      );

      closePointsAdjustment();
    } catch (err) {
      console.error("Error adjusting points:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setAdjustingPoints(false);
    }
  };

  // derived UI booleans
  const canPost = ann.title.trim() && ann.content.trim();
  const canAddChallenge = challenge.title.trim() && challenge.description.trim();
  const canCreateSession = session.title.trim() && session.session_date.trim();

  const filteredApplications = appQuery
    ? applications.filter(a => (a.full_name || a.email || "").toLowerCase().includes(appQuery.toLowerCase()))
    : applications;

  // Export applications as CSV (for quick admin use)
  const exportApplicationsCSV = () => {
    if (applicationsError) {
      alert(`Cannot export applications: ${applicationsError.status || ''} ${applicationsError.message || ''}. This likely means your Supabase RLS prevents reading the table. Check your Supabase RLS policies for 'applications'.`);
      return;
    }

    const rows = (filteredApplications || applications).map(a => ({
      id: a.id,
      name: a.full_name || "",
      email: a.email || "",
      github: a.github || "",
      message: a.why_join || "",
    }));

    if (rows.length === 0) {
      alert("No applications to export.");
      return;
    }

    const header = Object.keys(rows[0] || {}).join(",") + "\n";
    const body = rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const csv = header + body;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `applications_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  /* -------------------------------------------------------------------------- */
  /* LOADING                                                                    */
  /* -------------------------------------------------------------------------- */
  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="rounded-2xl border border-cyan-500/40 bg-slate-900/70 px-6 py-4 shadow-xl shadow-cyan-500/30">
          <p className="text-sm">Checking admin access…</p>
        </div>
      </main>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* UI                                                                         */
  /* -------------------------------------------------------------------------- */
  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      {/* Soft gradient background + glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.92),_transparent_60%)]" />
      </div>

      {/* SIDEBAR */}
      <aside className="hidden md:flex md:flex-col w-68 max-w-xs border-r border-white/10 bg-slate-950/80 backdrop-blur-xl px-5 py-6 gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-2">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/40">
            GX
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">GenXCode Admin</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              Control · Insights · Actions
            </p>
          </div>
        </div>

        {/* Quick search */}
        <div className="mt-2">
          <input
            placeholder="Search applications…"
            value={appQuery}
            onChange={(e) => setAppQuery(e.target.value)}
            className="w-full rounded-xl bg-slate-900/80 border border-slate-700/70 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400/60"
          />
          <p className="mt-1 text-[10px] text-slate-500">Filters only Applications tab.</p>
        </div>

        {/* Nav */}
        <div className="mt-4 flex-1 flex flex-col gap-1 text-[11px]">
          {[
            { id: "overview", label: "Overview", icon: "📊" },
            { id: "applications", label: "Applications", icon: "📝" },
            { id: "announcements", label: "Announcements", icon: "📢" },
            { id: "leaderboard", label: "Leaderboard", icon: "🏆" },
            { id: "challenges", label: "Challenges", icon: "💡" },
            { id: "submissions", label: "Submissions", icon: "✅" },
            { id: "attendance", label: "Attendance", icon: "📅" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-left transition
                ${
                  tab === item.id
                    ? "bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 border border-cyan-400/40 text-slate-50 shadow-[0_0_25px_rgba(34,211,238,0.35)]"
                    : "bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:border-cyan-400/40 hover:text-slate-50"
                }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </span>
              {tab === item.id && (
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500">
          <p className="font-mono text-[9px] text-slate-500">ADMIN CONSOLE</p>
          <p className="mt-0.5">Designed for GenXCode core team.</p>
        </div>
      </aside>

      {/* CONTENT */}
      <section className="flex-1 px-4 py-5 md:px-8 md:py-8 space-y-5">
        {/* Top header bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-1">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
              GenXCode · Admin Console
            </p>
            <h1 className="mt-1 text-xl md:text-2xl font-semibold tracking-tight">
              Ultra Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Review applications, manage challenges, announcements and sessions from a
              single, focused control surface.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-[10px] text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{loadingAll ? "Refreshing data…" : "Live Supabase data"}</span>
            </span>

            {debugAuth && (
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-[10px] text-slate-300">
                <span className="text-xs">ID: <span className="font-mono text-[10px] text-slate-400">{debugAuth.userId?.slice(0,8) || '—'}</span></span>
                <span className="text-xs">Role: <span className="font-medium text-emerald-300">{debugAuth.role || '—'}</span></span>
              </span>
            )}

            <button
              onClick={async () => { await fetchProfileDebug(); await loadAll(); }}
              disabled={loadingAll}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition
                ${loadingAll ? "border-slate-600 bg-slate-800/80 text-slate-400 cursor-wait" : "border-yellow-400/70 bg-yellow-500/10 text-yellow-200 hover:bg-yellow-500/20"}`}
            >
              Diagnostics
            </button>

            <button
              onClick={loadAll}
              disabled={loadingAll}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition
                ${
                  loadingAll
                    ? "border-slate-600 bg-slate-800/80 text-slate-400 cursor-wait"
                    : "border-cyan-400/70 bg-cyan-500/15 text-cyan-200 hover:bg-cyan-500/25"
                }`}
            >
              {loadingAll ? "Refreshing…" : "Refresh all"}
            </button>
          </div>
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="grid gap-4 md:grid-cols-4">
            {Object.entries(stats).map(([key, value]) => {
              const label = key.charAt(0).toUpperCase() + key.slice(1);
              const icon =
                key === "users"
                  ? "👥"
                  : key === "submissions"
                  ? "✅"
                  : key === "challenges"
                  ? "💡"
                  : "📢";
              return (
                <FrostCard key={key} className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-transparent to-fuchsia-500/15 opacity-60" />
                  <div className="relative flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-xs text-slate-300">
                        <span className="text-base">{icon}</span>
                        <span className="uppercase tracking-[0.18em] text-slate-400">
                          {label}
                        </span>
                      </span>
                    </div>
                    <p className="text-3xl font-semibold text-cyan-300">{value}</p>
                    <p className="text-[10px] text-slate-500">
                      Total {label.toLowerCase()} in the GenXCode ecosystem.
                    </p>
                  </div>
                </FrostCard>
              );
            })}
          </div>
        )}

        {/* APPLICATIONS */}
        {tab === "applications" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Member Applications</h2>
              <button
                onClick={exportApplicationsCSV}
                disabled={!!applicationsError || filteredApplications.length === 0}
                className={`px-3 py-1 rounded-lg text-sm ${applicationsError || filteredApplications.length === 0 ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-emerald-500/30'}`}
              >
                Export CSV
              </button>
            </div>
            {applicationsError && (
              <FrostCard>
                <div className="space-y-2">
                  <p className="text-sm text-amber-300">⚠️ Unable to read applications: <span className="font-mono">{applicationsError.status || ''}</span> <span className="font-mono">{applicationsError.message || ''}</span></p>
                  <p className="text-sm text-slate-400">This usually means Supabase Row-Level Security prevents the current user from selecting the `applications` table. If you are testing locally, you can promote a user to admin in the Supabase SQL editor by running the SQL below (replace the id):</p>
                  <pre className="mt-2 p-3 bg-slate-900/60 rounded text-xs font-mono text-slate-300">{`INSERT INTO public.profiles (id, role)
VALUES ('${debugAuth?.userId || '<user-id>'}', 'admin')
ON CONFLICT (id) DO UPDATE SET role='admin';`}</pre>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { navigator.clipboard?.writeText(`INSERT INTO public.profiles (id, role)\\nVALUES ('${debugAuth?.userId || '<user-id>'}', 'admin')\\nON CONFLICT (id) DO UPDATE SET role='admin';`); alert('SQL copied to clipboard'); }}
                      className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-300 text-xs"
                    >
                      Copy SQL
                    </button>
                    <button
                      onClick={async () => { await fetchProfileDebug(); await loadAll(); }}
                      className="px-3 py-1 rounded bg-yellow-500/10 text-yellow-200 text-xs"
                    >
                      Re-run diagnostics
                    </button>
                    {debugProfileError && (
                      <button
                        onClick={() => { navigator.clipboard?.writeText(JSON.stringify(debugProfileError)); alert('Profile error copied'); }}
                        className="px-3 py-1 rounded bg-slate-800 text-slate-200 text-xs"
                      >
                        Copy error
                      </button>
                    )}



                  </div>
                </div>
              </FrostCard>
            )}

            {filteredApplications.length === 0 ? (
              <FrostCard>
                <p className="text-sm text-slate-400">No applications found.</p>
              </FrostCard>
            ) : (
              <div className="space-y-3">
                {filteredApplications.map((app) => (
                  <FrostCard key={app.id}>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{app.full_name}</p>
                          <p className="text-xs text-slate-400">{app.email}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          app.status === "approved" ? "bg-emerald-500/20 text-emerald-300" :
                          app.status === "rejected" ? "bg-red-500/20 text-red-300" :
                          "bg-amber-500/20 text-amber-300"
                        }`}>
                          {app.status || "pending"}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-2 text-xs text-slate-300">
                        <p><span className="text-slate-500">Branch:</span> {app.branch || "—"}</p>
                        <p><span className="text-slate-500">Year:</span> {app.year || "—"}</p>
                        <p><span className="text-slate-500">Phone:</span> {app.phone || "—"}</p>
                        {app.github && (
                          <p>
                            <span className="text-slate-500">GitHub:</span>{" "}
                            <a href={app.github} target="_blank" rel="noreferrer" className="text-cyan-300 underline">
                              {app.github}
                            </a>
                          </p>
                        )}
                      </div>
                      {app.why_join && (
                        <div className="mt-2">
                          <p className="text-xs text-slate-500 mb-1">Why they want to join:</p>
                          <p className="text-xs text-slate-300 bg-slate-900/50 p-2 rounded">{app.why_join}</p>
                        </div>
                      )}
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleApproveApp(app)}
                          disabled={applicationsError || (app.status && app.status !== 'pending')}
                          className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded text-xs hover:bg-emerald-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectApp(app)}
                          disabled={applicationsError || (app.status && app.status !== 'pending')}
                          className="px-3 py-1 bg-red-500/20 text-red-300 rounded text-xs hover:bg-red-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </FrostCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ANNOUNCEMENTS */}
        {tab === "announcements" && (
          <div className="space-y-4">
            <FrostCard>
              <h2 className="text-lg font-semibold mb-2">Create announcement</h2>
              <form onSubmit={postAnnouncement} className="space-y-3">
                <Input
                  placeholder="Title"
                  value={ann.title}
                  onChange={(e) =>
                    setAnn((p) => ({ ...p, title: e.target.value }))
                  }
                />
                <TextArea
                  placeholder="Message"
                  rows={4}
                  value={ann.content}
                  onChange={(e) =>
                    setAnn((p) => ({ ...p, content: e.target.value }))
                  }
                />
                <button
                  disabled={!canPost}
                  aria-disabled={!canPost}
                  className={`px-4 py-2 rounded-lg bg-cyan-500/30 ${
                    !canPost ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Post announcement
                </button>
              </form>
            </FrostCard>

            {announcements.length > 0 && (
              <FrostCard>
                <h2 className="text-sm font-semibold mb-2">Recent announcements</h2>
                <div className="space-y-2 max-h-80 overflow-auto">
                  {announcements.map((a) => (
                    <div
                      key={a.id}
                      className="border border-white/10 rounded-xl px-3 py-2 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-slate-50">
                          {a.title || "Untitled"}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {a.created_at
                            ? new Date(a.created_at).toLocaleString()
                            : ""}
                        </span>
                      </div>
                      <p className="text-slate-300 line-clamp-3 whitespace-pre-line">
                        {a.content}
                      </p>
                    </div>
                  ))}
                </div>
              </FrostCard>
            )}
          </div>
        )}

        {/* LEADERBOARD */}
        {tab === "leaderboard" && (
          <div className="space-y-4">
            <FrostCard>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Leaderboard Management</h2>
                <p className="text-xs text-slate-400">
                  Click on any user to manually adjust points
                </p>
              </div>
              {leaders.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No leaderboard entries yet.
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-auto">
                  {leaders.slice(0, 50).map((row, idx) => {
                    const profile = profiles.find((p) => p.id === row.user_id);
                    const userName = profile?.full_name || "Unknown User";
                    const userInfo = profile
                      ? `${profile.branch || ""} ${profile.year || ""}`.trim() || ""
                      : "";

                    return (
                      <div
                        key={row.id}
                        className="flex items-center justify-between text-xs border border-white/10 rounded-xl px-3 py-2 hover:border-cyan-400/40 transition-colors cursor-pointer group"
                        onClick={() => openPointsAdjustment(row)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-50">
                              #{idx + 1} · {userName}
                            </p>
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30">
                              {row.league}
                            </span>
                          </div>
                          {userInfo && (
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {userInfo}
                            </p>
                          )}
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            ID: <span className="font-mono">{row.user_id?.slice(0, 8)}…</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-cyan-300">
                            {row.points} pts
                          </p>
                          <p className="text-[10px] text-slate-500">
                            updated{" "}
                            {row.updated_at
                              ? new Date(row.updated_at).toLocaleDateString()
                              : "-"}
                          </p>
                          <p className="text-[10px] text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                            Click to adjust →
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </FrostCard>

            {/* Manual Points Adjustment Modal */}
            {selectedUser && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Adjust Points</h3>
                    <button
                      onClick={closePointsAdjustment}
                      className="text-slate-400 hover:text-slate-200 text-xl"
                    >
                      ×
                    </button>
                  </div>

                  {(() => {
                    const profile = profiles.find((p) => p.id === selectedUser.user_id);
                    const userName = profile?.full_name || "Unknown User";
                    return (
                      <div className="space-y-4">
                        <div className="bg-slate-800/50 rounded-xl p-3 space-y-1">
                          <p className="text-sm font-semibold text-slate-50">
                            {userName}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span>Current: <span className="text-cyan-300 font-semibold">{selectedUser.points} pts</span></span>
                            <span>League: <span className="text-purple-300 font-semibold">{selectedUser.league}</span></span>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-slate-400 mb-1 block">
                            Points to adjust (positive to add, negative to subtract)
                          </label>
                          <Input
                            type="number"
                            placeholder="e.g., +50 or -20"
                            value={pointsAdjustment.points}
                            onChange={(e) =>
                              setPointsAdjustment((p) => ({
                                ...p,
                                points: e.target.value,
                              }))
                            }
                            className="text-base"
                          />
                          {pointsAdjustment.points && !isNaN(Number(pointsAdjustment.points)) && (
                            <p className="text-xs mt-1 text-slate-400">
                              New total:{" "}
                              <span className="text-cyan-300 font-semibold">
                                {Math.max(0, selectedUser.points + Number(pointsAdjustment.points))} pts
                              </span>
                              {selectedUser.points + Number(pointsAdjustment.points) < 0 && (
                                <span className="text-red-400 ml-2">(will be set to 0)</span>
                              )}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="text-xs text-slate-400 mb-1 block">
                            Reason (optional) - e.g., "Event participation", "Achievement unlocked"
                          </label>
                          <TextArea
                            placeholder="Why are you adjusting these points?"
                            rows={3}
                            value={pointsAdjustment.reason}
                            onChange={(e) =>
                              setPointsAdjustment((p) => ({
                                ...p,
                                reason: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={closePointsAdjustment}
                            className="flex-1 px-4 py-2 rounded-lg bg-slate-800/50 text-slate-200 hover:bg-slate-800 transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={adjustUserPoints}
                            disabled={adjustingPoints || !pointsAdjustment.points || Number(pointsAdjustment.points) === 0}
                            className={`flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border border-cyan-400/40 text-slate-50 font-medium transition ${
                              adjustingPoints || !pointsAdjustment.points || Number(pointsAdjustment.points) === 0
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:from-cyan-500/40 hover:to-purple-500/40"
                            }`}
                          >
                            {adjustingPoints ? "Adjusting..." : "Apply Adjustment"}
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              </div>
            )}
          </div>
        )}

        {/* CHALLENGES */}
        {tab === "challenges" && (
          <div className="space-y-4">
            <FrostCard>
              <h2 className="text-lg font-semibold mb-2">Create challenge</h2>
              <form onSubmit={addChallenge} className="space-y-3">
                <Input
                  placeholder="Title"
                  value={challenge.title}
                  onChange={(e) =>
                    setChallenge((p) => ({ ...p, title: e.target.value }))
                  }
                />
                <TextArea
                  placeholder="Description"
                  rows={3}
                  value={challenge.description}
                  onChange={(e) =>
                    setChallenge((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                />
                <div className="grid md:grid-cols-3 gap-3">
                  <Select
                    value={challenge.difficulty}
                    onChange={(e) =>
                      setChallenge((p) => ({
                        ...p,
                        difficulty: e.target.value,
                      }))
                    }
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Points"
                    value={challenge.points}
                    onChange={(e) =>
                      setChallenge((p) => ({
                        ...p,
                        points: Number(e.target.value),
                      }))
                    }
                  />
                  <label className="inline-flex items-center gap-2 text-xs text-slate-200">
                    <input
                      type="checkbox"
                      checked={challenge.is_active}
                      onChange={(e) =>
                        setChallenge((p) => ({
                          ...p,
                          is_active: e.target.checked,
                        }))
                      }
                    />
                    Active
                  </label>
                </div>
                <Input
                  placeholder="Tags (comma separated, e.g. react, api, beginner)"
                  value={challenge.tags}
                  onChange={(e) =>
                    setChallenge((p) => ({ ...p, tags: e.target.value }))
                  }
                />
                <Input
                  placeholder="GitHub template URL (optional)"
                  value={challenge.github_template}
                  onChange={(e) =>
                    setChallenge((p) => ({
                      ...p,
                      github_template: e.target.value,
                    }))
                  }
                />
                <TextArea
                  placeholder="Resources / notes (optional)"
                  rows={2}
                  value={challenge.resources}
                  onChange={(e) =>
                    setChallenge((p) => ({
                      ...p,
                      resources: e.target.value,
                    }))
                  }
                />
                <button
                  disabled={!canAddChallenge}
                  aria-disabled={!canAddChallenge}
                  className={`px-4 py-2 rounded-lg bg-cyan-500/30 ${
                    !canAddChallenge ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Add challenge
                </button>
              </form>
            </FrostCard>

            {challenges.length > 0 && (
              <FrostCard>
                <h2 className="text-sm font-semibold mb-2">Existing challenges</h2>
                <div className="space-y-2 max-h-80 overflow-auto">
                  {challenges.map((c) => (
                    <div
                      key={c.id}
                      className="border border-white/10 rounded-xl px-3 py-2 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-slate-50">
                          {c.title}{" "}
                          <span className="text-[10px] text-slate-400">
                            · {c.difficulty} · {c.points} pts
                          </span>
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] ${
                            c.is_active
                              ? "bg-emerald-500/20 text-emerald-200"
                              : "bg-slate-700/60 text-slate-200"
                          }`}
                        >
                          {c.is_active ? "Active" : "Hidden"}
                        </span>
                      </div>
                      {Array.isArray(c.tags) && c.tags.length > 0 && (
                        <p className="text-[10px] text-slate-400">
                          Tags: {c.tags.join(", ")}
                        </p>
                      )}
                      {c.github_template && (
                        <p className="text-[10px] text-cyan-300 truncate">
                          Template:{" "}
                          <a
                            href={c.github_template}
                            target="_blank"
                            rel="noreferrer"
                            className="underline"
                          >
                            {c.github_template}
                          </a>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </FrostCard>
            )}
          </div>
        )}

        {/* SUBMISSIONS */}
        {tab === "submissions" && (
          <div className="space-y-3">
            {submissions.length === 0 ? (
              <FrostCard>
                <p className="text-sm text-slate-400">No submissions yet.</p>
              </FrostCard>
            ) : (
              submissions.map((s) => (
                <FrostCard key={s.id}>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-50">
                          {s.challenges?.title || "Challenge"}
                        </p>
                        <p className="text-slate-400">
                          Difficulty: {s.challenges?.difficulty || "—"} · Base{" "}
                          {s.challenges?.points ?? 0} pts
                        </p>
                        <div className="mt-1 space-y-0.5">
                          <p className="text-[11px] text-slate-400">
                            <span className="text-slate-500">Submitted by:</span>{" "}
                            <span className="font-semibold text-cyan-300">
                              {s.profiles?.full_name || "Unknown User"}
                            </span>
                            {s.profiles?.branch && (
                              <span className="text-slate-500 ml-2">
                                ({s.profiles.branch}
                                {s.profiles.year && `, Year ${s.profiles.year}`})
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            ID: {s.user_id?.slice(0, 8)}…
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] ${
                            s.status === "approved"
                              ? "bg-emerald-500/20 text-emerald-200"
                              : s.status === "rejected"
                              ? "bg-red-500/20 text-red-200"
                              : "bg-amber-500/20 text-amber-200"
                          }`}
                        >
                          {s.status}
                        </span>
                        <p className="mt-1 text-[11px] text-slate-400">
                          Submitted{" "}
                          {s.submitted_at
                            ? new Date(s.submitted_at).toLocaleString()
                            : "-"}
                        </p>
                        {s.points_awarded > 0 && (
                          <p className="text-emerald-300 text-[11px] mt-1">
                            +{s.points_awarded} pts
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-cyan-300 truncate">
                      Repo:{" "}
                      <a
                        href={s.github_link}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        {s.github_link}
                      </a>
                    </p>

                    {s.feedback && (
                      <p className="text-[11px] text-slate-300">
                        <span className="text-slate-500">Feedback: </span>
                        {s.feedback}
                      </p>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => approveSubmission(s)}
                        disabled={s.status === "approved"}
                        className="px-3 py-1 bg-emerald-500/20 text-emerald-200 rounded-lg text-[11px] disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectSubmission(s)}
                        disabled={s.status === "rejected"}
                        className="px-3 py-1 bg-red-500/20 text-red-200 rounded-lg text-[11px] disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </FrostCard>
              ))
            )}
          </div>
        )}

        {/* ATTENDANCE */}
        {tab === "attendance" && (
          <div className="space-y-4">
            <FrostCard>
              <h2 className="text-lg font-semibold mb-2">Create attendance session</h2>
              <form onSubmit={createSession} className="space-y-3">
                <Input
                  placeholder="Session title"
                  value={session.title}
                  onChange={(e) =>
                    setSession((p) => ({ ...p, title: e.target.value }))
                  }
                />
                <Input
                  type="datetime-local"
                  value={session.session_date}
                  onChange={(e) =>
                    setSession((p) => ({
                      ...p,
                      session_date: e.target.value,
                    }))
                  }
                />
                <TextArea
                  placeholder="Description"
                  rows={3}
                  value={session.description}
                  onChange={(e) =>
                    setSession((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                />
                <button
                  disabled={!canCreateSession}
                  aria-disabled={!canCreateSession}
                  className={`px-4 py-2 bg-cyan-500/30 rounded-lg ${
                    !canCreateSession ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Create session
                </button>
              </form>
            </FrostCard>

            <FrostCard>
              <h2 className="text-sm font-semibold mb-2">Existing sessions</h2>
              {sessions.length === 0 ? (
                <p className="text-sm text-slate-400">No sessions created yet.</p>
              ) : (
                <div className="space-y-2 max-h-80 overflow-auto text-xs">
                  {sessions
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(b.session_date) - new Date(a.session_date)
                    )
                    .map((s) => {
                      const countForSession = logs.filter(
                        (l) => l.session_id === s.id
                      ).length;
                      return (
                        <div
                          key={s.id}
                          className="border border-white/10 rounded-xl px-3 py-2 space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-slate-50">
                              {s.title}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {new Date(s.session_date).toLocaleString()}
                            </p>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2">
                            {s.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] text-emerald-300">
                              {countForSession} check-in
                              {countForSession === 1 ? "" : "s"}
                            </p>
                            <button
                              onClick={() => handleSelectSessionForMarking(s.id)}
                              className="px-2 py-1 text-[10px] bg-cyan-500/20 text-cyan-300 rounded hover:bg-cyan-500/30 transition"
                            >
                              Mark Attendance
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </FrostCard>

            {/* Manual Attendance Marking Interface */}
            {selectedSessionForMarking && (
              <FrostCard>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">Mark Attendance</h2>
                    <p className="text-xs text-slate-400">
                      Session: {sessions.find(s => s.id === selectedSessionForMarking)?.title || "Unknown"}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {new Date(sessions.find(s => s.id === selectedSessionForMarking)?.session_date || "").toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedSessionForMarking(null)}
                    className="text-slate-400 hover:text-slate-200 text-xl"
                  >
                    ×
                  </button>
                </div>

                {/* Search and Bulk Actions */}
                <div className="mb-4 space-y-2">
                  <Input
                    placeholder="Search students by name or branch..."
                    value={attendanceSearchQuery}
                    onChange={(e) => setAttendanceSearchQuery(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAllStudents(selectedSessionForMarking, true)}
                      disabled={markingAttendance}
                      className="px-3 py-1.5 text-xs bg-emerald-500/20 text-emerald-300 rounded hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Mark All Present
                    </button>
                    <button
                      onClick={() => toggleAllStudents(selectedSessionForMarking, false)}
                      disabled={markingAttendance}
                      className="px-3 py-1.5 text-xs bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Mark All Absent
                    </button>
                  </div>
                </div>

                {/* Students List */}
                <div className="max-h-96 overflow-auto space-y-2">
                  {allStudents
                    .filter(s => 
                      !attendanceSearchQuery ||
                      (s.full_name || "").toLowerCase().includes(attendanceSearchQuery.toLowerCase()) ||
                      (s.branch || "").toLowerCase().includes(attendanceSearchQuery.toLowerCase()) ||
                      (s.year || "").toLowerCase().includes(attendanceSearchQuery.toLowerCase())
                    )
                    .map((student) => {
                      const isPresent = isStudentMarkedPresent(student.id, selectedSessionForMarking);
                      return (
                        <div
                          key={student.id}
                          className="flex items-center justify-between border border-white/10 rounded-xl px-3 py-2 hover:border-cyan-400/40 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-50">
                              {student.full_name || "Unknown"}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                              {student.branch && <span>{student.branch}</span>}
                              {student.year && <span>Year {student.year}</span>}
                              <span className="text-[10px] font-mono text-slate-500">
                                {student.id?.slice(0, 8)}…
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                isPresent
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                                  : "bg-slate-700/50 text-slate-400 border border-slate-600/50"
                              }`}
                            >
                              {isPresent ? "Present" : "Absent"}
                            </span>
                            <button
                              onClick={() => markStudentAttendance(student.id, selectedSessionForMarking, !isPresent)}
                              disabled={markingAttendance}
                              className={`px-3 py-1 text-xs rounded transition ${
                                isPresent
                                  ? "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                                  : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {isPresent ? "Mark Absent" : "Mark Present"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {allStudents.filter(s => 
                  !attendanceSearchQuery ||
                  (s.full_name || "").toLowerCase().includes(attendanceSearchQuery.toLowerCase()) ||
                  (s.branch || "").toLowerCase().includes(attendanceSearchQuery.toLowerCase())
                ).length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">
                    No students found.
                  </p>
                )}

                {markingAttendance && (
                  <div className="mt-4 text-center text-xs text-slate-400">
                    Updating attendance...
                  </div>
                )}
              </FrostCard>
            )}
          </div>
        )}

      </section>
    </main>
  );
}
