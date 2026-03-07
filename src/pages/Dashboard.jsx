// Dashboard — UI/UX improvements
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

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

const leagueOrder = ["Bronze", "Silver", "Gold", "Crystal", "Master", "Champion", "Titan", "Legend"];
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

const glass = "bg-slate-900/60 backdrop-blur-xl border border-slate-700/60 shadow-xl";

export default function Dashboard() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [copied, setCopied] = useState(false);

  const [lbRow, setLbRow] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [sessionLogs, setSessionLogs] = useState([]);

  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [subsLoading, setSubsLoading] = useState(true);
  const [annLoading, setAnnLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(true);

  async function loadLeaderboard(uid) {
    if (!uid) return;
    setLeaderboardLoading(true);
    try {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .eq("user_id", uid)
        .single();
      if (error && error.code !== "PGRST116") console.error("Error loading leaderboard:", error);
      setLbRow(data || null);
    } catch (err) {
      setLbRow(null);
    } finally {
      setLeaderboardLoading(false);
    }
  }

  async function loadSubmissions(uid) {
    if (!uid) return;
    setSubsLoading(true);
    try {
      const { data, error } = await supabase
        .from("submissions")
        .select(`
          id, status, github_link, points_awarded, submitted_at, feedback,
          challenges (title, difficulty, points)
        `)
        .eq("user_id", uid)
        .order("submitted_at", { ascending: false });
      setSubmissions(error ? [] : data || []);
    } catch {
      setSubmissions([]);
    } finally {
      setSubsLoading(false);
    }
  }

  async function loadAnnouncements() {
    setAnnLoading(true);
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      setAnnouncements(error ? [] : data || []);
    } catch {
      setAnnouncements([]);
    } finally {
      setAnnLoading(false);
    }
  }

  async function loadAttendance(uid) {
    if (!uid) return;
    setSessionLoading(true);
    try {
      const [sessionResult, logsResult] = await Promise.all([
        supabase.from("attendance_sessions").select("*").order("session_date", { ascending: false }),
        supabase.from("attendance_logs").select("session_id, checked_in_at").eq("user_id", uid),
      ]);
      setSessions(sessionResult.error ? [] : sessionResult.data || []);
      setSessionLogs(logsResult.error ? [] : logsResult.data || []);
    } catch {
      setSessions([]);
      setSessionLogs([]);
    } finally {
      setSessionLoading(false);
    }
  }

  useEffect(() => {
    const init = async () => {
      if (!supabase) {
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

  const copyProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/profile/${user?.id || ""}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  if (loadingUser) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4 text-slate-400"
        >
          <div className="h-8 w-8 rounded-full border-2 border-cyan-500/50 border-t-cyan-400 animate-spin" />
          <p className="text-sm">Checking session…</p>
        </motion.div>
      </main>
    );
  }

  if (!user) return null;

  const totalPoints = lbRow?.points || 0;
  const league = lbRow?.league || "Bronze";
  const approvedSubs = submissions.filter((s) => s.status?.toLowerCase() === "approved").length;
  const leagueIndex = leagueOrder.indexOf(league);
  const currentLeague = leagueIndex === -1 ? "Bronze" : league;
  const nextLeague = leagueIndex < leagueOrder.length - 1 ? leagueOrder[leagueIndex + 1] : null;
  const currentMin = leagueThresholds[currentLeague];
  const nextMin = nextLeague ? leagueThresholds[nextLeague] : null;
  const progressPct = nextMin ? Math.round(((totalPoints - currentMin) / (nextMin - currentMin)) * 100) : 100;
  const pointsNeeded = nextMin ? Math.max(0, nextMin - totalPoints) : 0;

  const attendedSet = new Set(sessionLogs.map((l) => l.session_id));
  const attendedCount = sessions.filter((s) => attendedSet.has(s.id)).length;
  const attendanceRate = sessions.length > 0 ? Math.round((attendedCount / sessions.length) * 100) : null;

  const displayName =
    lbRow?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

  const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };
  const stagger = { staggerChildren: 0.06, delayChildren: 0.1 };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen text-slate-100 relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 pb-24"
    >
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-[120px]" />
      </div>

      <div className="container-page pt-8 sm:pt-10 space-y-8 relative z-10">
        {/* Header */}
        <motion.header
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Welcome back</p>
            <h1 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              {displayName}
            </h1>
            <p className="text-sm text-slate-500 truncate max-w-xs">
              {user.email}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link to="/challenges">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary px-4 py-2.5 text-sm rounded-xl"
              >
                View challenges ↗
              </motion.button>
            </Link>
            <Link to="/leaderboard">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-outline px-4 py-2.5 text-sm rounded-xl"
              >
                Leaderboard
              </motion.button>
            </Link>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Updated {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : "—"}
            </span>
          </div>
        </motion.header>

        {/* Stats grid */}
        <motion.section
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* League card (spans 2 on lg) */}
          <motion.div
            variants={fadeUp}
            className={`relative rounded-2xl overflow-hidden ${glass} p-5 lg:col-span-2`}
            whileHover={!reduce ? { y: -4, scale: 1.01 } : {}}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <motion.img
                  src={leagueImages[league]}
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-contain ring-2 ring-slate-600/50"
                  animate={!reduce ? { scale: [1, 1.03, 1] } : {}}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium ${leagueBadges[league]}`}>
                    {leagueIcons[league]} {league}
                  </span>
                  <p className="text-sm text-slate-400 mt-1">
                    {totalPoints} pts
                    {nextLeague && (
                      <span className="text-cyan-300 ml-1">
                        · {pointsNeeded} to {nextLeague}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex-1 sm:min-w-[200px]">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Progress to {nextLeague || "max"}</span>
                  <span className="text-cyan-300 font-semibold">{progressPct}%</span>
                </div>
                <div className="h-2.5 bg-slate-800/80 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                  />
                </div>
                {nextLeague && (
                  <p className="text-[10px] text-slate-500 mt-1">
                    Need {pointsNeeded} pts to reach {nextLeague}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Points */}
          <motion.div
            variants={fadeUp}
            className={`${glass} rounded-2xl p-5 flex flex-col justify-center`}
            whileHover={!reduce ? { y: -4, scale: 1.01 } : {}}
          >
            <p className="text-xs text-slate-400 mb-1">Total points</p>
            <p className="text-3xl font-bold text-cyan-300 tabular-nums">{totalPoints}</p>
          </motion.div>

          {/* Submissions */}
          <motion.div
            variants={fadeUp}
            className={`${glass} rounded-2xl p-5 flex flex-col justify-center`}
            whileHover={!reduce ? { y: -4, scale: 1.01 } : {}}
          >
            <p className="text-xs text-slate-400 mb-1">Approved submissions</p>
            <p className="text-3xl font-bold text-emerald-300 tabular-nums">{approvedSubs}</p>
          </motion.div>
        </motion.section>

        {/* Main content grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
          {/* Left column: Submissions + Attendance */}
          <div className="space-y-8">
            {/* Submissions */}
            <motion.section
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Your submissions</h2>
                {submissions.length > 0 && (
                  <span className="text-xs text-slate-500">{submissions.length} total</span>
                )}
              </div>

              {subsLoading ? (
                <div className="space-y-3">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={`rounded-xl ${glass} p-4 animate-pulse`}>
                      <div className="h-4 w-3/4 rounded bg-slate-800 mb-3" />
                      <div className="h-3 w-1/2 rounded bg-slate-800" />
                    </div>
                  ))}
                </div>
              ) : submissions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`rounded-2xl ${glass} p-8 text-center`}
                >
                  <p className="text-3xl mb-2">📤</p>
                  <h3 className="text-base font-medium text-slate-200 mb-1">No submissions yet</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Solve challenges and submit your solutions to earn points.
                  </p>
                  <Link to="/challenges">
                    <button className="btn-primary px-4 py-2 text-sm rounded-xl">
                      Browse challenges
                    </button>
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {submissions.slice(0, 6).map((s, idx) => {
                      const diffColor =
                        s.challenges?.difficulty === "easy"
                          ? "text-emerald-300"
                          : s.challenges?.difficulty === "medium"
                          ? "text-amber-300"
                          : "text-rose-300";
                      const statusStyles =
                        s.status === "approved"
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/40"
                          : s.status === "rejected"
                          ? "bg-rose-500/15 text-rose-300 border-rose-400/40"
                          : "bg-amber-500/15 text-amber-300 border-amber-400/40";

                      return (
                        <motion.div
                          key={s.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          whileHover={!reduce ? { y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.3)" } : {}}
                          className={`rounded-xl ${glass} p-4 transition-shadow`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-slate-100 truncate">
                                {s.challenges?.title || "Challenge"}
                              </h3>
                              <p className="text-xs text-slate-400 mt-0.5">
                                <span className={diffColor}>{s.challenges?.difficulty || "—"}</span>
                                {" · "}
                                Base: {s.challenges?.points ?? 0} pts
                              </p>
                              <p className="text-[11px] text-slate-500 mt-1">
                                {new Date(s.submitted_at).toLocaleDateString()}
                              </p>
                              {s.github_link && (
                                <a
                                  href={s.github_link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-cyan-300 hover:text-cyan-200 truncate block mt-1"
                                >
                                  {s.github_link}
                                </a>
                              )}
                              {s.feedback && (
                                <p className="text-xs text-slate-400 mt-2 italic">
                                  {s.feedback}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${statusStyles}`}>
                                {s.status}
                              </span>
                              {s.points_awarded > 0 && (
                                <span className="text-sm font-semibold text-emerald-300">
                                  +{s.points_awarded}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </motion.section>

            {/* Attendance */}
            <motion.section
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <h2 className="text-lg font-semibold mb-4">Session attendance</h2>
              <div className={`rounded-2xl ${glass} p-5`}>
                {sessionLoading ? (
                  <p className="text-sm text-slate-400">Loading…</p>
                ) : sessions.length === 0 ? (
                  <p className="text-sm text-slate-400">No sessions created yet.</p>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-slate-300">
                        <span className="text-emerald-300 font-semibold">{attendedCount}</span>
                        {" / "}
                        <span className="font-semibold">{sessions.length}</span>
                        {" sessions"}
                        {attendanceRate !== null && (
                          <span className="text-cyan-300 ml-1">({attendanceRate}%)</span>
                        )}
                      </p>
                      {sessions.length - attendedCount > 0 && (
                        <span className="text-xs text-amber-300">
                          {sessions.length - attendedCount} missed
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {sessions.slice(0, 5).map((sess) => {
                        const attended = attendedSet.has(sess.id);
                        return (
                          <div
                            key={sess.id}
                            className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-900/50 border border-slate-800/60"
                          >
                            <div>
                              <p className="text-sm font-medium text-slate-200 truncate">{sess.title}</p>
                              <p className="text-[11px] text-slate-500">
                                {new Date(sess.session_date).toLocaleDateString()}
                              </p>
                            </div>
                            <span
                              className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                attended
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                                  : "bg-rose-500/10 text-rose-300 border border-rose-400/20"
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
            </motion.section>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Announcements */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.15 }}
              className={`rounded-2xl ${glass} p-5`}
            >
              <h2 className="text-base font-semibold mb-3">Latest announcements</h2>
              {annLoading ? (
                <p className="text-xs text-slate-400">Loading…</p>
              ) : announcements.length === 0 ? (
                <p className="text-sm text-slate-400">No announcements yet.</p>
              ) : (
                <div className="space-y-3">
                  {announcements.map((a) => (
                    <article key={a.id} className="border-b border-slate-800/60 pb-3 last:border-0">
                      <p className="text-sm font-medium text-slate-200">{a.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {new Date(a.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{a.content}</p>
                    </article>
                  ))}
                </div>
              )}
              <Link to="/announcements" className="inline-block text-xs text-cyan-300 hover:text-cyan-200 mt-2">
                View all →
              </Link>
            </motion.div>

            {/* Profile snapshot */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`rounded-2xl ${glass} p-5`}
            >
              <h2 className="text-base font-semibold mb-3">Profile snapshot</h2>
              <div className="text-xs space-y-2 text-slate-300">
                <p><span className="text-slate-500">Name:</span> {lbRow?.full_name || user.user_metadata?.full_name || "—"}</p>
                <p><span className="text-slate-500">Branch:</span> {lbRow?.branch || user.user_metadata?.branch || "—"}</p>
                <p><span className="text-slate-500">Year:</span> {lbRow?.year || user.user_metadata?.year || "—"}</p>
                <p className="break-all">
                  <span className="text-slate-500">GitHub: </span>
                  {(lbRow?.github || user.user_metadata?.github) ? (
                    <a
                      href={lbRow?.github || user.user_metadata?.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-300 hover:underline"
                    >
                      {(lbRow?.github || user.user_metadata?.github).replace("https://", "")}
                    </a>
                  ) : (
                    "—"
                  )}
                </p>
                <motion.button
                  onClick={copyProfileLink}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-3 w-full px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-medium hover:bg-cyan-500/30 transition"
                >
                  {copied ? "✓ Copied!" : "Copy profile link"}
                </motion.button>
              </div>
            </motion.div>

            {/* League ladder */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.25 }}
              className={`rounded-2xl ${glass} p-5`}
            >
              <h2 className="text-base font-semibold mb-2">League ladder</h2>
              <p className="text-xs text-slate-400 mb-3">Track your progression</p>
              <div className="space-y-1.5">
                {leagueOrder.map((lg) => {
                  const isCurrent = lg === currentLeague;
                  const unlocked = totalPoints >= leagueThresholds[lg];
                  return (
                    <div
                      key={lg}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs ${
                        isCurrent
                          ? "bg-cyan-500/15 border border-cyan-400/40"
                          : unlocked
                          ? "bg-emerald-500/10 border border-emerald-400/30"
                          : "bg-slate-900/50 border border-slate-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{leagueIcons[lg]}</span>
                        <span>{lg}</span>
                        {isCurrent && <span className="text-cyan-300 text-[10px] font-medium">Current</span>}
                      </div>
                      <span className="text-slate-400 tabular-nums">{leagueThresholds[lg]} pts</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Tip */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`rounded-xl border border-slate-700/60 bg-slate-900/40 p-4`}
            >
              <p className="text-xs font-medium text-slate-300 mb-1">💡 Tip</p>
              <p className="text-[11px] text-slate-400">
                Join sessions and submit challenges to climb leagues faster.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
