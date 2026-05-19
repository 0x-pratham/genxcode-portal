// src/components/home/WelcomeBanner.jsx
import { motion } from "framer-motion";

export default function WelcomeBanner() {
  return (
    <motion.div
      className="mx-auto max-w-2xl rounded-full border border-white/[0.06] bg-brand-midnight/40 p-1.5 pr-5 backdrop-blur-md shadow-[0_12px_40px_rgba(2,6,23,0.25)] flex items-center gap-3 w-fit"
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Dynamic Humanized Accent Tag */}
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-accent/[0.08] border border-brand-accent/20 text-[11px] font-semibold tracking-wider uppercase text-brand-accent font-display shrink-0">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-accent"></span>
        </span>
        Portal Live
      </span>

      {/* Structured Text Treatment */}
      <p className="text-[13px] tracking-wide text-neutral-secondaryText font-medium line-clamp-1">
        <span className="text-neutral-premiumText font-semibold font-sans">Welcome to GenXCode</span>
        <span className="mx-2 text-white/20">—</span>
        Build production projects, master custom tracks, and climb the elite engineering leagues.
      </p>
    </motion.div>
  );
}