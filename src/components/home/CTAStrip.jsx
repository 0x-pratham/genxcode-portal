// src/components/home/CTAStrip.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const cardHoverVariants = {
  rest: { y: 0, scale: 1, backgroundColor: "rgba(11, 17, 35, 0.4)", borderColor: "rgba(255, 255, 255, 0.06)" },
  hover: { 
    y: -6, 
    scale: 1.015,
    backgroundColor: "rgba(11, 17, 35, 0.6)", 
    borderColor: "rgba(0, 163, 255, 0.25)",
    boxShadow: "0 20px 40px rgba(2, 6, 23, 0.4)",
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } 
  },
};

export default function CTAStrip() {
  return (
    <motion.section
      className="space-y-8"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header Accent Pipeline */}
      <div className="flex flex-col gap-2 text-left">
        <span className="text-[11px] font-bold tracking-[0.25em] text-brand-accent uppercase font-display">
          Core Engine Triggers
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-premiumText font-display">
          Three Steps to Core Mastery
        </h2>
      </div>

      {/* Grid Layout Framework */}
      <motion.div
        className="grid gap-5 md:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        
        {/* Card 01 — Apply */}
        <motion.div variants={itemVariants}>
          <Link to="/apply">
            <motion.div
              className="group cursor-pointer rounded-2xl border p-5 backdrop-blur-md relative overflow-hidden h-full flex flex-col justify-between"
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.99 }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold font-display text-brand-accent tracking-widest uppercase bg-brand-accent/[0.06] border border-brand-accent/20 px-2.5 py-0.5 rounded-full">
                    Step 01
                  </span>
                  <span className="text-2xl font-extrabold font-display opacity-10 group-hover:opacity-20 transition-opacity text-neutral-secondaryText">01</span>
                </div>
                <h3 className="text-base font-bold mb-2 text-neutral-premiumText font-display transition-colors group-hover:text-brand-accent">
                  Submit Recruitment Form
                </h3>
                <p className="text-[13px] leading-relaxed text-neutral-secondaryText font-medium font-sans">
                  Provide your active handles, tech stack proficiencies, and specialized interests. Let us review your programming footprint.
                </p>
              </div>
              <div className="text-[12px] font-semibold text-brand-accent inline-flex items-center gap-1.5 pt-4 mt-auto font-sans">
                Initiate Application 
                <motion.span className="inline-block transition-transform group-hover:translate-x-1" animate={{ x: [0, 2, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  →
                </motion.span>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Card 02 — Leaderboard */}
        <motion.div variants={itemVariants}>
          <Link to="/leaderboard">
            <motion.div
              className="group cursor-pointer rounded-2xl border p-5 backdrop-blur-md relative overflow-hidden h-full flex flex-col justify-between"
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.99 }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold font-display text-brand-accent tracking-widest uppercase bg-brand-accent/[0.06] border border-brand-accent/20 px-2.5 py-0.5 rounded-full">
                    Step 02
                  </span>
                  <span className="text-2xl font-extrabold font-display opacity-10 group-hover:opacity-20 transition-opacity text-neutral-secondaryText">02</span>
                </div>
                <h3 className="text-base font-bold mb-2 text-neutral-premiumText font-display transition-colors group-hover:text-brand-accent">
                  Climb the Seasonal Leagues
                </h3>
                <p className="text-[13px] leading-relaxed text-neutral-secondaryText font-medium font-sans">
                  Earn experience multipliers from weekly platform completions. Graduate smoothly from Bronze up into the Elite Diamond divisions.
                </p>
              </div>
              <div className="text-[12px] font-semibold text-brand-accent inline-flex items-center gap-1.5 pt-4 mt-auto font-sans">
                View Top Performers 
                <motion.span className="inline-block transition-transform group-hover:translate-x-1" animate={{ x: [0, 2, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  →
                </motion.span>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Card 03 — Dashboard */}
        <motion.div variants={itemVariants}>
          <Link to="/dashboard">
            <motion.div
              className="group cursor-pointer rounded-2xl border p-5 backdrop-blur-md relative overflow-hidden h-full flex flex-col justify-between"
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.99 }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold font-display text-brand-accent tracking-widest uppercase bg-brand-accent/[0.06] border border-brand-accent/20 px-2.5 py-0.5 rounded-full">
                    Step 03
                  </span>
                  <span className="text-2xl font-extrabold font-display opacity-10 group-hover:opacity-20 transition-opacity text-neutral-secondaryText">03</span>
                </div>
                <h3 className="text-base font-bold mb-2 text-neutral-premiumText font-display transition-colors group-hover:text-brand-accent">
                  Own Your Member Command
                </h3>
                <p className="text-[13px] leading-relaxed text-neutral-secondaryText font-medium font-sans">
                  Track real-time code submissions, accumulated skill points, current streaks, and profile snapshot metrics in one beautiful layout.
                </p>
              </div>
              <div className="text-[12px] font-semibold text-brand-accent inline-flex items-center gap-1.5 pt-4 mt-auto font-sans">
                Go to Dashboard 
                <motion.span className="inline-block transition-transform group-hover:translate-x-1" animate={{ x: [0, 2, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  →
                </motion.span>
              </div>
            </motion.div>
          </Link>
        </motion.div>

      </motion.div>
    </motion.section>
  );
}