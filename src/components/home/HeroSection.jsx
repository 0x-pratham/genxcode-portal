// src/components/home/HeroSection.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const textRevealVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function HeroSection({
  onSectionScroll,
  contentTranslate,
  children,
}) {
  return (
    <motion.section
      className="relative grid gap-14 xl:gap-20 items-start lg:items-center lg:grid-cols-[1.15fr,0.85fr]"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{ y: contentTranslate }}
    >
      <motion.div
        className="space-y-10"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        {/* Top Badge */}
        <motion.div
          className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-slate-900/60 px-4 py-2 text-[11px] font-medium text-slate-100 shadow-lg shadow-violet-500/10 backdrop-blur-xl"
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.15,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          whileHover={{ scale: 1.05, y: -2 }}
        >
          <motion.span
            className="inline-flex h-2 w-2 rounded-full bg-emerald-400"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
          <span className="font-medium tracking-wide">
            GenXCode · Student Developer Community
          </span>
        </motion.div>

        {/* Heading */}
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="max-w-4xl text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold tracking-[-0.04em] leading-[0.95]"
            variants={textRevealVariants}
          >
            Turn your{" "}
            <motion.span
              className="bg-gradient-to-r from-violet-300 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent inline-block"
              animate={{
                backgroundPosition: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ backgroundSize: "200% 200%" }}
            >
              ideas into ship-ready projects
            </motion.span>{" "}
            before you graduate.
          </motion.h1>

          <motion.p
            className="max-w-2xl text-base md:text-lg leading-8 text-slate-300"
            variants={textRevealVariants}
          >
            Build real products, ship to GitHub, collaborate with a serious
            tech community and earn points, leagues & recognition as you grow.
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row flex-wrap gap-6 pt-6 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Primary CTA */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/apply">
              <motion.button
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-8 py-4 text-sm font-semibold tracking-wide text-slate-950 shadow-[0_10px_30px_rgba(34,211,238,0.22)] transition-all duration-300"
                whileHover={{
                  scale: 1.04,
                  y: -4,
                  boxShadow: "0 18px 45px rgba(34,211,238,0.30)",
                }}
              >
                <span className="relative z-[1]">
                  Start Building with GenXCode
                </span>

                <motion.span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  initial={{ opacity: 0, x: "-100%" }}
                  whileHover={{ opacity: 1, x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>
            </Link>
          </motion.div>

          {/* Secondary CTA */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/challenges">
              <motion.button
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl border border-violet-500/20 bg-[#0B1120]/90 px-8 py-4 text-sm font-semibold tracking-wide text-violet-100 shadow-[0_10px_30px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-all duration-300"
                whileHover={{
                  scale: 1.04,
                  y: -4,
                  borderColor: "rgba(34,211,238,0.5)",
                  boxShadow: "0 18px 45px rgba(34,211,238,0.18)",
                }}
              >
                <span className="relative z-[2] flex items-center gap-2">
                  Explore challenges
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>

                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-indigo-500/10 opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </Link>
          </motion.div>

          {/* Third CTA */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.button
              type="button"
              onClick={() => onSectionScroll?.("team-section")}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl border border-indigo-500/20 bg-[#0B1120]/90 px-8 py-4 text-sm font-semibold tracking-wide text-indigo-100 shadow-[0_10px_30px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-all duration-300"
              whileHover={{
                scale: 1.04,
                y: -4,
                borderColor: "rgba(129,140,248,0.5)",
                boxShadow: "0 18px 45px rgba(129,140,248,0.18)",
              }}
            >
              <span className="relative z-[2] flex items-center gap-2">
                Meet the team
                <motion.span
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ↓
                </motion.span>
              </span>

              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right Side Content */}
      {children}
    </motion.section>
  );
}