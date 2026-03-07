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
  hover: { scale: 1.04, y: -10, rotateY: 6, transition: { duration: 0.28, ease: "easeOut" } },
};

export default function CTAStrip() {
  return (
    <motion.section
      className="space-y-6"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-1">
            Choose how you want to{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">start</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400">Challenges · Leaderboard · Personal dashboard</p>
        </div>
        <motion.div
          className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-[10px] text-slate-400"
          whileHover={{ scale: 1.05, borderColor: "rgb(34, 211, 238)" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Quick access</span>
        </motion.div>
      </div>

      <motion.div
        className="grid gap-4 md:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={itemVariants}>
          <Link to="/challenges">
            <motion.div
              className="card group cursor-pointer bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 border-slate-800 px-5 py-5 hover:border-cyan-400/80 transition-all relative overflow-hidden"
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative z-10">
                <p className="text-xs text-cyan-300 mb-1">1 · Start building</p>
                <h3 className="text-sm font-semibold mb-1">Join a coding challenge</h3>
                <p className="text-[11px] text-slate-400 mb-2">
                  Pick a challenge, ship your solution on GitHub and earn points, feedback and league promotions.
                </p>
                <span className="text-[11px] text-cyan-300 inline-flex items-center gap-1">
                  Explore now <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>↗</motion.span>
                </span>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link to="/leaderboard">
            <motion.div
              className="card group cursor-pointer bg-slate-900 border-slate-800 px-5 py-5 hover:border-amber-400/80 transition-all relative overflow-hidden"
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative z-10">
                <p className="text-xs text-amber-300 mb-1">2 · Compete</p>
                <h3 className="text-sm font-semibold mb-1">Climb the leaderboard</h3>
                <p className="text-[11px] text-slate-400 mb-2">
                  Track your rank, unlock higher leagues like Silver, Gold, Platinum and more as your points grow.
                </p>
                <span className="text-[11px] text-amber-300 inline-flex items-center gap-1">
                  View top performers <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>↗</motion.span>
                </span>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link to="/dashboard">
            <motion.div
              className="card group cursor-pointer bg-slate-900 border-slate-800 px-5 py-5 hover:border-emerald-400/80 transition-all relative overflow-hidden"
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative z-10">
                <p className="text-xs text-emerald-300 mb-1">3 · Grow</p>
                <h3 className="text-sm font-semibold mb-1">Own your member dashboard</h3>
                <p className="text-[11px] text-slate-400 mb-2">
                  See your submissions, points, league, attendance streak and profile snapshot in one clean view.
                </p>
                <span className="text-[11px] text-emerald-300 inline-flex items-center gap-1">
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
