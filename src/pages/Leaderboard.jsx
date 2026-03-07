// LEADERBOARD — ULTRA-GLASS PRO + A2-B GRADIENT + SAFE ANIMATIONS
// ---------------------------------------------------------------
// ✔ UI unchanged
// ✔ Animations untouched
// ✔ ONLY profile join fixed
// ---------------------------------------------------------------

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { motion, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

// --------------------------------------------------
// LEAGUE ICONS
// --------------------------------------------------
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

// --------------------------------------------------
// SAFE TILT
// --------------------------------------------------
function useSafeTilt() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [0, 1], [6, -6]);
  const rotateY = useTransform(x, [0, 1], [-6, 6]);

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  return { rotateX, rotateY, handleMove };
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [query, setQuery] = useState("");
  const [leagueFilter, setLeagueFilter] = useState("All");
  const { user } = useAuth();

  const topTilt = useSafeTilt();
  const restTilt = useSafeTilt();
  const shouldReduce = useReducedMotion();

  // --------------------------------------------------
  // LOAD DATA (SAFE JOIN — FIXED)
  // --------------------------------------------------
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg("");

      if (!supabase) {
        console.error("Supabase is not configured");
        setErrorMsg("Supabase is not configured.");
        setLoading(false);
        return;
      }

      const { data: lb, error: lbErr } = await supabase
        .from("leaderboard")
        .select("*")
        .order("points", { ascending: false });

      const { data: pr, error: prErr } = await supabase
        .from("profiles")
        .select("*");

      if (lbErr || prErr) {
        console.error("Leaderboard load error:", lbErr || prErr);
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

  const normalizedQuery = query.trim().toLowerCase();
  const filteredLeaders = leaders.filter((l) => {
    const matchesQuery =
      !normalizedQuery ||
      (l.full_name || "").toLowerCase().includes(normalizedQuery) ||
      (l.branch || "").toLowerCase().includes(normalizedQuery) ||
      (l.github || "").toLowerCase().includes(normalizedQuery);

    const matchesLeague = leagueFilter === "All" || l.league === leagueFilter;
    return matchesQuery && matchesLeague;
  });

  const topThree = filteredLeaders.slice(0, 3);
  const rest = filteredLeaders.slice(3);

  const currentUserId = user?.id || null;
  const yourIndexAll = currentUserId
    ? leaders.findIndex((l) => l.user_id === currentUserId)
    : -1;
  const yourRankAll = yourIndexAll >= 0 ? yourIndexAll + 1 : null;
  const yourEntryAll = yourIndexAll >= 0 ? leaders[yourIndexAll] : null;

  function LeagueIcon({ league, variant = "lg" }) {
    const src = leagueImages[league] || defaultLeagueIcon;
    const imgClass = variant === "lg" ? "h-16 w-16 rounded-full" : "h-12 w-12 rounded-full";

    return (
      <div className="relative inline-block overflow-hidden" style={{ width: variant === "lg" ? 64 : 48, height: variant === "lg" ? 64 : 48 }}>
        <img src={src} className={imgClass} alt={league} />

        {!shouldReduce && (
          <motion.span
            aria-hidden
            initial={{ x: '-120%' }}
            animate={{ x: [ '-120%', '120%' ] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
            className="absolute left-0 top-0 h-full"
            style={{
              width: '40%',
              background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0) 100%)',
              transform: 'skewX(-20deg)',
              mixBlendMode: 'screen',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    );
  }

  // --------------------------------------------------
  // UI (UNCHANGED)
  // --------------------------------------------------
  return (
    <main className="relative min-h-screen text-slate-100 pb-24 overflow-hidden">
      {/* ---------------- BACKGROUND ---------------- */}
      <motion.div
        className="pointer-events-none fixed inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <motion.div
          className="absolute -top-32 -left-40 h-[35rem] w-[35rem] rounded-full bg-cyan-400/15 blur-[140px]"
          animate={{ x: [0, 35, -20, 0], y: [0, -25, 20, 0] }}
          transition={{ duration: 42, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-52 -right-40 h-[35rem] w-[35rem] rounded-full bg-fuchsia-400/15 blur-[140px]"
          animate={{ x: [0, -35, 20, 0], y: [0, 20, -15, 0] }}
          transition={{ duration: 48, repeat: Infinity }}
        />
      </motion.div>

      {/* ---------------- CONTENT ---------------- */}
      <div className="container-page max-w-5xl mx-auto pt-20 space-y-12 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl font-bold bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 bg-clip-text text-transparent"
        >
          Leaderboard
        </motion.h1>

        {/* Controls + your rank */}
        <section className="grid gap-4">
          <div className="grid md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Search</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, branch, or GitHub…"
                className="w-full rounded-xl border border-white/10 bg-slate-950/50 backdrop-blur-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400/40"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">League</label>
              <select
                value={leagueFilter}
                onChange={(e) => setLeagueFilter(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/50 backdrop-blur-xl px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-cyan-400/40"
              >
                <option value="All">All</option>
                {Object.keys(leagueImages).map((lg) => (
                  <option key={lg} value={lg}>
                    {lg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!loading && yourEntryAll && (
            <div className="rounded-2xl border border-cyan-400/20 bg-slate-950/45 backdrop-blur-xl p-4 shadow-lg shadow-cyan-500/10">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={leagueImages[yourEntryAll.league] || defaultLeagueIcon}
                    className="h-10 w-10 rounded-full"
                    alt={yourEntryAll.league}
                  />
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-slate-50">You</p>
                    <p className="text-xs text-slate-400">
                      Rank <span className="text-cyan-300 font-semibold">#{yourRankAll}</span> ·{" "}
                      {yourEntryAll.league}
                    </p>
                  </div>
                </div>
                <p className="text-lg font-bold text-cyan-300">{yourEntryAll.points}</p>
              </div>
            </div>
          )}

          {!loading && !yourEntryAll && user && (
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-xl p-4 text-sm text-slate-300">
              Your leaderboard entry isn’t available yet.
            </div>
          )}
        </section>

        {!!errorMsg && !loading && (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">
            {errorMsg}
          </div>
        )}

        {loading && (
          <section className="grid md:grid-cols-3 gap-6" aria-hidden>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="relative px-6 py-7 rounded-2xl bg-slate-950/50 backdrop-blur-xl border border-white/8 shadow-lg"
              >
                <div className="h-4 w-32 rounded-md bg-slate-800 animate-pulse mb-4" />
                <div className="h-8 w-48 rounded-md bg-slate-800 animate-pulse mb-2" />
                <div className="h-10 w-24 rounded-md bg-slate-800 animate-pulse mt-6" />
              </div>
            ))}
          </section>
        )}

        {!loading && filteredLeaders.length > 0 && (
          <section className="grid md:grid-cols-3 gap-6">
            {topThree.map((l, i) => {
              const glow = leagueGlow[l.league] || leagueGlow.Default;

              return (
                <motion.div
                  key={l.user_id || i}
                  onMouseMove={topTilt.handleMove}
                  style={{ rotateX: topTilt.rotateX, rotateY: topTilt.rotateY }}
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.7, delay: i * 0.08 }}
                  whileHover={!shouldReduce ? { translateY: -6, scale: 1.02 } : {}}
                  className="relative px-6 py-7 rounded-2xl bg-slate-950/60 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden"
                >
                  <motion.div
                    className={`absolute -inset-5 rounded-3xl bg-gradient-to-br ${glow} blur-[70px] opacity-70`}
                    animate={!shouldReduce ? { opacity: [0.55, 0.9, 0.55], scale: [1, 1.05, 1] } : { opacity: 0.7 }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.3 }}
                  />

                  <div className="relative space-y-3">
                    <div className="absolute -top-3 -right-3">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0.9 }}
                        animate={!shouldReduce ? { scale: [0.96, 1.06, 0.96] } : {}}
                        transition={{ duration: 1.8, repeat: Infinity }}
                        className="bg-gradient-to-tr from-yellow-400 to-orange-400 text-slate-900 px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-2"
                        aria-hidden
                      >
                        <span>#{i + 1}</span>
                      </motion.div>
                    </div>

                    <span className="text-xs text-slate-300">Top Rank</span>
                    <div className="flex items-center gap-4">
                      <img
                        src={leagueImages[l.league] || defaultLeagueIcon}
                        className="h-16 w-16 rounded-full"
                        alt={l.league}
                      />
                      <div>
                        <p className="text-lg font-semibold">{l.full_name}</p>
                        <p className="text-xs text-slate-400">
                          {l.branch || "Member"} • {l.year}
                        </p>
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-cyan-300">{l.points}</p>
                  </div>
                </motion.div>
              );
            })}
          </section>
        )}
        {!loading && filteredLeaders.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-xl p-6 text-sm text-slate-300">
            No results found.
          </div>
        )}

        {!loading && rest.length > 0 && (
          <section className="mt-8 grid md:grid-cols-2 gap-4">
            {rest.map((r, idx) => (
              <motion.div
                key={r.user_id || idx}
                onMouseMove={restTilt.handleMove}
                style={{ rotateX: restTilt.rotateX, rotateY: restTilt.rotateY }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.03 }}
                whileHover={!shouldReduce ? { scale: 1.01, translateY: -4 } : {}}
                className="relative flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/6 shadow-md"
              >
                <img
                  src={leagueImages[r.league] || defaultLeagueIcon}
                  className="h-12 w-12 rounded-full"
                  alt={r.league}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {r.full_name}
                        {currentUserId && r.user_id === currentUserId && (
                          <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-200 border border-cyan-400/20">
                            You
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400">{r.branch || "Member"}</p>
                    </div>
                    <p className="text-lg font-semibold text-cyan-300">{r.points}</p>
                  </div>
                  <p className="text-xs text-slate-500">{r.github || ''}</p>
                </div>
              </motion.div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
