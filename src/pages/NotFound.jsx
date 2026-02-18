// src/pages/NotFound.jsx
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
// prevent false-positive 'unused' warnings from static checker
void motion;
import { useState } from "react";

export default function NotFound() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [goto, setGoto] = useState("");

  return (
    <main className="relative min-h-screen text-slate-100 flex items-center pb-20 overflow-hidden">
      {/* Background orbs (respect reduced motion) */}
      <motion.div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        initial={shouldReduceMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute -top-40 -left-20 h-80 w-80 rounded-full bg-cyan-500/25 blur-3xl"
          animate={shouldReduceMotion ? {} : { x: [0, 30, -10, 0], y: [0, -15, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-60 -right-10 h-72 w-72 rounded-full bg-fuchsia-500/25 blur-3xl"
          animate={shouldReduceMotion ? {} : { x: [0, -20, 10, 0], y: [0, 15, -15, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl"
          animate={shouldReduceMotion ? {} : { x: [0, 20, -20, 0], y: [0, 12, -12, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.85),_transparent_65%)]" />
      </motion.div>

      <div className="container-page relative z-10 max-w-xl mx-auto text-center space-y-7">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-3"
        >
          <p className="text-sm text-slate-400">Oops…</p>
          <div className="flex items-center justify-center gap-3">
            <motion.div
              className="text-4xl"
              animate={shouldReduceMotion ? {} : { rotate: [0, 12, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              🚀
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
              404 – Page not found
            </h1>
          </div>

          <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto">
            The page you’re looking for doesn’t exist or has moved.
            Use the navigation above or jump to the main sections of GenXCode.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative p-6 rounded-3xl bg-slate-950/90 border border-slate-800/70 shadow-xl shadow-slate-950/70 backdrop-blur-sm"
        >
          <motion.div
            className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-cyan-500/40 via-slate-900/30 to-fuchsia-500/40 blur-xl opacity-70"
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative space-y-5">
            <p className="text-[13px] text-slate-400">Quickly jump to a route (try <span className="text-cyan-300">/dashboard</span> or <span className="text-cyan-300">/challenges</span>):</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!goto) return;
                const path = goto.startsWith("/") ? goto : `/${goto}`;
                setGoto("");
                navigate(path);
              }}
              className="flex items-center gap-2 justify-center"
            >
              <input
                value={goto}
                onChange={(e) => setGoto(e.target.value)}
                placeholder="/dashboard or /challenges"
                className="input-base w-64"
                aria-label="Go to path"
              />
              <button type="submit" className="btn-primary px-4 py-2 text-sm">Go</button>
            </form>

            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/">
                <button className="btn-primary px-5 py-2 text-sm">Home</button>
              </Link>
              <Link to="/dashboard">
                <button className="btn-outline px-5 py-2 text-sm">Dashboard</button>
              </Link>
              <Link to="/challenges">
                <button className="btn-outline px-5 py-2 text-sm">Challenges</button>
              </Link>
            </div>

            <p className="text-[11px] text-slate-500">If you typed the URL manually, check spelling. Click "Report" to send a quick note and we’ll investigate.</p>

            <div className="flex justify-center mt-2">
              <a href="mailto:hello@genxcode.example?subject=Broken%20link%20404" className="text-[11px] text-slate-400 hover:text-cyan-300">Report broken link</a>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
