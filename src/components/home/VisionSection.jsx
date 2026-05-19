// src/components/home/VisionSection.jsx
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

const howItFeels = [
  "Weekly or bi‑weekly sessions instead of random events.",
  "Dedicated tracks for beginners, intermediate and advanced.",
  "Spaces to experiment, fail fast and learn with others.",
  "Clear growth: challenges → points → leagues → recognition.",
];

export default function VisionSection({ visions }) {
  // Safe validation layers for vision data inputs
  const displayVisions = visions && visions.length > 0 ? visions : [
    "Setting clear operational paths for continuous developer progression.",
    "Establishing multi-tier codebase environments across active cohorts.",
    "Bridging the academic-industry delta via robust open-source pipelines.",
    "Cultivating autonomous engineering logic away from boilerplate code."
  ];

  return (
    <motion.section
      id="vision-section"
      className="space-y-6 text-left max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* --- Section Header Row --- */}
      <div className="flex flex-col gap-1 border-b border-white/[0.04] pb-4">
        <span className="text-[10px] font-bold tracking-[0.25em] text-brand-accent uppercase font-display">
          Strategic Horizon
        </span>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-premiumText font-display">
          Our Core Vision & Culture
        </h2>
      </div>

      {/* --- Asymmetrical Two-Column Core Layout Hub --- */}
      <div className="grid gap-4 lg:grid-cols-[1.5fr,1fr] items-stretch">
        
        {/* --- LEFT COLUMNS: 4-CARD VISION MATRIX GRID --- */}
        <div className="space-y-4">
          <p className="text-xs md:text-[13px] leading-relaxed text-neutral-secondaryText font-medium font-sans max-w-xl">
            GenXCode exists so that no motivated student gets limited by the syllabus. We want your college to feel like a premium tech hub—engineered with the structural guidance of{" "}
            <a 
              href="https://cosmolix.co.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative inline-block font-bold text-brand-accent group transition-colors hover:text-brand-accent/80"
            >
              Cosmolix Pvt Ltd
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-accent transition-all duration-300 group-hover:w-full" />
            </a>
            .
          </p>

          <motion.div
            className="grid gap-3 sm:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
          >
            {displayVisions.slice(0, 4).map((line, idx) => (
              <motion.article
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -2, borderColor: "rgba(0, 163, 255, 0.15)" }}
                className="group relative rounded-xl border border-white/[0.05] bg-brand-midnight/20 p-4 backdrop-blur-md transition-all flex flex-col justify-between overflow-hidden min-h-[105px]"
              >
                {/* Subtle Geometric Glow Backing */}
                <div className="absolute -right-6 -top-6 w-14 h-14 bg-brand-accent/[0.02] rounded-full blur-lg pointer-events-none group-hover:bg-brand-accent/[0.04]" />
                
                <div className="flex items-center justify-between border-b border-white/[0.03] pb-1.5 font-mono text-[9px] font-bold">
                  <span className="text-brand-accent animate-pulse">✦</span>
                  <span className="text-neutral-secondaryText/20">CORE // 0{idx + 1}</span>
                </div>

                <p className="text-xs leading-relaxed text-neutral-premiumText/90 font-medium font-sans mt-2">
                  {line}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </div>

        {/* --- RIGHT COLUMN: THE CULTURE PERSISTENCE BOX --- */}
        <motion.div
          whileHover={{ y: -2, borderColor: "rgba(0, 163, 255, 0.12)" }}
          className="relative rounded-xl border border-white/[0.06] bg-brand-midnight/40 p-5 backdrop-blur-md overflow-hidden flex flex-col justify-between shadow-[0_12px_30px_rgba(2,6,23,0.2)]"
        >
          {/* Ambient Micro Lens Flares */}
          <div className="absolute -right-12 -bottom-12 w-28 h-28 bg-brand-accent/[0.03] rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-4 font-sans">
            <div className="flex items-center gap-2 border-b border-white/[0.03] pb-2">
              <svg className="h-3.5 w-3.5 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-[10px] uppercase font-bold tracking-wider font-mono text-neutral-secondaryText/50">
                How It Feels Inside
              </p>
            </div>

            <ul className="space-y-3 text-xs text-neutral-secondaryText font-medium">
              {howItFeels.map((item, idx) => (
                <motion.li
                  key={idx}
                  className="flex items-start gap-2.5"
                  initial={{ opacity: 0, x: 8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
                >
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-brand-accent flex-shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Micro Action Message Footer */}
          <div className="mt-6 pt-3.5 border-t border-white/[0.03] text-[11px] font-medium text-brand-accent font-sans italic">
            Engineered for sustained technical progression.
          </div>
        </motion.div>

      </div>
    </motion.section>
  );
}