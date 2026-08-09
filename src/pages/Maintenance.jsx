import { useEffect, useState, useCallback } from "react";
import BackgroundOrbs from "../components/shared/BackgroundOrbs";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Zap, Cpu, LayoutDashboard, Rocket, Sparkles } from "lucide-react";

export default function Maintenance() {
  const [isCelebrating, setIsCelebrating] = useState(false);

  // Long-lasting unique celebration (Fireworks effect)
  const launchCelebration = useCallback(() => {
    if (isCelebrating) return;
    setIsCelebrating(true);

    const duration = 15 * 1000; // 15 seconds of continuous fireworks
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        setIsCelebrating(false);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Left side fireworks
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#06b6d4", "#6366f1", "#38bdf8", "#ffffff", "#a855f7"],
      });
      
      // Right side fireworks
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#06b6d4", "#6366f1", "#38bdf8", "#ffffff", "#a855f7"],
      });
    }, 250);
  }, [isCelebrating]);

  // Trigger celebration on mount
  useEffect(() => {
    launchCelebration();
  }, [launchCelebration]);

  const features = [
    {
      icon: <Zap className="w-4 h-4 text-cyan-400" />,
      text: "Zero-Latency UI",
    },
    {
      icon: <Cpu className="w-4 h-4 text-indigo-400" />,
      text: "Next-Gen LMS",
    },
    {
      icon: <LayoutDashboard className="w-4 h-4 text-sky-400" />,
      text: "Pro-Level Dashboards",
    },
  ];

  // FIXED: Moved dynamic classes OUTSIDE the JSX to prevent Vite/Babel parser crashes
  const buttonBase = "group relative inline-flex items-center gap-3 rounded-full px-8 py-4 font-bold tracking-wide transition-all overflow-hidden ";
  const buttonActive = buttonBase + "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] hover:-translate-y-1";
  const buttonDisabled = buttonBase + "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700";
  
  const currentButtonClass = isCelebrating ? buttonDisabled : buttonActive;
  const currentIconClass = isCelebrating ? "w-5 h-5 text-slate-400" : "w-5 h-5 text-slate-900";

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden flex items-center justify-center">
      {/* Background Orbs */}
      <BackgroundOrbs />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 via-slate-950/90 to-indigo-600/5 pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl px-4 py-12 md:py-20 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full rounded-[2.5rem] border border-slate-800/60 bg-slate-900/40 backdrop-blur-2xl shadow-[0_0_100px_rgba(56,189,248,0.1)] p-8 md:p-16 text-center relative overflow-hidden"
        >
          {/* Top Glow Accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />

          {/* Logo Animation */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative mx-auto w-24 h-24 mb-10"
          >
            <div className="absolute inset-0 bg-cyan-500/20 rounded-2xl blur-xl animate-pulse" />
            <img
              src="https://i.ibb.co/SDYy36xJ/Logo.jpg"
              alt="GenXCode Logo"
              className="relative h-24 w-24 rounded-2xl shadow-[0_0_40px_rgba(56,189,248,0.3)] border border-slate-700/50 object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Heading Section */}
            <div className="space-y-4">

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight">
                Get Ready For <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 drop-shadow-sm">
                  What's Coming Soon
                </span>
              </h1>
              
              <p className="max-w-2xl mx-auto mt-6 text-slate-400 text-base md:text-lg leading-relaxed">
                We are actively crafting a brand new, next-generation experience. 
                The wait is almost over. Prepare to be amazed.
              </p>
            </div>

            {/* Features List */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-5 pt-6 pb-2">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.15 }}
                  className="flex items-center gap-3 text-slate-300 text-xs md:text-sm font-medium bg-slate-950/40 px-5 py-3 rounded-full border border-slate-800/50 hover:border-slate-600 hover:bg-slate-800/40 transition-all cursor-default"
                >
                  {feature.icon}
                  {feature.text}
                </motion.div>
              ))}
            </div>

            {/* Interactive Celebration Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="pt-6"
            >
              <button
                onClick={launchCelebration}
                disabled={isCelebrating}
                className={currentButtonClass}
              >
                {!isCelebrating && (
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                )}
                <Rocket className={currentIconClass} />
                <span className="relative z-10 uppercase text-sm md:text-base">
                  {isCelebrating ? "Magic In Progress..." : "Trigger The Magic"}
                </span>
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}