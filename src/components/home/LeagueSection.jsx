// src/components/home/LeagueSection.jsx
import { motion, AnimatePresence } from "framer-motion";

const leagueSlideVariants = {
  enter: { opacity: 0, y: 16, scale: 0.98, filter: "blur(4px)" },
  center: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: -16, scale: 0.98, filter: "blur(4px)" },
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
      className="space-y-6 text-left max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* --- Section Header Row --- */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-white/[0.04] pb-4">
        <div className="space-y-1.5">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xl">🏆</span>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-premiumText font-display">
              GenXCode <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accentMuted to-brand-accent">League System</span>
            </h2>
          </motion.div>
          <p className="text-xs md:text-sm text-neutral-secondaryText font-medium font-sans max-w-xl">
            Every submission, event, and contribution pushes you up this rank ladder – from Bronze GenX all the way to Legend.
          </p>
        </div>

        {/* --- Metric Overview Badge --- */}
        <motion.div
          className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-brand-midnight/50 px-3.5 py-1.5 text-[11px] font-medium text-neutral-secondaryText font-sans self-start md:self-auto"
          whileHover={{ scale: 1.02, borderColor: "rgba(0, 163, 255, 0.3)" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse" />
          <span>{leagues.length} Leagues · 0 → 8000+ points</span>
        </motion.div>
      </div>

      {/* --- Main Interactive Stage Card --- */}
      <div
        className="relative w-full"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Soft Ambient Brand Spotlight backplate */}
        <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-brand-accent/20 via-brand-midnight to-transparent opacity-60 blur-xl pointer-events-none" />

        <div className="relative rounded-2xl border border-white/[0.06] bg-brand-midnight/40 p-6 md:p-8 backdrop-blur-md overflow-hidden flex flex-col justify-between shadow-[0_24px_60px_rgba(2,6,23,0.4)]">
          
          {/* Top Status Meta Row */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-cosmos/80 px-2.5 py-1 border border-white/[0.04]">
              <span className="text-[10px] font-mono font-bold text-neutral-secondaryText/60">#{activeLeague.id?.toString().padStart(2, "0")}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-premiumText font-display">Division Tier</span>
            </div>
            <span className="text-[11px] font-medium text-neutral-secondaryText font-sans">
              {activeLeague.pointsLabel} · <span className="text-brand-accent font-semibold">{activeLeague.name}</span>
            </span>
          </div>

          {/* Sliding Display Stage Window */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLeague.key}
              variants={leagueSlideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-8 md:grid-cols-[auto,1fr] items-center"
            >
              {/* Dynamic Badge Visual Node */}
              <div className="relative flex flex-col items-center gap-3 mx-auto md:mx-0 shrink-0">
                <div className="relative">
                  {/* Dynamic Glowing Aura Backing derived from dataset */}
                  <div className={`pointer-events-none absolute -inset-8 translate-y-4 blur-3xl opacity-30 bg-gradient-to-b ${activeLeague.glow || 'from-brand-accent'}`} />
                  
                  <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-2xl bg-gradient-to-br from-brand-cosmos via-brand-midnight to-brand-cosmos border border-white/[0.1] flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] overflow-hidden">
                    <img 
                      src={activeLeague.image} 
                      alt={`${activeLeague.name} badge`} 
                      className="h-20 w-20 md:h-24 md:w-24 object-contain transition-transform duration-500 group-hover:scale-105" 
                      loading="lazy" 
                    />
                  </div>
                  <div className="absolute -inset-[1px] rounded-[1.25rem] border border-brand-accent/30 blur-[1px] opacity-60 pointer-events-none" />
                </div>
                <p className="text-[10px] font-medium text-neutral-secondaryText/50 text-center font-sans">
                  Active Badge Indicator
                </p>
              </div>

              {/* Text Description Stack Layer */}
              <div className="space-y-4 text-center md:text-left">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-brand-accentMuted font-sans flex items-center justify-center md:justify-start gap-1">
                    <span>{activeLeague.emoji}</span> {activeLeague.pointsLabel}
                  </p>
                  <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-neutral-premiumText font-display">
                    {activeLeague.name}
                  </h3>
                  <p className="text-xs md:text-sm font-medium text-brand-accent/90 italic font-sans">
                    "{activeLeague.tagline}"
                  </p>
                </div>
                
                <p className="text-sm md:text-base leading-relaxed text-neutral-secondaryText font-medium font-sans">
                  {activeLeague.desc}
                </p>

                {/* --- Visual Progression Pipeline Bar --- */}
                <div className="pt-2 space-y-1.5 text-left">
                  <p className="text-[10px] font-bold tracking-wider uppercase text-neutral-secondaryText/40 font-display">League Path Progress</p>
                  <div className="flex items-center gap-1.5">
                    {leagues.map((lg, idx) => {
                      const isActive = lg.key === activeLeague.key;
                      const isPast = idx < leagueIndex;
                      return (
                        <div
                          key={lg.key}
                          className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                            isActive 
                              ? "bg-brand-accent shadow-[0_0_12px_rgba(0,163,255,0.5)] w-4" 
                              : isPast 
                                ? "bg-brand-accent/40" 
                                : "bg-white/10"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-neutral-secondaryText/40 font-display">
                    <span>Bronze</span>
                    <span>Legend</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* --- Navigation Controls & Bottom Switchers Interface Row --- */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-white/[0.04] pt-5 mt-6">
            <div className="flex items-center gap-2">
              <button
                onClick={onPrev}
                className="flex-1 sm:flex-none h-8 px-3 rounded-lg border border-white/[0.06] bg-brand-cosmos/40 text-xs font-semibold text-neutral-secondaryText hover:text-neutral-premiumText hover:border-brand-accent/30 hover:bg-brand-accent/[0.02] transition-all font-sans"
                type="button"
              >
                Previous
              </button>
              <button
                onClick={onNext}
                className="flex-1 sm:flex-none h-8 px-3 rounded-lg border border-white/[0.06] bg-brand-cosmos/40 text-xs font-semibold text-neutral-secondaryText hover:text-neutral-premiumText hover:border-brand-accent/30 hover:bg-brand-accent/[0.02] transition-all font-sans"
                type="button"
              >
                Next
              </button>
            </div>
            
            {/* Dot Selectors */}
            <div className="flex items-center gap-1.5 justify-center sm:justify-end">
              {leagues.map((lg, idx) => (
                <button
                  key={lg.key}
                  onClick={() => onDotClick(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    leagueIndex === idx 
                      ? "w-6 bg-brand-accent shadow-[0_0_10px_rgba(0,163,255,0.4)]" 
                      : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                  type="button"
                  aria-label={`Go to ${lg.name}`}
                />
              ))}
            </div>
          </div>

          <p className="mt-4 text-[10px] text-neutral-secondaryText/40 font-medium font-sans text-center md:text-left">
            This is a visual system preview. Ranks calibrate automatically based on verified contributions.
          </p>
        </div>
      </div>
    </motion.section>
  );
}