// LEADERBOARD — ULTRA-GLASS PRO + A2-B GRADIENT + SAFE ANIMATIONS
// ---------------------------------------------------------------
// ✔ UI unchanged
// ✔ Animations untouched
// ✔ ONLY profile join fixed
// ---------------------------------------------------------------

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { motion, useMotionValue, useTransform, useReducedMotion } from "framer-motion";

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

  const topTilt = useSafeTilt();
  const restTilt = useSafeTilt();
  const shouldReduce = useReducedMotion();

  // --------------------------------------------------
  // LOAD DATA (SAFE JOIN — FIXED)
  // --------------------------------------------------
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      if (!supabase) {
        console.error("Supabase is not configured");
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

  const topThree = leaders.slice(0, 3);
  const rest = leaders.slice(3);

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

        {!loading && leaders.length > 0 && (
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
                      <p className="font-medium">{r.full_name}</p>
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
