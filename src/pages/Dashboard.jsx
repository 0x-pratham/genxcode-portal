// FINAL FULL DASHBOARD — UPGRADE PACK A2 (Homepage Gradient + Circuit Tech Overlay)

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { motion, useReducedMotion } from "framer-motion";
void motion;

// ---------------- LEAGUE VISUAL CONFIG ------------------

const leagueBadges = {
  Bronze: "bg-amber-900/50 text-amber-200 border border-amber-500/40",
  Silver: "bg-slate-500/20 text-slate-100 border border-slate-300/40",
  Gold: "bg-yellow-500/20 text-yellow-100 border border-yellow-400/60",
  Crystal: "bg-cyan-500/15 text-cyan-100 border border-cyan-400/50",
  Master: "bg-emerald-500/15 text-emerald-100 border border-emerald-400/50",
  Champion: "bg-indigo-500/20 text-indigo-100 border border-indigo-400/60",
  Titan: "bg-purple-500/20 text-purple-100 border border-purple-400/60",
  Legend: "bg-fuchsia-500/20 text-fuchsia-100 border border-fuchsia-400/70",
};

const leagueOrder = [
  "Bronze",
  "Silver",
  "Gold",
  "Crystal",
  "Master",
  "Champion",
  "Titan",
  "Legend",
];

const leagueThresholds = {
  Bronze: 0,
  Silver: 500,
  Gold: 1500,
  Crystal: 3000,
  Master: 4500,
  Champion: 6000,
  Titan: 7000,
  Legend: 8000,
};

const leagueIcons = {
  Bronze: "🥉",
  Silver: "🥈",
  Gold: "🥇",
  Crystal: "💎",
  Master: "🧠",
  Champion: "🏆",
  Titan: "⚡",
  Legend: "👑",
};

const leagueImages = {
  Legend: "https://i.ibb.co/5hF3VvPt/legend.png",
  Titan: "https://i.ibb.co/5WtJTR9X/titan.png",
  Champion: "https://i.ibb.co/WWP1vgjD/Champion.png",
  Master: "https://i.ibb.co/SD6X0rXp/Master.png",
  Crystal: "https://i.ibb.co/zVN7CCXd/Crystal.png",
  Gold: "https://i.ibb.co/Mxzh052j/Gold.png",
  Silver: "https://i.ibb.co/678CCT6r/Silver-Gen-X.png",
  Bronze: "https://i.ibb.co/tM2cYgH7/Bronze-Gen-X.png",
};

// GLASS EFFECT
const glass =
  "bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-xl";

// ---------------- MAIN COMPONENT ------------------

export default function Dashboard() {
  const navigate = useNavigate();

  const reduce = useReducedMotion();

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [lbRow, setLbRow] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [sessionLogs, setSessionLogs] = useState([]);

  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [subsLoading, setSubsLoading] = useState(true);
  const [annLoading, setAnnLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(true);

  // ------------ LOAD EVERYTHING ------------

  // Load Leaderboard
  async function loadLeaderboard(uid) {
    if (!uid) return;
    setLeaderboardLoading(true);
    try {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .eq("user_id", uid)
        .single();
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error("Error loading leaderboard:", error);
      }
      setLbRow(data || null);
    } catch (err) {
      console.error("Error loading leaderboard:", err);
      setLbRow(null);
    } finally {
      setLeaderboardLoading(false);
    }
  }

  // Load Submissions
  async function loadSubmissions(uid) {
    if (!uid) return;
    setSubsLoading(true);
    try {
      const { data, error } = await supabase
        .from("submissions")
        .select(`
          id,
          status,
          github_link,
          points_awarded,
          submitted_at,
          feedback,
          challenges (title, difficulty, points)
        `)
        .eq("user_id", uid)
        .order("submitted_at", { ascending: false });

      if (error) {
        console.error("Error loading submissions:", error);
        setSubmissions([]);
      } else {
        setSubmissions(data || []);
      }
    } catch (err) {
      console.error("Error loading submissions:", err);
      setSubmissions([]);
    } finally {
      setSubsLoading(false);
    }
  }

  // Load Announcements
  async function loadAnnouncements() {
    setAnnLoading(true);
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error loading announcements:", error);
        setAnnouncements([]);
      } else {
        setAnnouncements(data || []);
      }
    } catch (err) {
      console.error("Error loading announcements:", err);
      setAnnouncements([]);
    } finally {
      setAnnLoading(false);
    }
  }

  // Load Attendance
  async function loadAttendance(uid) {
    if (!uid) return;
    setSessionLoading(true);
    try {
      const [sessionResult, logsResult] = await Promise.all([
        supabase
          .from("attendance_sessions")
          .select("*")
          .order("session_date", { ascending: false }),
        supabase
          .from("attendance_logs")
          .select("session_id, checked_in_at")
          .eq("user_id", uid)
      ]);

      if (sessionResult.error) {
        console.error("Error loading sessions:", sessionResult.error);
        setSessions([]);
      } else {
        setSessions(sessionResult.data || []);
      }

      if (logsResult.error) {
        console.error("Error loading attendance logs:", logsResult.error);
        setSessionLogs([]);
      } else {
        setSessionLogs(logsResult.data || []);
      }
    } catch (err) {
      console.error("Error loading attendance:", err);
      setSessions([]);
      setSessionLogs([]);
    } finally {
      setSessionLoading(false);
    }
  }

  // ------------ LOAD EVERYTHING (init) ------------
  useEffect(() => {
    const init = async () => {
      if (!supabase) {
        console.error("Supabase is not configured");
        navigate("/login");
        return;
      }

      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) return navigate("/login");

      const u = data.user;
      setUser(u);
      setLoadingUser(false);

      await Promise.all([
        loadLeaderboard(u.id),
        loadSubmissions(u.id),
        loadAnnouncements(),
        loadAttendance(u.id),
      ]);
      setLastUpdated(new Date().toISOString());
    };

    init();
  }, [navigate]);
  const [copied, setCopied] = useState(false);
  const copyProfileLink = async () => {
    try {
      const url = `${window.location.origin}/profile/${user?.id || ""}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // noop
    }
  };

  

  if (loadingUser) {
    return (
      <main className="min-h-screen flex items-center justify-center text-slate-300">
        Checking session…
      </main>
    );
  }

  if (!user) return null;

  // ------------ COMPUTE STATS ------------
  const totalPoints = lbRow?.points || 0;
  const league = lbRow?.league || "Bronze";

  const approvedSubs = submissions.filter(
    (s) => s.status?.toLowerCase() === "approved"
  ).length;

  const leagueIndex = leagueOrder.indexOf(league);
  const currentLeague = leagueIndex === -1 ? "Bronze" : league;
  const nextLeague =
    leagueIndex < leagueOrder.length - 1
      ? leagueOrder[leagueIndex + 1]
      : null;

  const currentMin = leagueThresholds[currentLeague];
  const nextMin = nextLeague ? leagueThresholds[nextLeague] : null;

  const progressPct = nextMin
    ? Math.round(
        ((totalPoints - currentMin) / (nextMin - currentMin)) * 100
      )
    : 100;

  const pointsNeeded = nextMin ? Math.max(0, nextMin - totalPoints) : 0;

  const attendedSet = new Set(sessionLogs.map((l) => l.session_id));
  const attendedCount = sessions.filter((s) => attendedSet.has(s.id)).length;
  const attendanceRate =
    sessions.length > 0
      ? Math.round((attendedCount / sessions.length) * 100)
      : null;

  const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  const displayName =
    lbRow?.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "User";

  // ------------------------ UI START ------------------------

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen text-slate-100 relative overflow-hidden"

      // 🌈 FULL BACKGROUND: Neon Gradient + Circuit Tech Overlay
      style={{
        background:
          "radial-gradient(circle at 20% 20%, rgba(0,255,255,0.18), transparent 60%), radial-gradient(circle at 80% 80%, rgba(180,0,255,0.22), transparent 60%), #020617",
      }}
    >
      {/* 🟦 CIRCUIT ANIMATED OVERLAY */}
      <motion.div
        className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('/circuit.svg')]"
        animate={!reduce ? { backgroundPosition: ["0% 0%", "100% 100%"] } : {}}
        transition={!reduce ? { duration: 22, repeat: Infinity, ease: "linear" } : {}}
      />

      {/* 🌫 GRADIENT AURA LIGHTS */}
      <motion.div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-500/20 blur-[200px] rounded-full"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-fuchsia-600/20 blur-[220px] rounded-full"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* ----- PAGE CONTENT ----- */}
      <div className="container-page pt-10 space-y-10 relative">

        {/* ---------------------------------------------------------------- */}
        {/* HEADER */}
        {/* ---------------------------------------------------------------- */}

        <motion.header
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between gap-4"
        >
          <div>
            <p className="text-xs text-slate-400">Welcome back,</p>
            <h1 className="text-3xl font-semibold bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              {displayName}
            </h1>
            <p className="text-sm text-slate-400">
              Logged in as <span className="text-cyan-300">{user.email}</span>
            </p>
          </div>

          <div className="flex gap-3">
            <Link to="/challenges">
              <button className="btn-primary px-4 py-2 text-xs rounded-full">
                View challenges ↗
              </button>
            </Link>

            <Link to="/leaderboard">
              <button className="btn-outline px-4 py-2 text-xs rounded-full">
                Leaderboard
              </button>
            </Link>
            <span className="text-xs text-slate-400 self-center">
              Updated {lastUpdated ? new Date(lastUpdated).toLocaleString() : "—"}
            </span>
          </div>
        </motion.header>

        {/* ---------------------------------------------------------------- */}
        {/* STATS */}
        {/* ---------------------------------------------------------------- */}

        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-4 gap-4"
        >
          {/* LEAGUE CARD */}
          <motion.div
            className={`relative px-6 py-5 rounded-2xl overflow-hidden ${glass} md:col-span-2`}
            whileHover={{ scale: 1.03, y: -6 }}
          >
            {/* Subtle circuit bg inside card */}
            <div className="absolute inset-0 opacity-[0.05] bg-[url('/circuit.svg')]" />

            {/* Glow sweep */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-fuchsia-500/10"
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 6, repeat: Infinity }}
            />

            <div className="relative flex items-center gap-5">
                <motion.img
                  src={leagueImages[league]}
                  loading="lazy"
                  className="h-16 w-16 drop-shadow-[0_0_25px_rgba(0,200,255,0.5)]"
                  animate={!reduce ? { scale: [1, 1.05, 1] } : {}}
                  transition={!reduce ? { duration: 2.5, repeat: Infinity } : {}}
                />

              <div>
                <span className={`px-3 py-1 rounded-full text-xs ${leagueBadges[league]}`}>
                  {leagueIcons[league]} {league}
                </span>

                <p className="text-xs text-slate-400 mt-1">
                  {totalPoints} pts · Next:{" "}
                  <span className="text-cyan-300">{nextLeague || "Maxed"}</span>
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Progress</span>
                <span className="text-cyan-300 font-semibold">{progressPct}%</span>
              </div>

              <motion.div className="h-2 bg-slate-900 rounded-full mt-1 overflow-hidden" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 shadow-[0_0_20px_rgba(0,200,255,0.5)]"
                />
              </motion.div>

              <p className="text-[10px] text-slate-500 mt-1">
                {nextLeague
                  ? `Need ${pointsNeeded} pts to reach ${nextLeague}.`
                  : "You reached the highest league!"}
              </p>
            </div>
          </motion.div>

          {/* POINTS CARD */}
          <motion.div className={`${glass} card px-5 py-4 rounded-2xl`} whileHover={{ scale: 1.03, y: -6 }}>
            <p className="text-xs text-slate-400">Total points</p>
            <p className="text-2xl font-semibold text-cyan-300">{totalPoints}</p>
          </motion.div>

          {/* APPROVED SUBMISSIONS */}
          <motion.div className={`${glass} card px-5 py-4 rounded-2xl`} whileHover={{ scale: 1.03, y: -6 }}>
            <p className="text-xs text-slate-400">Approved submissions</p>
            <p className="text-2xl font-semibold text-emerald-300">{approvedSubs}</p>
          </motion.div>
        </motion.section>

        {/* ---------------------------------------------------------------- */}
        {/* SUBMISSIONS */}
        {/* ---------------------------------------------------------------- */}

        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold mb-2">Your submissions</h2>

          {subsLoading ? (
            <div className="card px-5 py-5 text-center text-slate-300">
              <div className="space-y-2">
                <div className="h-3 bg-slate-800 rounded w-3/4 mx-auto animate-pulse" />
                <div className="h-3 bg-slate-800 rounded w-2/3 mx-auto animate-pulse" />
              </div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="card px-5 py-5 text-center text-slate-300">
              You have no submissions yet.
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.slice(0, 6).map((s, idx) => {
                const diffColor =
                  s.challenges?.difficulty === "easy"
                    ? "text-emerald-300"
                    : s.challenges?.difficulty === "medium"
                    ? "text-yellow-300"
                    : "text-red-300";

                const statusColor =
                  s.status === "approved"
                    ? "text-emerald-300"
                    : s.status === "rejected"
                    ? "text-red-300"
                    : "text-amber-300";

                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.07 }}
                    whileHover={{
                      y: -6,
                      scale: 1.015,
                      boxShadow: "0px 0px 25px rgba(0, 200, 255, 0.25)",
                    }}
                    className={`relative card px-5 py-4 overflow-hidden rounded-xl shadow-lg ${glass}`}
                  >
                    {/* Neon stripe */}
                    <motion.div
                      className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-400 to-fuchsia-500 opacity-60"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />

                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-sm font-semibold">
                          {s.challenges?.title || "Challenge"}
                        </h3>

                        <p className="text-[11px] text-slate-400">
                          Difficulty: <span className={diffColor}>{s.challenges?.difficulty}</span>
                          {" • "}
                          Base: {s.challenges?.points ?? 0} pts
                        </p>

                        <p className="text-[10px] text-slate-500">
                          Submitted: {new Date(s.submitted_at).toLocaleString()}
                        </p>

                        {s.github_link && (
                          <a
                            href={s.github_link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-300 underline text-xs block mt-1"
                          >
                            {s.github_link}
                          </a>
                        )}
                      </div>

                      <div className="text-right">
                        <span className={`text-xs font-semibold ${statusColor}`}>
                          {s.status}
                        </span>

                        {s.points_awarded > 0 && (
                          <p className="text-emerald-300 text-xs mt-1">
                            +{s.points_awarded} pts
                          </p>
                        )}
                      </div>
                    </div>

                    {s.feedback && (
                      <p className="text-[11px] text-slate-300 mt-2">
                        <span className="text-slate-500">Feedback: </span>
                        {s.feedback}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.section>

        {/* ---------------------------------------------------------------- */}
        {/* ATTENDANCE */}
        {/* ---------------------------------------------------------------- */}

        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.25 }}
          className="grid md:grid-cols-3 gap-4"
        >
          <motion.div
            className={`card px-5 py-4 space-y-3 relative overflow-hidden md:col-span-2 ${glass}`}
            whileHover={{ scale: 1.01, y: -3 }}
          >
            {/* animated glow */}
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-2xl
                bg-gradient-to-br from-cyan-500/25 via-slate-900 to-fuchsia-500/25
                blur opacity-0"
              animate={{ opacity: [0.1, 0.35, 0.1] }}
              transition={{ duration: 6, repeat: Infinity }}
            />

            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold">Session attendance</p>
                <span className="text-[10px] text-slate-500">
                  Admin-verified only
                </span>
              </div>

              {sessionLoading ? (
                <p className="text-xs text-slate-400">Loading attendance…</p>
              ) : sessions.length === 0 ? (
                <p className="text-xs text-slate-400">No sessions created yet.</p>
              ) : (
                <>
                  <p className="text-xs text-slate-400">
                    Attended{" "}
                    <span className="text-emerald-300 font-semibold">{attendedCount}</span>
                    {" / "}
                    <span className="text-slate-100 font-semibold">{sessions.length}</span>
                    {" "}
                    sessions{" "}
                    {attendanceRate !== null && (
                      <span className="text-cyan-300 font-semibold">
                        ({attendanceRate}%)
                      </span>
                    )}
                  </p>

                  <p className="text-xs text-slate-400">
                    Missed{" "}
                    <span className="text-amber-300 font-semibold">
                      {sessions.length - attendedCount}
                    </span>
                  </p>

                  {/* Recent Sessions */}
                  <div className="mt-3 border border-slate-800/80 rounded-xl
                    divide-y divide-slate-800/80 bg-slate-950/70"
                  >
                    <div className="px-3 py-2 flex justify-between text-[11px] text-slate-400">
                      <span>Recent sessions</span>
                      <span>Status</span>
                    </div>

                    {sessions.slice(0, 5).map((s) => {
                      const attended = attendedSet.has(s.id);
                      return (
                        <div
                          key={s.id}
                          className="px-3 py-2 flex justify-between text-[11px]"
                        >
                          <div>
                            <p className="text-slate-100 line-clamp-1">{s.title}</p>
                            <p className="text-slate-500">
                              {new Date(s.session_date).toLocaleString()}
                            </p>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded-full font-medium ${
                              attended
                                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-400/30"
                                : "bg-red-500/10 text-red-300 border border-red-400/20"
                            }`}
                          >
                            {attended ? "Attended" : "Missed"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Tip Card */}
          <motion.div
            className={`card px-5 py-4 space-y-2 ${glass}`}
            whileHover={{ scale: 1.02, y: -3 }}
          >
            <p className="text-sm font-semibold">Tip</p>
            <p className="text-xs text-slate-400">
              Join more sessions to increase attendance rate and climb leagues faster.
            </p>
          </motion.div>
        </motion.section>

        {/* ---------------------------------------------------------------- */}
        {/* RIGHT SIDEBAR */}
        {/* ---------------------------------------------------------------- */}

        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.28 }}
          className="grid gap-6 lg:grid-cols-[2fr,1.2fr] items-start"
        >
          <div className="space-y-5">

            {/* ANNOUNCEMENTS */}
            <motion.div
              className={`card px-5 py-4 space-y-3 relative overflow-hidden ${glass}`}
              whileHover={{ scale: 1.02, y: -3 }}
            >
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br
                  from-cyan-500/20 via-slate-900 to-purple-500/20 blur"
                animate={{ opacity: [0.15, 0.35, 0.15] }}
                transition={{ duration: 5, repeat: Infinity }}
              />

              <h2 className="text-base font-semibold relative">Latest announcements</h2>

              {annLoading ? (
                <p className="text-xs text-slate-400">Loading…</p>
              ) : announcements.length === 0 ? (
                <p className="text-xs text-slate-400">No announcements yet.</p>
              ) : (
                <div className="space-y-3 relative">
                  {announcements.map((a, idx) => (
                    <motion.article
                      key={a.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: idx * 0.07 }}
                      className="border-b border-slate-800/80 pb-2 last:border-0"
                    >
                      <p className="text-sm font-medium">{a.title}</p>

                      <p className="text-[10px] text-slate-500">
                        {new Date(a.created_at).toLocaleString()}
                      </p>

                      <p className="text-[11px] text-slate-300 mt-1 line-clamp-3">
                        {a.content}
                      </p>
                    </motion.article>
                  ))}
                </div>
              )}

              <Link to="/announcements" className="text-[11px] text-cyan-300 underline">
                View all →
              </Link>
            </motion.div>

            {/* PROFILE SNAPSHOT */}
            <motion.div
              className={`card px-5 py-4 space-y-3 ${glass}`}
              whileHover={{ scale: 1.02, y: -3 }}
            >
              <h2 className="text-base font-semibold">Profile snapshot</h2>

              <div className="text-xs space-y-1 mt-1">
                <p>
                  <span className="text-slate-500">Name: </span>
                  {lbRow?.full_name || user.user_metadata?.full_name || "—"}
                </p>

                <p>
                  <span className="text-slate-500">Branch: </span>
                  {lbRow?.branch || user.user_metadata?.branch || "—"}
                </p>

                <p>
                  <span className="text-slate-500">Year: </span>
                  {lbRow?.year || user.user_metadata?.year || "—"}
                </p>

                <p className="break-all">
                  <span className="text-slate-500">GitHub: </span>
                  {(lbRow?.github || user.user_metadata?.github) ? (
                    <a
                      href={lbRow?.github || user.user_metadata?.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-300 underline"
                    >
                      {lbRow?.github || user.user_metadata?.github}
                    </a>
                  ) : "—"}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <button onClick={copyProfileLink} className="px-3 py-1 rounded-lg bg-cyan-500/30 text-xs">Copy profile link</button>
                  {copied && <span className="text-emerald-300 text-xs">Copied!</span>}
                </div>
              </div>
            </motion.div>

            {/* LEAGUE LADDER */}
            <motion.div
              className={`card px-5 py-4 space-y-3 ${glass}`}
              whileHover={{ scale: 1.02, y: -3 }}
            >
              <h2 className="text-sm font-semibold">League Ladder</h2>
              <p className="text-[11px] text-slate-400">Track your progression.</p>

              <div className="space-y-2">
                {leagueOrder.map((lg) => {
                  const min = leagueThresholds[lg];
                  const isCurrent = lg === currentLeague;
                  const unlocked = totalPoints >= min;

                  return (
                    <motion.div
                      key={lg}
                      whileHover={{ scale: isCurrent ? 1.03 : 1.01 }}
                      className={`
                        flex items-center justify-between px-2 py-1.5 text-[11px]
                        rounded-lg border
                        ${
                          isCurrent
                            ? "bg-cyan-500/10 border-cyan-400/60 shadow-md shadow-cyan-500/20"
                            : unlocked
                            ? "bg-emerald-500/10 border-emerald-400/40"
                            : "bg-slate-900/60 border-slate-700/80"
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={leagueImages[lg]}
                          alt={lg}
                          className="h-5 w-5 object-contain"
                        />
                        <span>{lg}</span>

                        {isCurrent && (
                          <span className="ml-1 rounded-full bg-cyan-500/20 text-cyan-200 px-2 py-0.5 border border-cyan-400/40">
                            Current
                          </span>
                        )}

                        {!isCurrent && unlocked && (
                          <span className="ml-1 rounded-full bg-emerald-500/20 text-emerald-200 px-2 py-0.5 border border-emerald-400/40">
                            Unlocked
                          </span>
                        )}
                      </div>

                      <span className="text-slate-400">{min} pts</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </motion.main>
  );
}
