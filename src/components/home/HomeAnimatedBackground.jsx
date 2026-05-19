// src/components/home/HomeAnimatedBackground.jsx
import { useMemo, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function HomeAnimatedBackground() {
  const shouldReduce = useReducedMotion();
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const check = () => setIsLargeScreen(window.innerWidth > 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Structural coordinate matrices for engineering depth nodes
  const particles = useMemo(() => [
    { width: 3, height: 3, left: 12, top: 18, duration: 7, delay: 0 },
    { width: 2, height: 2, left: 78, top: 28, duration: 6, delay: 0.8 },
    { width: 4, height: 4, left: 42, top: 58, duration: 8, delay: 1.2 },
    { width: 2, height: 2, left: 88, top: 72, duration: 5, delay: 1.6 },
    { width: 3, height: 3, left: 22, top: 84, duration: 7, delay: 0.4 }
  ], []);

  const stars = useMemo(() => [
    { left: 6, top: 12, size: 1.5, delay: 0 },
    { left: 28, top: 24, size: 1.2, delay: 0.4 },
    { left: 52, top: 14, size: 1.5, delay: 0.8 },
    { left: 74, top: 38, size: 1.2, delay: 0.2 },
    { left: 38, top: 78, size: 1.5, delay: 1.0 },
    { left: 82, top: 22, size: 1.2, delay: 0.6 }
  ], []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-brand-cosmos pointer-events-none select-none">
      
      {/* --- LAYER 1: PREMIUM AMBIENT BACKGLOW NODES --- */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/[0.02] rounded-full blur-[140px] transform -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-[40%] right-[15%] w-[500px] h-[500px] bg-purple-500/[0.015] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-[20%] w-[600px] h-[600px] bg-emerald-500/[0.01] rounded-full blur-[150px] transform translate-y-1/3 pointer-events-none" />

      {/* --- LAYER 2: ELEGANT DIGITAL MATRIX NETWORK MESH --- */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.012]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="cyber-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cyber-grid)" />
      </svg>

      {/* --- LAYER 3: STABILIZED FLOATING TELEMETRY NODES --- */}
      {!shouldReduce && isLargeScreen && (
        <>
          {/* Micro Particles Track Row */}
          {particles.map((p, idx) => (
            <motion.div
              key={`part-${idx}`}
              className="absolute rounded-full bg-cyan-400/20 shadow-[0_0_8px_rgba(34,211,238,0.25)]"
              style={{
                width: p.width,
                height: p.height,
                left: `${p.left}%`,
                top: `${p.top}%`,
              }}
              animate={{
                y: [0, -16, 0],
                opacity: [0.25, 0.6, 0.25],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Micro Celestial Anchor Pins */}
          {stars.map((s, idx) => (
            <motion.div
              key={`star-${idx}`}
              className="absolute rounded-full bg-white/40"
              style={{
                width: s.size,
                height: s.size,
                left: `${s.left}%`,
                top: `${s.top}%`,
              }}
              animate={{
                opacity: [0.15, 0.7, 0.15],
              }}
              transition={{
                duration: 3 + idx * 0.4,
                delay: s.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      )}

      {/* --- LAYER 4: MATTE VIGNETTE DEPTH CONTROL --- */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-cosmos/10 to-brand-cosmos/90 pointer-events-none" />
    </div>
  );
}