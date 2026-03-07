// src/components/home/BrandBlock.jsx
import { motion } from "framer-motion";

export default function BrandBlock() {
  return (
    <motion.section
      className="mt-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="relative overflow-hidden rounded-3xl border border-cyan-400/40 bg-slate-950/90 px-5 py-4 md:px-7 md:py-5 shadow-[0_0_40px_rgba(34,211,238,0.35)]"
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.div
          className="pointer-events-none absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-fuchsia-500/20 to-emerald-400/20 blur-2xl opacity-70"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
          initial={{ x: "-120%", rotate: -15 }}
          animate={{ x: ["-120%", "140%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%)",
            mixBlendMode: "screen",
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Crafted with care</p>
            <h2 className="text-lg md:text-xl font-semibold">
              <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-300 bg-clip-text text-transparent">
                GenXCode
              </span>{" "}
              <span className="text-slate-200">· A product by</span>{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                Cosmolix Pvt Ltd
              </span>
            </h2>
            <p className="text-[11px] md:text-xs text-slate-400 max-w-xl">
              Built like a real SaaS platform for student communities – with dashboards, leagues, challenges and admin
              tools designed by the Cosmolix product team.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] md:text-xs text-slate-300">
            <div className="flex flex-col items-start">
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/50 bg-cyan-500/10 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Powered by Cosmolix</span>
              </span>
              <span className="mt-1 text-slate-500">Enterprise-level thinking, tuned for campus scale.</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
