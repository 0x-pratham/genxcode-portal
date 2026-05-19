// src/components/home/HeroBenefitSlider.jsx
import { motion, AnimatePresence } from "framer-motion";

const benefitSlideVariants = {
  enter: { opacity: 0, x: 24, scale: 0.99, filter: "blur(4px)" },
  center: { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, x: -24, scale: 0.99, filter: "blur(4px)" },
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
      className="relative w-full h-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Premium Ambient Background Aura Layer */}
      <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-brand-accent/20 via-brand-midnight to-transparent opacity-60 blur-xl" />

      {/* Main Structural Slide Shell */}
      <div className="relative rounded-2xl border border-white/[0.06] bg-brand-midnight/40 p-6 backdrop-blur-md min-h-[220px] flex flex-col justify-between">
        
        {/* Animated Slide Window */}
        <div className="relative overflow-hidden flex-1 mb-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeIndex}
              variants={benefitSlideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3"
            >
              {/* Dynamic Index Pill Tag */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-accent/[0.06] border border-brand-accent/20 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-brand-accent font-display">
                Track Metric 0{activeIndex + 1}
              </div>

              {/* Title & Description Typography Architecture */}
              <h3 className="text-xl font-bold tracking-tight text-neutral-premiumText font-display">
                {active?.title || "Ecosystem Feature"}
              </h3>
              <p className="text-[13px] leading-relaxed text-neutral-secondaryText font-medium font-sans">
                {active?.description || "Loading specialized project module description..."}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Meta Controls Interface Row */}
        <div className="flex items-center justify-between border-t border-white/[0.04] pt-4 mt-auto">
          
          {/* Pagination Indicators Cluster */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {benefits.slice(0, 6).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => onDotClick(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === idx 
                      ? "w-5 bg-brand-accent shadow-[0_0_12px_rgba(0,163,255,0.4)]" 
                      : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                  type="button"
                  aria-label={`Go to benefit slide ${idx + 1}`}
                />
              ))}
            </div>
            {benefits.length > 6 && (
              <span className="text-[10px] font-semibold text-neutral-secondaryText/60 tracking-wide font-sans">
                +{benefits.length - 6} More
              </span>
            )}
          </div>

          {/* Interactive Navigation Control Pipeline */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onPrev}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-brand-cosmos/40 text-neutral-secondaryText hover:text-neutral-premiumText hover:border-brand-accent/30 hover:bg-brand-accent/[0.02] transition-all"
              type="button"
              aria-label="Previous Benefit"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={onNext}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-brand-cosmos/40 text-neutral-secondaryText hover:text-neutral-premiumText hover:border-brand-accent/30 hover:bg-brand-accent/[0.02] transition-all"
              type="button"
              aria-label="Next Benefit"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  );
}