// src/components/home/BenefitsSliderSection.jsx
import { motion, AnimatePresence } from "framer-motion";

const benefitSlideVariants = {
  enter: { opacity: 0, x: 16, filter: "blur(4px)" },
  center: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, x: -16, filter: "blur(4px)", transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

// High-impact, concise fallback dataset
const fallbackBenefits = [
  { id: "b1", title: "Structured Engineering Tracks", desc: "Access calibrated core syllabus paths engineered to take you from foundational syntax concepts to live distribution architectures." },
  { id: "b2", title: "Automated Integration Labs", desc: "Submit your solutions directly into continuous remote checkers running immediate real-time compilation and code diagnostics." },
  { id: "b3", title: "Immutable Global Ledger", desc: "Track your technical contributions, challenges won, and milestone points on an unalterable community ranking ledger." }
];

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
  const displayBenefits = benefits && benefits.length > 0 ? benefits : fallbackBenefits;
  const safeActiveIndex = activeIndex ?? 0;
  const currentActive = active && active.title ? active : displayBenefits[safeActiveIndex] || fallbackBenefits[0];

  return (
    <motion.section
      className="space-y-5 text-left max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* --- Section Header Row --- */}
      <div className="flex flex-col gap-1 border-b border-white/[0.04] pb-3.5">
        <span className="text-[10px] font-bold tracking-[0.2em] text-brand-accent uppercase font-display">
          Ecosystem Advantages
        </span>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-premiumText font-display">
          Member Benefits & Capabilities
        </h2>
      </div>

      {/* --- Main Focus Slider Panel --- */}
      <div
        className="relative rounded-xl border border-white/[0.06] bg-brand-midnight/30 p-5 sm:p-7 backdrop-blur-md overflow-hidden shadow-[0_16px_40px_rgba(2,6,23,0.35)]"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Subtle Lens Flare Accent */}
        <div className="absolute -right-24 -top-24 w-56 h-56 bg-brand-accent/[0.04] rounded-full blur-3xl pointer-events-none" />

        {/* Presentation Container with tight min-height constraints to prevent shifting */}
        <div className="relative min-h-[110px] sm:min-h-[80px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentActive.id || safeActiveIndex}
              variants={benefitSlideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid gap-4 sm:grid-cols-[auto,1fr] items-center font-sans"
            >
              {/* Asymmetrical Numeric Step Box */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand-accent/20 bg-brand-accent/[0.03] font-mono text-xs font-bold text-brand-accent shadow-[inset_0_1px_6px_rgba(0,163,255,0.1)]">
                0{safeActiveIndex + 1}
              </div>

              {/* Main Content Stack */}
              <div className="space-y-1">
                <span className="text-[9px] font-bold font-mono text-brand-accent/50 tracking-widest uppercase block">
                  // Core Capability Node
                </span>
                <h3 className="text-sm sm:text-base font-bold text-neutral-premiumText font-display tracking-tight">
                  {currentActive.title}
                </h3>
                <p className="text-xs sm:text-[13px] leading-relaxed text-neutral-secondaryText font-medium">
                  {currentActive.desc}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* --- Controls Footer Deck --- */}
        <div className="mt-6 pt-3.5 border-t border-white/[0.04] flex items-center justify-between">
          
          {/* Custom Linear Progress Trackers */}
          <div className="flex items-center gap-1.5">
            {displayBenefits.map((b, idx) => (
              <button
                key={b.id || idx}
                onClick={() => onDotClick?.(idx)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  safeActiveIndex === idx 
                    ? "w-7 bg-brand-accent" 
                    : "w-2 bg-white/10 hover:bg-white/30"
                }`}
                type="button"
                aria-label={`Jump to benefit index ${idx + 1}`}
              />
            ))}
          </div>

          {/* Minimal Action Arrows */}
          <div className="flex items-center gap-1">
            <button
              onClick={onPrev}
              className="group flex items-center justify-center h-7 w-7 rounded-lg border border-white/[0.05] bg-white/[0.02] hover:border-brand-accent/40 hover:bg-brand-accent/[0.04] transition-all"
              type="button"
              aria-label="Previous step"
            >
              <svg className="h-3.5 w-3.5 text-neutral-secondaryText group-hover:text-brand-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={onNext}
              className="group flex items-center justify-center h-7 w-7 rounded-lg border border-white/[0.05] bg-white/[0.02] hover:border-brand-accent/40 hover:bg-brand-accent/[0.04] transition-all"
              type="button"
              aria-label="Next step"
            >
              <svg className="h-3.5 w-3.5 text-neutral-secondaryText group-hover:text-brand-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </motion.section>
  );
}