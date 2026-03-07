// src/components/home/LeagueSection.jsx
import { motion, AnimatePresence } from "framer-motion";

const leagueSlideVariants = {
  enter: { opacity: 0, y: 24, scale: 0.97, rotateX: -10 },
  center: { opacity: 1, y: 0, scale: 1, rotateX: 0 },
  exit: { opacity: 0, y: -24, scale: 0.97, rotateX: 10 },
};

export default function LeagueSection({
  leagues,
  activeLeague,
  leagueIndex,
  onPrev,
  onNext,
  onDotClick,
  onMouseEnter,
  onMouseLeave,
}) {
  return (
    <motion.section
      className="space-y-6"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <motion.div
            className="inline-flex items-center gap-2 mb-2"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-2xl">🏆</span>
            <h2 className="text-xl md:text-2xl font-semibold">
              GenXCode <span className="bg-gradient-to-r from-cyan-300 to-amber-300 bg-clip-text text-transparent">League System</span>
            </h2>
          </motion.div>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mt-1">
            Every submission, event and contribution pushes you up this rank ladder – from Bronze GenX all the way to Legend.
          </p>
        </div>
        <motion.div
          className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-[11px] text-slate-400"
          whileHover={{ scale: 1.05, borderColor: "rgb(251, 191, 36)" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>8 Leagues · 0 → 8000+ points</span>
        </motion.div>
      </div>

      <div
        className="relative max-w-4xl mx-auto"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <motion.div
          className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-cyan-500/40 via-slate-900 to-fuchsia-500/40 opacity-70 blur-2xl"
          animate={{ opacity: [0.3, 0.85, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-950/95 via-slate-900/95 to-slate-950/95 border border-slate-800/80 px-5 py-6 md:px-8 md:py-7 shadow-2xl shadow-slate-950/80 overflow-hidden backdrop-blur-xl">
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-amber-400 to-fuchsia-400"
            animate={{
              opacity: [0.6, 1, 0.6],
              boxShadow: [
                "0 0 20px rgba(34, 211, 238, 0.3)",
                "0 0 40px rgba(251, 191, 36, 0.5)",
                "0 0 20px rgba(34, 211, 238, 0.3)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-fuchsia-500/5" />

          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 border border-slate-700/80">
              <span className="text-[11px] font-mono text-slate-500">#{activeLeague.id.toString().padStart(2, "0")}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span className="text-[11px] text-slate-200">League</span>
            </div>
            <span className="text-[11px] text-slate-500">
              {activeLeague.pointsLabel} · <span className="text-cyan-300 font-medium">{activeLeague.name}</span>
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeLeague.key}
              variants={leagueSlideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45 }}
              className="grid gap-6 lg:grid-cols-[1.1fr,1.2fr] items-center"
            >
              <div className="relative flex flex-col items-center gap-3">
                <div className="relative">
                  <div className={`pointer-events-none absolute -inset-8 translate-y-4 blur-3xl bg-gradient-to-b ${activeLeague.glow}`} />
                  <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-600/70 flex items-center justify-center shadow-[0_0_40px_rgba(15,23,42,1)] overflow-hidden">
                    <img src={activeLeague.image} alt={`${activeLeague.name} badge`} className="h-20 w-20 md:h-24 md:w-24 object-contain" loading="lazy" />
                  </div>
                  <div className="absolute -inset-[3px] rounded-[1.75rem] border border-cyan-300/50 blur-[2px] opacity-80" />
                </div>
                <p className="text-[11px] text-slate-500 text-center">
                  Badge preview used on <span className="text-cyan-300">Dashboard</span> & <span className="text-cyan-300">Leaderboard</span>.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-400 mb-1">{activeLeague.emoji} {activeLeague.pointsLabel}</p>
                  <h3 className="text-lg md:text-xl font-semibold">{activeLeague.name}</h3>
                  <p className="text-xs md:text-sm text-cyan-200/90 mt-1">{activeLeague.tagline}</p>
                  <p className="text-sm md:text-base text-slate-300 mt-2">{activeLeague.desc}</p>
                </div>
                <div className="mt-2 space-y-2">
                  <p className="text-[11px] text-slate-400">League path preview</p>
                  <div className="flex items-center gap-1.5">
                    {leagues.map((lg, idx) => {
                      const isActive = lg.key === activeLeague.key;
                      const isPast = idx < leagueIndex;
                      return (
                        <div
                          key={lg.key}
                          className={`flex-1 h-1.5 rounded-full transition-all ${
                            isActive ? "bg-cyan-400" : isPast ? "bg-emerald-400/70" : "bg-slate-700/80"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Bronze</span>
                    <span>Legend</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={onPrev}
                className="rounded-full border border-slate-700/80 px-3 py-1.5 text-[11px] hover:border-cyan-400 hover:bg-slate-900/90 transition"
                type="button"
              >
                Previous league
              </button>
              <button
                onClick={onNext}
                className="rounded-full border border-slate-700/80 px-3 py-1.5 text-[11px] hover:border-cyan-400 hover:bg-slate-900/90 transition"
                type="button"
              >
                Next league
              </button>
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              {leagues.map((lg, idx) => (
                <button
                  key={lg.key}
                  onClick={() => onDotClick(idx)}
                  className={`h-1.5 rounded-full transition-all ${leagueIndex === idx ? "w-6 bg-cyan-400" : "w-2 bg-slate-600/80 hover:bg-slate-300"}`}
                  type="button"
                  aria-label={`Go to ${lg.name}`}
                />
              ))}
            </div>
          </div>

          <p className="mt-3 text-[10px] text-slate-500">
            This is a visual preview. Actual league depends on your points from challenges, events and verified contributions.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
