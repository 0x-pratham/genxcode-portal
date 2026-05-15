// src/components/home/CTAStrip.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const cardHoverVariants = {
  rest: { scale: 1, y: 0, rotateY: 0, boxShadow: "0 6px 16px rgba(2,6,23,0.6)" },
  hover: { scale: 1.02, y: -6, transition: { duration: 0.28, ease: "easeOut" } },
};

export default function CTAStrip() {
  return (
    <motion.section
      className="space-y-10"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="max-w-2xl text-3xl md:text-4xl font-bold tracking-[-0.03em] leading-tight">
            Choose how you want to{" "}
            <span className="bg-gradient-to-r from-violet-300 to-emerald-300 bg-clip-text text-transparent">start</span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-400">Challenges · Leaderboard · Personal dashboard</p>
        </div>
        <motion.div
          className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-[10px] text-slate-400"
          whileHover={{ scale: 1.05, borderColor: "rgb(34, 211, 238)" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
          <span>Quick access</span>
        </motion.div>
      </div>

      <motion.div
        className="grid gap-6 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={itemVariants}>
          <Link to="/challenges">
            <motion.div
              className="group relative overflow-hidden rounded-[30px] border border-slate-800/80 bg-gradient-to-b from-slate-900/95 to-slate-950/95 px-6 py-7 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-violet-400/40 hover:shadow-[0_25px_60px_rgba(34,211,238,0.12)]"
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative z-10">
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">1 · Start building</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">Join a coding challenge</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Pick a challenge, ship your solution on GitHub and earn points, feedback and league promotions.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-violet-300">
                  Explore now <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>↗</motion.span>
                </span>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link to="/leaderboard">
            <motion.div
              className="group relative overflow-hidden rounded-[30px] border border-slate-800/80 bg-gradient-to-b from-slate-900/95 to-slate-950/95 px-6 py-7 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-amber-400/40 hover:shadow-[0_25px_60px_rgba(251,191,36,0.12)]"
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative z-10">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">2 · Compete</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">Climb the leaderboard</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Track your rank, unlock higher leagues like Silver, Gold, Platinum and more as your points grow.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-amber-300">
                  View top performers <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>↗</motion.span>
                </span>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link to="/dashboard">
            <motion.div
              className="group relative overflow-hidden rounded-[30px] border border-slate-800/80 bg-gradient-to-b from-slate-900/95 to-slate-950/95 px-6 py-7 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-emerald-400/40 hover:shadow-[0_25px_60px_rgba(16,185,129,0.12)]"
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative z-10">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">3 · Grow</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">Own your member dashboard</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  See your submissions, points, league, attendance streak and profile snapshot in one clean view.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-emerald-300">
                  Go to dashboard <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>↗</motion.span>
                </span>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
