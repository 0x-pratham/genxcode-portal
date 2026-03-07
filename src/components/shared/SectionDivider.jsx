// src/components/shared/SectionDivider.jsx
import { motion } from "framer-motion";

const gradientOptions = {
  cyan: "from-cyan-400 to-fuchsia-500",
  emerald: "from-emerald-400 to-cyan-500",
  purple: "from-purple-400 to-pink-500",
};

export default function SectionDivider({ variant = "cyan", delay = 0 } = {}) {
  const gradient = gradientOptions[variant] || gradientOptions.cyan;

  return (
    <motion.div
      className="relative py-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 flex items-center">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        <div className="px-4">
          <motion.div
            className={`h-2 w-2 rounded-full bg-gradient-to-br ${gradient}`}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay }}
          />
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      </div>
    </motion.div>
  );
}
