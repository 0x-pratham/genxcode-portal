// Leaderboard — UI/UX improvements
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useAuth } from "../context/AuthContext";


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

const defaultLeagueIcon = leagueImages.Bronze;

const leagueGlow = {
  Bronze: "from-amber-300/20 to-transparent",
  Silver: "from-slate-300/25 to-transparent",
  Gold: "from-yellow-300/30 to-transparent",
  Crystal: "from-cyan-300/35 to-transparent",
  Master: "from-emerald-300/35 to-transparent",
  Champion: "from-indigo-300/35 to-transparent",
  Titan: "from-purple-300/35 to-transparent",
  Legend: "from-fuchsia-300/40 to-transparent",
  Default: "from-cyan-300/30 to-transparent",
};

const rankMedals = {
  1: { emoji: "🥇", label: "1st", height: "h-24", glow: "from-yellow-400/40" },
  2: { emoji: "🥈", label: "2nd", height: "h-20", glow: "from-slate-300/40" },
  3: { emoji: "🥉", label: "3rd", height: "h-20", glow: "from-amber-400/40" },
};

function LeagueIcon({ league, variant = "lg" }) {
  const src = leagueImages[league] || defaultLeagueIcon;
  const size = variant === "lg" ? "h-16 w-16" : "h-12 w-12";

  const glow = leagueGlow[league] || leagueGlow.Default;

  return (
    <div className="relative flex items-center justify-center">

      {/* Outer aura */}
      <motion.div
        className={`absolute rounded-full blur-2xl opacity-80 bg-gradient-to-br ${glow}`}
        style={{ width: "120%", height: "120%" }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      />

      {/* Ring Glow */}
      <div className="absolute inset-0 rounded-full ring-4 ring-cyan-400/10" />

      {/* Badge */}
      <motion.img
        src={src}
        alt={league}
        className={`${size} relative rounded-full object-contain`}
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

    </div>
  );
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [query, setQuery] = useState("");
  const [leagueFilter, setLeagueFilter] = useState("All");
  const { user } = useAuth();
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg("");

      if (!supabase) {
        setErrorMsg("Supabase is not configured.");
        setLoading(false);
        return;
      }

      const { data: lb, error: lbErr } = await supabase
        .from("leaderboard")
        .select("*")
        .order("points", { ascending: false });

      const { data: pr, error: prErr } = await supabase.from("profiles").select("*");

      if (lbErr || prErr) {
        setErrorMsg("Failed to load leaderboard. Please try again.");
      }

      const safeLeaderboard = Array.isArray(lb) ? lb : [];
      const safeProfiles = Array.isArray(pr) ? pr : [];

      const merged = safeLeaderboard.map((l) => {
        const p = safeProfiles.find((x) => x.id === l.user_id);
        return {
          ...l,
          full_name: p?.full_name || "Unnamed member",
          branch: p?.branch || "",
          year: p?.year || "",
          github: p?.github || "",
        };
      });

      setLeaders(merged);
      setLoading(false);
    };

    load();
  }, []);

  const normalizedQuery = useMemo(() => {
  return query.trim().toLowerCase();
}, [query]);

const filteredLeaders = leaders.filter((l) => {
  const matchesQuery =
    !normalizedQuery ||
    (l.full_name || "").toLowerCase().includes(normalizedQuery) ||
    (l.branch || "").toLowerCase().includes(normalizedQuery) ||
    (l.github || "").toLowerCase().includes(normalizedQuery);

  const matchesLeague = leagueFilter === "All" || l.league === leagueFilter;

  return matchesQuery && matchesLeague;
});

const maxPoints = Math.max(...filteredLeaders.map(l => l.points || 0), 1);

  const topThree = filteredLeaders.slice(0, 3);
  const rest = filteredLeaders.slice(3);

  const currentUserId = user?.id || null;
  const yourIndexAll = currentUserId ? leaders.findIndex((l) => l.user_id === currentUserId) : -1;
  const yourRankAll = yourIndexAll >= 0 ? yourIndexAll + 1 : null;
  const yourEntryAll = yourIndexAll >= 0 ? leaders[yourIndexAll] : null;

  return (
    <main className="relative min-h-screen text-slate-100 pb-24 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
      {/* Background */}
<div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

  {/* Gradient Base */}
  <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black" />

  {/* Animated Glow Orbs */}
  <motion.div
    className="absolute -top-32 -left-40 h-[38rem] w-[38rem] rounded-full bg-cyan-400/15 blur-[160px]"
    animate={!shouldReduce ? { x: [0, 40, -20, 0], y: [0, -30, 20, 0] } : {}}
    transition={{ duration: 45, repeat: Infinity }}
  />

  <motion.div
    className="absolute top-40 -right-40 h-[38rem] w-[38rem] rounded-full bg-fuchsia-400/15 blur-[160px]"
    animate={!shouldReduce ? { x: [0, -40, 20, 0], y: [0, 20, -20, 0] } : {}}
    transition={{ duration: 50, repeat: Infinity }}
  />

  <motion.div
    className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-indigo-400/10 blur-[140px]"
    animate={!shouldReduce ? { x: [0, 20, -10, 0], y: [0, 15, -10, 0] } : {}}
    transition={{ duration: 38, repeat: Infinity }}
  />

  {/* Tech Grid Overlay */}
  <div
    className="absolute inset-0 opacity-[0.04]"
    style={{
      backgroundImage:
        "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
      backgroundSize: "80px 80px",
    }}
  />

</div>

      <div className="container-page max-w-5xl mx-auto pt-20 space-y-8 relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
              Leaderboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Top builders and contributors · Climb the leagues
            </p>
          </div>
          <Link
            to="/challenges"
            className="inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200 transition"
          >
            Join a challenge ↗
          </Link>
        </motion.header>

        {/* Search & Filter */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, branch, or GitHub…"
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-700/80 bg-slate-950/70 backdrop-blur-xl text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition"
              />
            </div>
            <div className="sm:w-44">
              <select
                value={leagueFilter}
                onChange={(e) => setLeagueFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-700/80 bg-slate-950/70 backdrop-blur-xl text-slate-100 outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition"
              >
                <option value="All">All leagues</option>
                {Object.keys(leagueImages).map((lg) => (
                  <option key={lg} value={lg}>
                    {lg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Your rank card */}
          <AnimatePresence>
            {!loading && yourEntryAll && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-cyan-400/30 bg-slate-950/80 backdrop-blur-xl p-4 shadow-lg shadow-cyan-500/5"
              >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                    <LeagueIcon league={yourEntryAll.league} variant="lg" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-50">Your rank</p>
                      <p className="text-xs text-slate-400">
                        <span className="text-cyan-300 font-semibold">#{yourRankAll}</span>
                        {" · "}
                        {yourEntryAll.league}
                        {" · "}
                        {yourEntryAll.full_name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-cyan-300">{yourEntryAll.points}</p>
                    <p className="text-[10px] text-slate-500">points</p>
                  </div>
                </div>
              </motion.div>
            )}

            {!loading && !yourEntryAll && user && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-slate-700/60 bg-slate-950/50 backdrop-blur-xl p-4 text-sm text-slate-400"
              >
                Your leaderboard entry isn&apos;t available yet. Submit a challenge to get ranked.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Error */}
        {errorMsg && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-200"
          >
            {errorMsg}
          </motion.div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
            aria-label="Loading"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-slate-950/60 border border-slate-800/60 p-6 animate-pulse"
                >
                  <div className="h-4 w-24 rounded bg-slate-800 mb-4" />
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-slate-800" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 w-32 rounded bg-slate-800" />
                      <div className="h-3 w-20 rounded bg-slate-800" />
                    </div>
                  </div>
                  <div className="h-8 w-16 rounded bg-slate-800" />
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-slate-950/60 border border-slate-800/60 animate-pulse" />
              ))}
            </div>
          </motion.section>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
    <p className="text-xs text-slate-400">Total Builders</p>
    <p className="text-2xl font-bold text-cyan-300">{leaders.length}</p>
  </div>

  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
    <p className="text-xs text-slate-400">Top Score</p>
    <p className="text-2xl font-bold text-indigo-300">
      {leaders[0]?.points || 0}
    </p>
  </div>

  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
    <p className="text-xs text-slate-400">Your Rank</p>
    <p className="text-2xl font-bold text-fuchsia-300">
      {yourRankAll || "-"}
    </p>
  </div>

</div>

        {/* Top 3 podium */}
{!loading && topThree.length > 0 && (
  <motion.section
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.1 }}
  className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 items-end"
>
    {topThree.map((leader, index) => {
      const rank = index + 1;
      const podiumGlow = {
  1: "from-yellow-400/25 via-yellow-300/15 to-transparent",
  2: "from-slate-300/25 via-slate-200/10 to-transparent",
  3: "from-amber-500/25 via-amber-300/10 to-transparent",
};

const glowColor = podiumGlow[rank];
      const crownGlow =
  rank === 1
    ? "shadow-[0_0_40px_rgba(255,215,0,0.35)]"
    : "";
      const config = rankMedals[rank];
      const glow = leagueGlow[leader.league] || leagueGlow.Default;

      return (
        <motion.div
  key={leader.user_id}
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: index * 0.1 }}
  whileHover={!shouldReduce ? { y: -8, scale: 1.04 } : {}}
  className={`relative rounded-2xl overflow-hidden border bg-slate-950/80 backdrop-blur-xl border-slate-700/60 shadow-xl ${crownGlow}`}
> 
          {/* Glow background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${glow} opacity-50 blur-2xl`}
          />

          <div className="relative p-5 md:p-6 flex flex-col items-center text-center">

            {/* PODIUM GLOW */}
<motion.div
  className={`absolute inset-0 bg-gradient-to-br ${glowColor} blur-2xl`}
  animate={{ opacity: [0.4, 0.8, 0.4] }}
  transition={{ duration: 3, repeat: Infinity }}
/>

            {/* Rank Badge */}
            <div className="absolute top-2 right-2">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                  rank === 1
                    ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/40"
                    : rank === 2
                    ? "bg-slate-400/20 text-slate-200 border border-slate-300/40"
                    : "bg-amber-600/20 text-amber-200 border border-amber-500/40"
                }`}
              >
                {config.emoji} #{rank}
              </span>
            </div>

            {/* League Icon */}
            <LeagueIcon league={leader.league} variant="lg" />

            {/* Name */}
            <h3 className="font-semibold text-slate-50 mt-3 tracking-wide">
              {leader.full_name}
            </h3>

            {/* League */}
            <span className="mt-2 inline-flex px-2 py-0.5 rounded-full text-[10px] bg-slate-800 border border-slate-700 text-slate-300">
              {leader.league} League
            </span>

            {/* Branch */}
            <p className="text-xs text-slate-400 mt-1">
              {leader.branch || "Member"}
              {leader.year && ` · ${leader.year}`}
            </p>

            {/* Points */}
            <p className="text-2xl font-bold text-cyan-300 mt-2">
              {leader.points}
            </p>
            <p className="text-[10px] text-slate-500">points</p>

          </div>
        </motion.div>
      );
    })}
  </motion.section>
)}

        {/* Rest of list */}
        {!loading && rest.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-2"
          >
            <h2 className="text-sm font-semibold text-slate-400 mb-4">All ranks</h2>
            <div className="space-y-2">
              {rest.map((r, idx) => {
                const rank = idx + 4;
                const isYou = currentUserId && r.user_id === currentUserId;

                return (
                  <motion.div
                    key={r.user_id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
  duration: 0.3,
  delay: idx * 0.04,
  ease: "easeOut"
}}
                    whileHover={
  !shouldReduce
    ? {
        x: 6,
        scale: 1.01,
        boxShadow: "0px 10px 30px rgba(0,0,0,0.4)"
      }
    : {}
}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition ${
                      isYou
                        ? "border-cyan-400/30 bg-cyan-500/5"
                        : "border-slate-800/60 bg-slate-950/50 hover:border-slate-700/80"
                    }`}
                  >
                    <span className="text-sm font-mono text-slate-500 w-8">#{rank}</span>
                    <LeagueIcon league={r.league} variant="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-100 truncate">
                        {r.full_name}
                        {isYou && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-200 text-[10px] font-medium border border-cyan-400/20">
                            You
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {r.branch || "Member"}

{r.github && (
  <>
    {" · "}
    <a
      href={`https://github.com/${r.github}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-cyan-300 hover:text-cyan-200"
    >
      @{r.github}
    </a>
  </>
)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 min-w-[90px]">
  <p className="text-lg font-semibold text-cyan-300 tabular-nums">
    {r.points}
  </p>

  <div className="w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden">
    <div
      className="h-full bg-gradient-to-r from-cyan-400 to-indigo-400"
      style={{ width: `${(r.points / maxPoints) * 100}%` }}
    />
  </div>
</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Empty state */}
        {!loading && filteredLeaders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-800/60 bg-slate-950/50 backdrop-blur-xl p-12 text-center"
          >
            <p className="text-4xl mb-4">🏆</p>
            <h3 className="text-lg font-semibold text-slate-200 mb-2">No results found</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              {query || leagueFilter !== "All"
                ? "Try adjusting your search or league filter."
                : "Be the first to climb the leaderboard. Submit a challenge!"}
            </p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
