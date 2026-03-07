// src/components/home/WelcomeBanner.jsx
import { motion } from "framer-motion";

export default function WelcomeBanner() {
  return (
    <motion.div
      className="mx-auto max-w-4xl rounded-2xl border border-slate-800/60 bg-slate-900/60 px-4 py-3 text-center text-sm text-slate-300 backdrop-blur-sm shadow-lg"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <span className="font-medium text-slate-200">Welcome to GenXCode</span>
      <span className="ml-2 text-slate-400">— Build projects, join tracks and climb the leagues.</span>
    </motion.div>
  );
}
