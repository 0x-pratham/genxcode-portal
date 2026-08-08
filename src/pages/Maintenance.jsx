import { useEffect, useState } from "react";
import BackgroundOrbs from "../components/shared/BackgroundOrbs";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Zap, Cpu, LayoutDashboard, Rocket } from "lucide-react";

export default function Maintenance() {
  // 12 hours countdown
  const TWELVE_HOURS = 12 * 60 * 60 * 1000;
  const COUNTDOWN_STORAGE_KEY = "genxcode-maintenance-end-time";

  const [timeLeft, setTimeLeft] = useState(TWELVE_HOURS);
  const [isReady, setIsReady] = useState(false);

  // Moved confetti blast above useEffect to avoid initialization errors
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

  useEffect(() => {
    // Get previously saved end time
    let targetTime = Number(localStorage.getItem(COUNTDOWN_STORAGE_KEY));

    // First visit: create a new 12-hour countdown
    if (!targetTime || Number.isNaN(targetTime)) {
      targetTime = Date.now() + TWELVE_HOURS;
      localStorage.setItem(COUNTDOWN_STORAGE_KEY, String(targetTime));
    }

    const updateCountdown = () => {
      const remaining = targetTime - Date.now();

      if (remaining <= 0) {
        setTimeLeft(0);
        setIsReady(true);
        fireConfettiBlast(); // Triggers confetti when time is up

        // Prevent the countdown from being recreated after expiry
        localStorage.setItem(COUNTDOWN_STORAGE_KEY, String(targetTime));
        return;
      }

      setTimeLeft(remaining);
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const getTimeUnits = () => {
    const totalSeconds = Math.floor(timeLeft / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const { days, hours, minutes, seconds } = getTimeUnits();

  const formatNumber = (num) => String(num).padStart(2, "0");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
      },
    },
  };

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

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden flex items-center justify-center">
      {/* Background */}
      <BackgroundOrbs />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 via-slate-950/90 to-indigo-600/5 pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-3xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-2xl shadow-[0_0_100px_rgba(56,189,248,0.1)] p-8 md:p-16 text-center relative overflow-hidden"
        >
          {/* Top Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />

          {/* Logo */}
          <motion.img
            whileHover={{ scale: 1.05, rotate: 2 }}
            src="https://i.ibb.co/SDYy36xJ/Logo.jpg"
            alt="GenXCode Logo"
            className="mx-auto h-24 w-24 rounded-2xl shadow-[0_0_40px_rgba(56,189,248,0.3)] mb-8 border border-slate-700/50 object-cover"
          />

          {!isReady ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Heading */}
              <div className="space-y-3">
                <h2 className="text-sm md:text-base font-bold text-cyan-400 uppercase tracking-[0.45em]">
                  System Upgrade In Progress
                </h2>

                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                  Something{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
                    Bigger
                  </span>{" "}
                  Is Coming
                </h1>
              </div>

              {/* Countdown */}
              <div className="grid grid-cols-4 gap-2 md:gap-5 max-w-3xl mx-auto pt-4">
                {/* Days */}
                <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/60 backdrop-blur-xl p-4 md:p-6 shadow-[0_0_30px_rgba(6,182,212,0.08)]">
                  <div className="text-4xl md:text-6xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-700 tabular-nums">
                    {formatNumber(days)}
                  </div>

                  <div className="mt-2 text-[10px] md:text-xs text-slate-500 uppercase tracking-[0.3em] font-bold">
                    Days
                  </div>
                </div>

                {/* Hours */}
                <div className="rounded-2xl border border-indigo-500/20 bg-slate-950/60 backdrop-blur-xl p-4 md:p-6 shadow-[0_0_30px_rgba(99,102,241,0.08)]">
                  <div className="text-4xl md:text-6xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-indigo-300 to-indigo-700 tabular-nums">
                    {formatNumber(hours)}
                  </div>

                  <div className="mt-2 text-[10px] md:text-xs text-slate-500 uppercase tracking-[0.3em] font-bold">
                    Hours
                  </div>
                </div>

                {/* Minutes */}
                <div className="rounded-2xl border border-sky-500/20 bg-slate-950/60 backdrop-blur-xl p-4 md:p-6 shadow-[0_0_30px_rgba(14,165,233,0.08)]">
                  <div className="text-4xl md:text-6xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-sky-300 to-sky-700 tabular-nums">
                    {formatNumber(minutes)}
                  </div>

                  <div className="mt-2 text-[10px] md:text-xs text-slate-500 uppercase tracking-[0.3em] font-bold">
                    Minutes
                  </div>
                </div>

                {/* Seconds */}
                <div className="rounded-2xl border border-purple-500/20 bg-slate-950/60 backdrop-blur-xl p-4 md:p-6 shadow-[0_0_30px_rgba(168,85,247,0.08)]">
                  <div className="text-4xl md:text-6xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-purple-300 to-purple-700 tabular-nums">
                    {formatNumber(seconds)}
                  </div>

                  <div className="mt-2 text-[10px] md:text-xs text-slate-500 uppercase tracking-[0.3em] font-bold">
                    Seconds
                  </div>
                </div>
              </div>

              {/* Apology */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-2xl mx-auto mt-8 rounded-2xl border border-slate-800/80 bg-slate-950/40 px-6 py-5"
              >
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  <span className="text-white font-semibold">
                    We sincerely apologize for the delay.
                  </span>{" "}
                  The upgrade is taking a little more time than we originally
                  expected. We’re working hard behind the scenes to make sure
                  everything is stable, polished and ready for you.
                </p>

                <p className="mt-3 text-cyan-400 font-medium text-sm">
                  Thank you for your patience and understanding. 💙
                </p>
              </motion.div>

              {/* Features */}
              <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-5 mt-8">
                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + idx * 0.15 }}
                    className="flex items-center justify-center gap-3 text-slate-300 text-xs md:text-sm font-medium bg-slate-950/40 px-5 py-3 rounded-full border border-slate-800/50 hover:border-slate-600 transition-colors"
                  >
                    {feature.icon}
                    {feature.text}
                  </motion.div>
                ))}
              </div>

              {/* Status */}
              <div className="mt-10 inline-flex items-center gap-4 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-6 py-3 shadow-[0_0_30px_rgba(56,189,248,0.1)]">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-500" />
                </span>

                <span className="text-cyan-400 font-bold tracking-[0.15em] uppercase text-[10px] md:text-xs flex items-center gap-2">
                  <Rocket className="w-4 h-4" />
                  Building The Next Era
                </span>
              </div>
            </motion.div>
          ) : (
            /* READY SCREEN */
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
                LIVE
              </motion.h1>

              <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-5xl font-extrabold text-white mt-4 tracking-tight"
              >
                WELCOME TO THE{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  NEXT ERA!
                </span>
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="mt-8 text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
              >
                The new GenXCode experience is finally ready.
                <strong className="text-cyan-300 font-semibold">
                  {" "}
                  Let's build something incredible.
                </strong>
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="mt-10 inline-flex items-center gap-3 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-8 py-4"
              >
                <Rocket className="w-5 h-5 text-cyan-400" />

                <span className="text-cyan-400 font-bold tracking-[0.2em] uppercase text-xs md:text-sm">
                  GenXCode Is Now Live
                </span>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}