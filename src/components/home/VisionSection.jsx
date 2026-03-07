// src/components/home/VisionSection.jsx
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const howItFeels = [
  "Weekly or bi‑weekly sessions instead of random events.",
  "Dedicated tracks for beginners, intermediate and advanced.",
  "Spaces to experiment, fail fast and learn with others.",
  "Clear growth: challenges → points → leagues → recognition.",
];

export default function VisionSection({ visions }) {
  return (
    <motion.section
      id="vision-section"
      className="space-y-6"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr] items-start">
        <div className="space-y-3">
          <motion.div
            className="flex items-center gap-3 mb-2"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-2xl">✨</span>
            <h2 className="text-xl md:text-2xl font-semibold">
              The vision behind{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-emerald-300 to-sky-300 bg-clip-text text-transparent">
                GenXCode
              </span>
            </h2>
          </motion.div>
          <p className="text-sm md:text-base text-slate-400 max-w-xl">
            GenXCode exists so that no motivated student gets limited by the syllabus. We want your college to feel like
            a mini tech hub – with teams, projects, events and mentorship running all year.
          </p>

          <motion.ul
            className="mt-3 space-y-2.5"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {visions.map((line, idx) => (
              <motion.li
                key={line}
                className="flex items-start gap-2 text-sm md:text-base text-slate-200"
                variants={itemVariants}
                whileHover={{ x: 4, scale: 1.02 }}
              >
                <motion.span
                  className="mt-[3px] h-4 w-4 rounded-full bg-cyan-500/20 border border-cyan-400/70 flex items-center justify-center text-[9px]"
                  animate={{ rotate: [0, 180, 360], scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: idx * 0.2 }}
                >
                  ✦
                </motion.span>
                <span>{line}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          className="relative overflow-hidden card bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-950/90 border border-slate-800/80 px-5 py-5 rounded-2xl shadow-xl shadow-slate-950/60 backdrop-blur-xl"
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10 opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <motion.span
                className="text-lg"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                💫
              </motion.span>
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-semibold">How it feels inside</p>
            </div>
            <ul className="space-y-2.5 text-[11px] md:text-xs text-slate-300">
              {howItFeels.map((item, idx) => (
                <motion.li
                  key={idx}
                  className="flex items-start gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
            <motion.p
              className="mt-4 text-[11px] md:text-xs bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              You bring the consistency. We bring the structure, projects and community.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
