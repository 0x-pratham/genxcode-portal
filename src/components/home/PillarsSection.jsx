// src/components/home/PillarsSection.jsx
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function PillarsSection({ pillars }) {
  return (
    <motion.section
      className="space-y-6"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl md:text-2xl font-semibold">How GenXCode works for you</h2>
        <p className="text-[11px] md:text-xs text-slate-500">Build · Learn · Get noticed</p>
      </div>

      <motion.div
        className="grid gap-4 md:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {pillars.map((p) => (
          <motion.div
            key={p.title}
            className="card bg-slate-950/80 border border-slate-800 px-5 py-5 rounded-2xl transition-all relative overflow-hidden"
            variants={itemVariants}
            whileHover={{
              y: -8,
              scale: 1.03,
              borderColor: "rgba(34, 211, 238, 0.6)",
              boxShadow: "0 20px 40px rgba(34, 211, 238, 0.25)",
            }}
          >
            <div className="relative z-10">
              <motion.p className="text-[11px] text-cyan-300 mb-1" whileHover={{ x: 4 }}>
                {p.tag}
              </motion.p>
              <h3 className="text-sm font-semibold mb-1.5">{p.title}</h3>
              <p className="text-[11px] md:text-xs text-slate-300">{p.text}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
