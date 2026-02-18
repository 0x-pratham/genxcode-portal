// src/components/BackgroundOrbs.jsx
import { motion } from "framer-motion";

export default function BackgroundOrbs() {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-slate-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* cyan blob */}
      <motion.div
        className="absolute -top-40 -left-20 h-80 w-80 rounded-full bg-cyan-500/25 blur-3xl"
        animate={{ x: [0, 30, -10, 0], y: [0, -10, 20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      {/* purple blob */}
      <motion.div
        className="absolute top-64 -right-10 h-72 w-72 rounded-full bg-purple-500/25 blur-3xl"
        animate={{ x: [0, -25, 10, 0], y: [0, 20, -15, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      />
      {/* emerald blob */}
      <motion.div
        className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl"
        animate={{ x: [0, 15, -20, 0], y: [0, 10, -10, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      {/* subtle radial darkening so content pops */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.7),_transparent_60%)]" />
    </motion.div>
  );
}
