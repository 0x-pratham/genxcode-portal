// src/pages/ApplySuccess.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ApplySuccess() {
  return (
    // ❗ no bg-slate-950 so global/Orbs background stays visible
    <main className="relative min-h-screen text-slate-100 flex items-center justify-center pb-24">
      <div className="container-page max-w-xl mx-auto relative z-10">
        <motion.section
          className="flex flex-col items-center text-center space-y-5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* floating glass card */}
          <motion.div
            className="relative w-full overflow-hidden rounded-3xl bg-slate-950/90 border border-slate-800/80 px-6 py-7 md:px-8 md:py-8 shadow-2xl shadow-slate-950/80 backdrop-blur space-y-5"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* top gradient bar */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 opacity-80" />

            {/* success icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 blur-xl bg-emerald-400/40 opacity-60" />
                <div className="relative h-14 w-14 rounded-2xl bg-emerald-500/15 border border-emerald-400/70 flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-emerald-300 font-medium">
              Application submitted 🎉
            </p>

            <h1 className="text-2xl md:text-3xl font-semibold">
              Thanks for applying to GenXCode
            </h1>

            <p className="text-sm md:text-base text-slate-300">
              We&apos;ve received your application. The core team will review
              your details and get back to you by email if you are selected or
              if we need more information.
            </p>

            {/* buttons */}
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <Link to="/">
                <button className="btn-primary px-5 py-2 text-sm rounded-full">
                  Go to Home
                </button>
              </Link>

              <Link to="/challenges">
                <button className="btn-outline px-5 py-2 text-sm rounded-full">
                  View challenges
                </button>
              </Link>

              <Link to="/announcements">
                <button className="btn-outline px-5 py-2 text-sm rounded-full">
                  Announcements
                </button>
              </Link>
            </div>

            <p className="text-[11px] text-slate-500 pt-3">
              If you don&apos;t hear back in a few days, you can reach out to
              the GenXCode team or re‑submit with updated details.
            </p>
          </motion.div>
        </motion.section>
      </div>
    </main>
  );
}
