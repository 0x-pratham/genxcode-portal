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
        className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-cyan-500/40 via-slate-900 to-fuchsia-500/40 opacity-70 blur-lg"
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.02, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="relative card bg-slate-950/90 border border-slate-700/80 rounded-3xl px-4 py-5 sm:px-6 md:px-7 md:py-7 shadow-2xl shadow-slate-950/80 backdrop-blur"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.02, rotateY: 2, transition: { duration: 0.3 } }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-300 mb-3">Member benefit spotlight</p>

        <AnimatePresence mode="wait">
          <div aria-live="polite">
            <motion.div
              key={active.id}
              className="space-y-3"
              variants={benefitSlideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 px-3 py-1 text-[11px] border border-slate-700/80">
                <span className="text-xs font-mono text-slate-400">#{active.id.toString().padStart(2, "0")}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span className="text-slate-300">{active.chip}</span>
              </div>
              <h2 className="text-lg md:text-xl font-semibold">{active.title}</h2>
              <p className="text-xs md:text-sm text-cyan-200/90">{active.highlight}</p>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{active.desc}</p>
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
                    activeIndex === idx ? "w-6 bg-cyan-400" : "w-2 bg-slate-600/80 hover:bg-slate-300"
                  }`}
                  type="button"
                  aria-label={`Go to benefit ${idx + 1}`}
                />
              ))}
            </div>
            <span className="ml-1 text-[10px] text-slate-500">+{benefits.length - 6} more benefits</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <button
              onClick={onPrev}
              className="rounded-full border border-slate-700 px-2 py-1 hover:border-cyan-400 hover:bg-slate-900/90 transition"
              type="button"
              aria-label="Previous benefit"
            >
              ◀
            </button>
            <button
              onClick={onNext}
              className="rounded-full border border-slate-700 px-2 py-1 hover:border-cyan-400 hover:bg-slate-900/90 transition"
              type="button"
              aria-label="Next benefit"
            >
              ▶
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500">
          <p>
            Benefit {active.id} of {benefits.length}
          </p>
          <p>Auto‑sliding every 8 seconds · Pauses on hover</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
