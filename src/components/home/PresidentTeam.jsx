// src/components/home/PresidentTeam.jsx
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function PresidentTeam({ presidentTeam }) {
  return (
    <motion.section
      className="space-y-5"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">
            Meet our <span className="text-cyan-300">President Team</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mt-1">
            Four presidents jointly shaping strategy, execution and member experience across the whole community.
          </p>
        </div>
        <p className="text-[11px] text-slate-500">4 Presidents · Operations · Tech · Community · Growth</p>
      </div>

      <motion.div
        className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {presidentTeam.map((p) => (
          <motion.div
            key={p.name}
            className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 shadow-lg shadow-slate-950/40"
            variants={itemVariants}
            whileHover={{
              y: -8,
              scale: 1.03,
              rotateY: 5,
              boxShadow: "0 20px 40px rgba(34, 211, 238, 0.2)",
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-cyan-400 via-emerald-400 to-sky-500 opacity-80" />
            <p className="text-[11px] text-cyan-300 mb-1">{p.role}</p>
            <h3 className="text-sm font-semibold">{p.name}</h3>
            <p className="text-[11px] text-slate-400 mb-1.5">{p.role}</p>
            <p className="text-[11px] text-slate-300 mb-1.5">{p.focus}</p>
            <p className="text-[10px] text-slate-500">{p.yearBranch}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
