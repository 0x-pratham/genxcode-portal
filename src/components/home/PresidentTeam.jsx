// src/components/home/PresidentTeam.jsx
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.08, delayChildren: 0.05 } 
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 16 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
  },
};

const executionStrategy = [
  {
    type: "Club Vision",
    label: "CULTIVATING TECHNICAL EXCELLENCE",
    desc: "Transform GenXCode into a premium crucible for production-ready engineers by setting industry-aligned code quality parameters, establishing elite branch guidelines, and standardizing architectural best practices across all technical tracks.",
    accent: "text-brand-accent",
    glow: "bg-brand-accent/[0.03]"
  },
  {
    type: "Club Mission",
    label: "AUTONOMOUS PIPELINES & IMPACT",
    desc: "Empower members through rigorous, collaborative sprint environments where they design micro-services, deploy continuous integration pipelines, build robust open-source systems, and earn quantifiable recognition metrics.",
    accent: "text-emerald-400",
    glow: "bg-emerald-500/[0.02]"
  }
];

export default function PresidentTeam() {
  return (
    <motion.section
      id="executor-section"
      className="space-y-6 text-left max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* --- Section Header Row --- */}
      <div className="flex flex-col gap-1 border-b border-white/[0.04] pb-4">
        <span className="text-[10px] font-bold tracking-[0.2em] text-brand-accent uppercase font-display">
          Operational Command
        </span>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-premiumText font-display">
          Executive Execution Strategy
        </h2>
      </div>

      {/* --- Asymmetrical Split Screen Core Layout --- */}
      <div className="grid gap-4 lg:grid-cols-[1.1fr,1.3fr] items-stretch">
        
        {/* Left Side: Profile Spotlight Box */}
        <div className="relative rounded-xl border border-white/[0.06] bg-brand-midnight/40 p-6 backdrop-blur-md flex flex-col justify-between overflow-hidden shadow-[0_12px_30px_rgba(2,6,23,0.2)]">
          {/* Top Decorative Micro Accent Line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-brand-accent via-sky-400 to-transparent" />
          <div className="absolute -left-12 -top-12 w-32 h-32 bg-brand-accent/[0.04] rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div>
              <p className="text-[9px] font-bold font-mono text-brand-accent tracking-widest uppercase mb-1">
                // Operational Leadership
              </p>
              <h3 className="text-lg font-bold text-neutral-premiumText font-display tracking-tight">
                Samruddhi Shelke
              </h3>
              <p className="text-xs text-neutral-secondaryText/60 font-medium font-sans">
                Club Executor · GenXCode
              </p>
            </div>

            <p className="text-xs md:text-[13px] leading-relaxed text-neutral-premiumText/90 font-medium italic font-sans border-l-2 border-brand-accent/30 pl-3.5">
              "Great platforms aren't simply conceptualized—they are systematically executed. At GenXCode, our objective is to engineer a culture where technical intent seamlessly translates into production-grade deployments."
            </p>
          </div>

          <div className="border-t border-white/[0.04] pt-4 mt-6 relative z-10 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse" />
            <p className="text-[10px] uppercase font-bold tracking-wider font-mono text-neutral-secondaryText/40">
              Status // Active Execution Node
            </p>
          </div>
        </div>

        {/* Right Side: Vision & Mission Matrix */}
        <motion.div 
          className="flex flex-col gap-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          {executionStrategy.map((strategy, idx) => (
            <motion.article
              key={idx}
              variants={itemVariants}
              whileHover={{ x: 4, borderColor: "rgba(255, 255, 255, 0.12)" }}
              className="group relative rounded-xl border border-white/[0.05] bg-brand-midnight/20 p-5 backdrop-blur-md transition-all flex flex-col justify-between overflow-hidden shadow-[0_8px_24px_rgba(2,6,23,0.15)]"
            >
              {/* Internal Accent Glow Backplates */}
              <div className={`absolute -right-10 -bottom-10 w-24 h-24 ${strategy.glow} rounded-full blur-xl pointer-events-none transition-all group-hover:scale-125`} />

              <div className="space-y-2 relative z-10 font-sans">
                <div className="flex items-center justify-between border-b border-white/[0.03] pb-1.5">
                  <span className={`text-[10px] font-bold font-mono ${strategy.accent} tracking-widest uppercase`}>
                    // {strategy.type}
                  </span>
                  <span className="text-[9px] font-bold font-mono text-neutral-secondaryText/20">
                    OBJ_0{idx + 1}
                  </span>
                </div>
                
                <h4 className="text-xs font-bold tracking-wide text-neutral-premiumText font-display">
                  {strategy.label}
                </h4>
                
                <p className="text-xs leading-relaxed text-neutral-secondaryText font-medium">
                  {strategy.desc}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>

      </div>
    </motion.section>
  );
}