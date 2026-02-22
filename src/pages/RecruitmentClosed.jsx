import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function RecruitmentClosed() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 text-slate-100 overflow-hidden">

    {/* Ultra Premium Layered Background */}
<div className="absolute inset-0 -z-10 overflow-hidden">

  {/* Deep base gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]" />

  {/* Top subtle cyan radial */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(34,211,238,0.08),transparent_40%)]" />

  {/* Bottom subtle indigo radial */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.08),transparent_45%)]" />

  {/* Animated soft floating glow 1 */}
  <motion.div
    animate={{ x: [0, 60, -40, 0], y: [0, -40, 40, 0] }}
    transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
    className="absolute top-[-250px] left-[-250px] w-[700px] h-[700px] bg-cyan-500/10 blur-[120px] rounded-full"
  />

  {/* Animated soft floating glow 2 */}
  <motion.div
    animate={{ x: [0, -50, 30, 0], y: [0, 50, -30, 0] }}
    transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
    className="absolute bottom-[-250px] right-[-250px] w-[700px] h-[700px] bg-indigo-500/10 blur-[120px] rounded-full"
  />

  {/* Subtle vignette for cinematic depth */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(2,6,23,0.6))]" />

</div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative text-center max-w-2xl"
      >
        {/* Small top label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-6"
        >
          GenXCode Recruitment
        </motion.p>

        {/* Animated Icon */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-6xl mb-8"
        >
          🚫
        </motion.div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Recruitment is Closed
        </h1>

        {/* Sub text */}
        <p className="mt-6 text-slate-400 text-base md:text-lg leading-relaxed">
          Thank you for your interest in joining{" "}
          <span className="text-cyan-400 font-medium">GenXCode</span>.
          This recruitment cycle has officially concluded.
          Stay tuned for future opportunities.
        </p>

        {/* Minimal Divider */}
        <div className="w-16 h-px bg-slate-700 mx-auto my-10" />

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <button className="px-7 py-3 rounded-full bg-white text-black text-sm font-medium hover:opacity-90 transition-all">
              Back to Home
            </button>
          </Link>

          <Link to="/announcements">
            <button className="px-7 py-3 rounded-full border border-slate-700 text-sm text-slate-300 hover:border-slate-500 hover:text-white transition-all">
              View Updates
            </button>
          </Link>
        </div>

        {/* Bottom subtle text */}
        <p className="mt-10 text-xs text-slate-600">
          Follow announcements for the next cycle.
        </p>
      </motion.div>
    </div>
  );
}