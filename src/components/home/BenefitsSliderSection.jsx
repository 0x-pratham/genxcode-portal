// src/components/home/BenefitsSliderSection.jsx
import { motion, AnimatePresence } from "framer-motion";

const benefitSlideVariants = {
  enter: { opacity: 0, x: 40, scale: 0.98, rotateY: -15 },
  center: { opacity: 1, x: 0, scale: 1, rotateY: 0 },
  exit: { opacity: 0, x: -40, scale: 0.98, rotateY: 15 },
};

export default function BenefitsSliderSection({
  benefits,
  active,
  activeIndex,
  onPrev,
  onNext,
  onDotClick,
  onMouseEnter,
  onMouseLeave,
}) {
  return (
    <motion.section
      className="space-y-6"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">
            Member benefits, <span className="text-cyan-300">one by one</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mt-1">
            Slide through everything you unlock as a GenXCode member – with a focus on real growth, not just certificates.
          </p>
        </div>
        <p className="text-[11px] text-slate-500">
          {benefits.length}+ structured benefits · Smooth auto‑slide · Manual controls
        </p>
      </div>

      <div
        className="relative max-w-4xl mx-auto"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <motion.div
          className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-cyan-500/35 via-slate-900 to-purple-500/35 opacity-70 blur-2xl"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative rounded-3xl bg-slate-950/90 border border-slate-800 px-5 py-6 md:px-8 md:py-7 shadow-2xl shadow-slate-950/70 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              variants={benefitSlideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45 }}
              className="space-y-3 md:space-y-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 border border-slate-700/80">
                  <span className="text-[11px] font-mono text-slate-500">#{active.id.toString().padStart(2, "0")}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  <span className="text-[11px] text-slate-200">{active.chip}</span>
                </div>
                <span className="text-[11px] text-slate-500">
                  Benefit {active.id} / {benefits.length}
                </span>
              </div>

              <h3 className="text-lg md:text-2xl font-semibold">{active.title}</h3>
              <p className="text-xs md:text-sm text-cyan-200/90">{active.highlight}</p>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{active.desc}</p>

              <div className="grid gap-3 md:grid-cols-2 text-[11px] md:text-xs text-slate-400">
                <p>
                  • Designed to make your <span className="text-cyan-300">portfolio stronger</span>, not just your
                  attendance sheet.
                </p>
                <p>
                  • Tied into <span className="text-emerald-300">points, leagues</span> and visibility on the
                  leaderboard and dashboard.
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={onPrev}
                className="rounded-full border border-slate-700/80 px-3 py-1.5 text-xs hover:border-cyan-400 hover:bg-slate-900/90 transition"
                type="button"
              >
                Previous
              </button>
              <button
                onClick={onNext}
                className="rounded-full border border-slate-700/80 px-3 py-1.5 text-xs hover:border-cyan-400 hover:bg-slate-900/90 transition"
                type="button"
              >
                Next
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              {benefits.map((b, idx) => (
                <button
                  key={b.id}
                  onClick={() => onDotClick(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    activeIndex === idx ? "w-6 bg-cyan-400" : "w-2 bg-slate-600/80 hover:bg-slate-300"
                  }`}
                  type="button"
                  aria-label={`Go to benefit ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
