// src/components/home/HeroSection.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const textRevealVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function HeroSection({ onSectionScroll, contentTranslate, children }) {
  return (
    <motion.section
      className="grid gap-12 items-start lg:items-center lg:grid-cols-[1.2fr,1fr]"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{ y: contentTranslate }}
    >
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-300 shadow-lg shadow-cyan-500/15 backdrop-blur"
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, type: "spring", stiffness: 200, damping: 15 }}
          whileHover={{ scale: 1.05, y: -2 }}
        >
          <motion.span
            className="inline-flex h-2 w-2 rounded-full bg-emerald-400"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="font-medium tracking-wide">GenXCode · Student Developer Community</span>
        </motion.div>

        <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight leading-tight md:leading-[1.05]"
            variants={textRevealVariants}
          >
            Turn your{" "}
            <motion.span
              className="bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400 bg-clip-text text-transparent inline-block"
              animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% 200%" }}
            >
              ideas into ship‑ready projects
            </motion.span>{" "}
            before you graduate.
          </motion.h1>
          <motion.p className="text-sm md:text-base text-slate-400 max-w-xl" variants={textRevealVariants}>
            Build real products, ship to GitHub, collaborate with a serious tech community and earn points,
            leagues & recognition as you grow.
          </motion.p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row flex-wrap gap-4 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
            <Link to="/apply">
              <motion.button
                className="relative overflow-hidden group btn-primary px-7 py-3 text-sm font-medium shadow-xl shadow-cyan-500/40 transition"
                whileHover={{ boxShadow: "0 20px 40px rgba(34, 211, 238, 0.4)" }}
              >
                <span className="relative z-[1]">Start Building with GenXCode</span>
                <motion.span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-400/40 via-sky-500/30 to-indigo-500/40"
                  initial={{ opacity: 0, x: "-100%" }}
                  whileHover={{ opacity: 1, x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
            <Link to="/challenges">
              <motion.button
                className="btn-outline px-7 py-3 text-sm font-medium transition"
                whileHover={{
                  y: -2,
                  borderColor: "rgb(34, 211, 238)",
                  boxShadow: "0 10px 30px rgba(34, 211, 238, 0.2)",
                }}
              >
                Explore challenges
              </motion.button>
            </Link>
          </motion.div>

          <motion.button
            type="button"
            variants={itemVariants}
            whileHover={{ x: 4, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xs md:text-sm text-slate-400 hover:text-cyan-300 transition"
            onClick={() => onSectionScroll?.("team-section")}
          >
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block"
            >
              Meet the team ↓
            </motion.span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Right column – passed as children (HeroBenefitSlider) */}
      {children}
    </motion.section>
  );
}
