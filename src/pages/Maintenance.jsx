import { useEffect, useState } from "react";
import BackgroundOrbs from "../components/shared/BackgroundOrbs"; 
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Zap, Cpu, LayoutDashboard, Rocket } from "lucide-react";

export default function Maintenance() {
  const [counter, setCounter] = useState(99999);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let current = 99999;
    const interval = setInterval(() => {
      current -= Math.floor(Math.random() * 2500) + 1200; 
      
      if (current <= 0) {
        current = 0;
        clearInterval(interval);
        setIsReady(true);
        fireConfettiBlast();
      }
      setCounter(current);
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const fireConfettiBlast = () => {
    const duration = 4000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 12,
        angle: 60,
        spread: 80,
        origin: { x: 0 },
        colors: ["#06b6d4", "#6366f1", "#38bdf8", "#ffffff"],
      });
      confetti({
        particleCount: 12,
        angle: 120,
        spread: 80,
        origin: { x: 1 },
        colors: ["#06b6d4", "#6366f1", "#38bdf8", "#ffffff"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const formatNumber = (num) => String(num).padStart(5, "0");

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
  };

  const features = [
    { icon: <Zap className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />, text: "Zero-Latency UI" },
    { icon: <Cpu className="w-5 h-5 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" />, text: "Next-Gen LMS" },
    { icon: <LayoutDashboard className="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />, text: "Pro-Level Dashboards" },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden flex flex-col items-center justify-center font-sans">
      <BackgroundOrbs /> 
      
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 via-slate-950/90 to-indigo-600/5 pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-3xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-2xl shadow-[0_0_100px_rgba(56,189,248,0.1)] p-10 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent"></div>

          <motion.img
            whileHover={{ scale: 1.05, rotate: 2 }}
            src="https://i.ibb.co/SDYy36xJ/Logo.jpg"
            alt="GenXCode Logo"
            className="mx-auto h-24 w-24 rounded-2xl shadow-[0_0_40px_rgba(56,189,248,0.3)] mb-10 border border-slate-700/50 object-cover"
          />

          {!isReady ? (
            <div className="space-y-6 py-12">
              <h2 className="text-xl md:text-2xl font-bold text-slate-500 uppercase tracking-[0.5em] animate-pulse">
                Calibrating Future
              </h2>
              <div className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-700 tracking-widest font-mono drop-shadow-[0_0_40px_rgba(34,211,238,0.4)] tabular-nums">
                {formatNumber(counter)}
              </div>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              <motion.h1
                variants={itemVariants}
                className="text-7xl md:text-9xl font-black bg-gradient-to-br from-cyan-300 via-sky-400 to-indigo-600 bg-clip-text text-transparent drop-shadow-[0_0_60px_rgba(56,189,248,0.5)] uppercase tracking-tighter"
              >
                SOON
              </motion.h1>

              <motion.h2 
                variants={itemVariants}
                className="text-3xl md:text-5xl font-extrabold text-white mt-4 tracking-tight flex flex-col md:flex-row items-center justify-center gap-3"
              >
                GEAR UP, 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 drop-shadow-[0_0_20px_rgba(129,140,248,0.4)]">
                  JSPM UNIVERSITY!
                </span>
              </motion.h2>

              <motion.p 
                variants={itemVariants}
                className="mt-8 text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto border-t border-slate-800/80 pt-8 font-light"
              >
                We aren't just upgrading; <strong className="text-cyan-300 font-semibold">we are redefining the game.</strong> GenXCode is evolving into an elite coding powerhouse built exclusively for the brightest minds.
              </motion.p>

              <motion.div 
                variants={itemVariants}
                className="flex flex-col md:flex-row justify-center gap-6 md:gap-10 mt-10"
              >
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center justify-center gap-3 text-slate-300 text-sm md:text-base font-medium bg-slate-950/30 px-5 py-2.5 rounded-full border border-slate-800/50 hover:border-slate-600 transition-colors">
                    {feature.icon}
                    {feature.text}
                  </div>
                ))}
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="mt-14 inline-flex items-center gap-4 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-8 py-4 shadow-[0_0_30px_rgba(56,189,248,0.1)] transition-all hover:shadow-[0_0_50px_rgba(56,189,248,0.25)] hover:bg-cyan-900/40 cursor-default"
              >
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-500"></span>
                </span>
                <span className="text-cyan-400 font-bold tracking-[0.2em] uppercase text-xs md:text-sm flex items-center gap-2">
                  <Rocket className="w-4 h-4" />
                  The Next Era Begins Soon
                </span>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}