// src/components/home/HeroSection.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const textRevealVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function HeroSection({ onSectionScroll, contentTranslate, children }) {
  return (
    <motion.section
      className="grid gap-12 items-start lg:items-center lg:grid-cols-[1.2fr,1fr]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ y: contentTranslate }}
    >
      {/* Left Content Area */}
      <motion.div
        className="space-y-8 text-left"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="space-y-4">
          {/* Tagline Indicator Layer */}
          <motion.div 
            variants={textRevealVariants}
            className="text-[11px] font-bold tracking-[0.3em] text-brand-accent uppercase font-display block"
          >
            CODE • CREATE • CONQUER
          </motion.div>

          <motion.h1
            variants={textRevealVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-premiumText font-display leading-[1.1]"
          >
            The Ultimate Ecosystem for <br />
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-neutral-premiumText via-brand-accentMuted to-brand-accent">
              Next-Gen Developers.
            </span>
          </motion.h1>

          <motion.p
            variants={textRevealVariants}
            className="text-base sm:text-lg text-neutral-secondaryText font-medium max-w-xl font-sans leading-relaxed"
          >
            GenXCode is an elite hub built to elevate your engineering journey. 
            Solve industrial tracks, review real-time feedback loops, and compete in standard seasonal leagues.
          </motion.p>
        </div>

        {/* Action Button Pipeline */}
        <motion.div 
          variants={textRevealVariants} 
          className="flex flex-wrap items-center gap-4 pt-2"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link to="/signup">
              <motion.button className="relative overflow-hidden group rounded-xl bg-brand-accent px-7 py-3.5 text-sm font-semibold text-brand-cosmos shadow-[0_4px_24px_rgba(0,163,255,0.2)] transition-shadow duration-300">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started 
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
                <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </motion.button>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link to="/challenges">
              <button className="rounded-xl border border-white/[0.08] bg-brand-midnight/40 px-7 py-3.5 text-sm font-semibold text-neutral-premiumText hover:border-brand-accent/30 hover:bg-brand-accent/[0.02] transition-colors">
                Explore Challenges
              </button>
            </Link>
          </motion.div>

          {/* Clean Scroll Indicator Anchor */}
          <motion.button
            type="button"
            whileHover={{ y: 2 }}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-secondaryText hover:text-brand-accent transition-colors pl-2"
            onClick={() => onSectionScroll?.("team-section")}
          >
            <motion.span
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.span>
            Meet The Team
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Right Content Area (Houses the Benefit Slider via Children Injection) */}
      <motion.div
        variants={itemVariants}
        className="relative w-full lg:mt-0"
      >
        <div className="absolute -inset-4 bg-brand-accent/[0.02] rounded-[2.5rem] blur-2xl" />
        <div className="relative border border-white/[0.06] bg-brand-midnight/20 rounded-3xl p-2 backdrop-blur-sm shadow-[0_24px_60px_rgba(2,6,23,0.3)]">
          {children}
        </div>
      </motion.div>
    </motion.section>
  );
}