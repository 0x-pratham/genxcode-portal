import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

export default function LegalLayout({ title, accent, children }) {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100 overflow-hidden">

      {/* Scroll progress */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 z-50"
        style={{ width }}
      />

      {/* Animated glow orbs */}
      <motion.div
        className={`absolute -top-40 -left-32 h-96 w-96 rounded-full blur-3xl ${accent}`}
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div
        className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 space-y-10">

        {/* Back button */}
        <motion.div whileHover={{ x: -4 }}>
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-cyan-300 transition"
          >
            ← Back to Home
          </Link>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl md:text-5xl font-semibold tracking-tight bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {title}
        </motion.h1>

        {/* Glass Card */}
        <motion.div
          className="relative rounded-3xl border border-slate-800 bg-slate-950/70 p-10 shadow-2xl backdrop-blur-xl overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Shine sweep */}
          <motion.div
            className="absolute inset-y-0 -left-1/3 w-1/3"
            initial={{ x: "-120%", rotate: -15 }}
            animate={{ x: ["-120%", "140%"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%)",
              mixBlendMode: "screen",
            }}
          />

          <div className="relative z-10 space-y-6 text-sm text-slate-300 leading-relaxed">
            {children}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
