// src/components/home/BrandBlock.jsx
import { motion } from "framer-motion";

export default function BrandBlock() {
  return (
    <motion.section
      className="mt-6 text-left max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <a
        href="https://cosmolix.co.in/"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block rounded-xl border border-white/[0.06] bg-brand-midnight/40 p-6 md:p-8 backdrop-blur-md transition-all duration-300 hover:border-brand-accent/30 hover:bg-brand-midnight/60 shadow-[0_12px_30px_rgba(2,6,23,0.25)] overflow-hidden cursor-pointer"
      >
        {/* Subtle Ambient Radial Backglow */}
        <div className="absolute -right-24 -top-24 w-56 h-56 bg-brand-accent/[0.03] rounded-full blur-3xl pointer-events-none transition-all duration-500 group-hover:bg-brand-accent/[0.06]" />
        
        {/* Micro Link Icon Indicator */}
        <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-100 group-hover:text-brand-accent transition-all duration-300">
          <svg className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>

        {/* Card Content Stage */}
        <div className="space-y-3 font-sans relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold font-mono text-brand-accent tracking-widest uppercase opacity-60 group-hover:opacity-100 transition-opacity">
                // Strategic Partnership
              </span>
              <span className="h-[1px] w-4 bg-white/[0.08]" />
            </div>
            
            <h2 className="text-base md:text-lg font-bold tracking-tight text-neutral-premiumText font-display">
              GenXCode <span className="text-neutral-secondaryText/40 font-medium">· Engineered by</span>{" "}
              <span className="relative inline-block font-bold text-brand-accent transition-colors">
                Cosmolix Pvt Ltd
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-accent transition-all duration-300 group-hover:w-full" />
              </span>
            </h2>
          </div>

          <p className="text-xs sm:text-[13px] leading-relaxed text-neutral-secondaryText font-medium max-w-2xl transition-colors group-hover:text-neutral-secondaryText/90">
            Built utilizing high-performance SaaS design principles optimized for real-time student tech cohorts. This environment delivers integrated platforms, challenges, and user tracking features custom crafted by the Cosmolix product team.
          </p>
        </div>
      </a>
    </motion.section>
  );
}