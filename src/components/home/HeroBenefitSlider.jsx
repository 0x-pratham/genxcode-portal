// src/components/home/HeroBenefitSlider.jsx
import { motion, AnimatePresence } from "framer-motion";

const benefitSlideVariants = {
  enter: { opacity: 0, x: 40, scale: 0.98, rotateY: -15 },
  center: { opacity: 1, x: 0, scale: 1, rotateY: 0 },
  exit: { opacity: 0, x: -40, scale: 0.98, rotateY: 15 },
};

export default function HeroBenefitSlider({
  benefits,
  activeIndex,
  active,
  onPrev,
  onNext,
  onDotClick,
  onMouseEnter,
  onMouseLeave,
}) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <motion.div
        className="absolute -inset-[2px] rounded-[32px] bg-gradient-to-br from-violet-500/10 via-slate-900 to-indigo-500/10 opacity-50 blur-3xl"
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.02, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0B1120]/80 px-6 py-7 sm:px-8 md:px-10 md:py-10 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.02, rotateY: 2, transition: { duration: 0.3 } }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-violet-300/90">Member benefit spotlight</p>

        <AnimatePresence mode="wait">
  <div aria-live="polite">
    <motion.div
      key={active.id}
      className="space-y-4"
      variants={benefitSlideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35 }}
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-gradient-to-br from-[#0B1120] via-[#111827] to-[#1E1B4B] px-3 py-1.5 text-[11px] backdrop-blur-xl">
        <span className="text-xs font-mono text-slate-300">
          #{active.id.toString().padStart(2, "0")}
        </span>

        <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />

        <span className="text-slate-300">{active.chip}</span>
      </div>

      <h2 className="max-w-xl text-3xl md:text-4xl font-bold tracking-[-0.03em] leading-tight text-white">
        {active.title}
      </h2>

      <p className="text-sm font-semibold uppercase tracking-wide text-violet-300">
        {active.highlight}
      </p>

      <p className="max-w-2xl text-base leading-8 text-slate-300">
        {active.desc}
      </p>
    </motion.div>
  </div>
</AnimatePresence>

        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              {benefits.slice(0, 6).map((b, idx) => (
                <button
                  key={b.id}
                  onClick={() => onDotClick(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    activeIndex === idx ? "w-6 bg-violet-400" : "w-2 bg-slate-600/80 hover:bg-slate-300"
                  }`}
                  type="button"
                  aria-label={`Go to benefit ${idx + 1}`}
                />
              ))}
            </div>
            <span className="ml-1 text-[10px] text-slate-300">+{benefits.length - 6} more benefits</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <button
              onClick={onPrev}
              className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-slate-100 transition-all duration-300 hover:border-violet-400/60 hover:bg-slate-800/80"
              type="button"
              aria-label="Previous benefit"
            >
              ◀
            </button>
            <button
              onClick={onNext}
              className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-slate-100 transition-all duration-300 hover:border-violet-400/60 hover:bg-slate-800/80"
              type="button"
              aria-label="Next benefit"
            >
              ▶
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-fuchsia-500/20 pt-5 text-xs text-slate-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Benefit {active.id} of {benefits.length}
          </p>
          <p>Auto‑sliding every 8 seconds · Pauses on hover</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
