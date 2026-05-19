// src/components/home/FoundersSection.jsx
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1, delayChildren: 0.05 } 
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  },
};

// Fixed Club Director Core Data Asset
const directorData = {
  name: "Rohit Yadav",
  role: "Club Director · GenXCode",
  quote: "Syllabus-driven study sets the baseline, but absolute engineering autonomy is what scales an enterprise technical architecture. We build engineers who ship.",
  focusPoints: [
    "Architectural ecosystem governance",
    "Strategic industry partnership scaling",
    "Production software distribution guidelines"
  ]
};

// Graceful fallback matrix for the Mentor profile card
const fallbackMentor = {
  name: "Technical Advisor",
  role: "Domain Infrastructure & Engineering",
  quote: "Validating edge micro-challenges trains developers to anticipate memory bottlenecks and runtime errors before they hit production layers.",
  focusPoints: [
    "Database clustering logic", 
    "CI/CD execution pipelines",
    "Systems performance tuning"
  ]
};

export default function FoundersSection({ mentor }) {
  // Graceful state safety layers to protect against blank states
  const activeMentor = mentor && mentor.name ? mentor : fallbackMentor;

  return (
    <motion.section
      id="team-section"
      className="space-y-6 text-left max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* --- Section Header Row --- */}
      <div className="flex flex-col gap-1 border-b border-white/[0.04] pb-4">
        <span className="text-[10px] font-bold tracking-[0.2em] text-brand-accent uppercase font-display">
          Leadership Node
        </span>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-premiumText font-display">
          Executive Vision & Guidance
        </h2>
      </div>

      {/* --- Balanced 2-Column Profile Layout Grid --- */}
      <motion.div 
        className="grid gap-4 md:grid-cols-2 items-stretch"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
      >
        
        {/* Card 01: Club Director (Rohit Yadav) */}
        <motion.article
          variants={itemVariants}
          whileHover={{ y: -3, borderColor: "rgba(0, 163, 255, 0.2)" }}
          className="group relative rounded-xl border border-white/[0.06] bg-brand-midnight/40 p-6 backdrop-blur-md flex flex-col justify-between overflow-hidden shadow-[0_12px_30px_rgba(2,6,23,0.2)]"
        >
          {/* Cyan High-End Accent Bar */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-brand-accent via-sky-400 to-transparent" />
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-brand-accent/[0.03] rounded-full blur-xl pointer-events-none group-hover:bg-brand-accent/[0.06] transition-all" />

          <div className="space-y-4 relative z-10">
            <div>
              <p className="text-[9px] font-bold font-mono text-brand-accent tracking-widest uppercase mb-1">
                // Executive Administration
              </p>
              <h3 className="text-base font-bold text-neutral-premiumText font-display group-hover:text-brand-accent transition-colors">
                {directorData.name}
              </h3>
              <p className="text-[11px] text-neutral-secondaryText/60 font-medium">
                {directorData.role}
              </p>
            </div>

            <p className="text-xs leading-relaxed text-neutral-premiumText/90 font-medium italic font-sans border-l-2 border-brand-accent/30 pl-3">
              "{directorData.quote}"
            </p>
          </div>

          <div className="border-t border-white/[0.04] pt-4 mt-6 relative z-10">
            <ul className="space-y-2 text-[11px] text-neutral-secondaryText font-medium font-sans">
              {directorData.focusPoints.map((point) => (
                <li key={point} className="flex gap-2 items-start">
                  <svg className="h-3.5 w-3.5 text-brand-accent shrink-0 mt-0.5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.article>

        {/* Card 02: Mentor */}
        <motion.article
          variants={itemVariants}
          whileHover={{ y: -3, borderColor: "rgba(52, 211, 153, 0.2)" }}
          className="group relative rounded-xl border border-white/[0.06] bg-brand-midnight/40 p-6 backdrop-blur-md flex flex-col justify-between overflow-hidden shadow-[0_12px_30px_rgba(2,6,23,0.2)]"
        >
          {/* Emerald Technical Accent Bar */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-emerald-400 via-teal-400 to-transparent" />
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-emerald-500/[0.02] rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/[0.05] transition-all" />

          <div className="space-y-4 relative z-10">
            <div>
              <p className="text-[9px] font-bold font-mono text-emerald-400 tracking-widest uppercase mb-1">
                // Systems Guidance
              </p>
              <h3 className="text-base font-bold text-neutral-premiumText font-display group-hover:text-emerald-400 transition-colors">
                {activeMentor.name}
              </h3>
              <p className="text-[11px] text-neutral-secondaryText/60 font-medium">
                {activeMentor.role}
              </p>
            </div>

            <p className="text-xs leading-relaxed text-neutral-premiumText/90 font-medium italic font-sans border-l-2 border-emerald-400/30 pl-3">
              "{activeMentor.quote}"
            </p>
          </div>

          <div className="border-t border-white/[0.04] pt-4 mt-6 relative z-10">
            <ul className="space-y-2 text-[11px] text-neutral-secondaryText font-medium font-sans">
              {(activeMentor.focusPoints || fallbackMentor.focusPoints).map((point) => (
                <li key={point} className="flex gap-2 items-start">
                  <svg className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.article>

      </motion.div>
    </motion.section>
  );
}