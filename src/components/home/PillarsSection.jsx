// src/components/home/PillarsSection.jsx
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.08, delayChildren: 0.05 } 
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
  },
};

// Immersive fallback array to protect your workspace from empty data state bugs
const fallbackPillars = [
  { index: "1", title: "Production Sprints", desc: "Build feature branches inside active developer repositories rather than listening to passive tutorials." },
  { index: "2", title: "Domain Peer Mastery", desc: "Accelerate your programming capabilities directly alongside senior domain leaders and architects." },
  { index: "3", title: "Quantifiable Portfolio", desc: "Convert your completed sprint milestones and challenges into an active developer ranking node." }
];

export default function PillarsSection({ pillars }) {
  // Use passed array if valid and filled; otherwise use pristine template safeguards
  const displayPillars = pillars && pillars.length > 0 ? pillars : fallbackPillars;

  return (
    <motion.section
      className="space-y-6 text-left max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* --- Section Header Row --- */}
      <div className="flex flex-col gap-1 border-b border-white/[0.04] pb-4">
        <span className="text-[10px] font-bold tracking-[0.25em] text-brand-accent uppercase font-display">
          Operational Framework
        </span>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-premiumText font-display">
          How GenXCode Works For You
        </h2>
      </div>

      {/* --- Symmetric 3-Column Pillars Matrix Grid --- */}
      <motion.div
        className="grid gap-4 sm:grid-cols-2 md:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
      >
        {displayPillars.map((p, idx) => (
          <motion.article
            key={p.title || idx}
            variants={itemVariants}
            whileHover={{ y: -3, borderColor: "rgba(0, 163, 255, 0.2)" }}
            className="group relative rounded-xl border border-white/[0.06] bg-brand-midnight/40 p-5 backdrop-blur-md transition-all flex flex-col justify-between overflow-hidden shadow-[0_12px_30px_rgba(2,6,23,0.2)]"
          >
            {/* Subtle Accent Glow Backing */}
            <div className="absolute -right-6 -top-6 w-20 h-20 bg-brand-accent/[0.02] rounded-full blur-xl pointer-events-none group-hover:bg-brand-accent/[0.05] transition-all" />

            <div className="space-y-3 relative z-10 font-sans">
              {/* Pillar Meta Deck Headers */}
              <div className="flex items-center justify-between border-b border-white/[0.03] pb-1.5">
                <span className="text-[9px] font-bold font-mono text-brand-accent tracking-widest uppercase">
                  // Pillar_Node_0{p.index || idx + 1}
                </span>
                <span className="text-[10px] font-bold font-mono text-neutral-secondaryText/20">
                  SYS_CTRL
                </span>
              </div>
              
              {/* Primary Content Elements */}
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-neutral-premiumText font-display tracking-tight group-hover:text-brand-accent transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-[13px] leading-relaxed text-neutral-secondaryText font-medium">
                  {p.desc}
                </p>
              </div>
            </div>

            {/* Micro Decorative Step Status Footer */}
            <div className="mt-5 pt-3 border-t border-white/[0.03] relative z-10 flex items-center gap-1.5 text-neutral-secondaryText/30 text-[9px] font-bold font-mono tracking-wider">
              <span className="h-1 w-1 rounded-full bg-brand-accent/40 group-hover:bg-brand-accent group-hover:animate-pulse transition-colors" />
              OPERATIONAL_STATE // ONLINE
            </div>
          </motion.article>
        ))}
      </motion.div>
    </motion.section>
  );
}