// src/components/home/HomeAnimatedBackground.jsx
import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";

export default function HomeAnimatedBackground() {
  const shouldReduce = useReducedMotion();
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const check = () => setIsLargeScreen(window.innerWidth > 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const particles = useMemo(() => {
    const patterns = [
      { width: 3, height: 3, left: 15, top: 20, xOffset: 8, duration: 4, delay: 0 },
      { width: 2.5, height: 2.5, left: 75, top: 30, xOffset: -6, duration: 3.5, delay: 0.5 },
      { width: 4, height: 4, left: 45, top: 60, xOffset: 5, duration: 4.5, delay: 1 },
      { width: 2, height: 2, left: 85, top: 70, xOffset: -8, duration: 3, delay: 1.5 },
      { width: 3.5, height: 3.5, left: 25, top: 80, xOffset: 7, duration: 4.2, delay: 0.8 },
      { width: 2.8, height: 2.8, left: 60, top: 10, xOffset: -5, duration: 3.8, delay: 1.2 },
    ];
    return patterns.map((p, i) => ({
      id: i,
      ...p,
      color: i % 2 === 0 ? "rgba(34, 211, 238, 0.4)" : "rgba(168, 85, 247, 0.4)",
    }));
  }, []);

  const stars = useMemo(() => [
    { left: 8, top: 10, size: 2, delay: 0 },
    { left: 25, top: 22, size: 1.8, delay: 0.6 },
    { left: 55, top: 8, size: 1.5, delay: 1.2 },
    { left: 72, top: 40, size: 2.2, delay: 0.4 },
    { left: 40, top: 75, size: 1.6, delay: 1.0 },
    { left: 85, top: 20, size: 1.9, delay: 0.2 },
    { left: 12, top: 68, size: 1.3, delay: 1.5 },
    { left: 62, top: 55, size: 1.7, delay: 0.8 },
  ], []);

  const noAnim = !shouldReduce;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden will-change-transform"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{ willChange: "transform" }}
    >
      <motion.div
        className="absolute -top-40 -left-20 h-80 w-80 rounded-full bg-cyan-500/25 blur-3xl will-change-transform"
        animate={noAnim ? { x: [0, 30, -10, 0], y: [0, -10, 20, 0], scale: [1, 1.06, 0.97, 1] } : {}}
        transition={noAnim ? { duration: 22, repeat: Infinity, ease: "easeInOut" } : {}}
        style={{ willChange: "transform, opacity" }}
      />
      <motion.div
        className="absolute top-64 -right-10 h-72 w-72 rounded-full bg-purple-500/25 blur-3xl will-change-transform"
        animate={noAnim ? { x: [0, -25, 10, 0], y: [0, 20, -15, 0], scale: [1, 0.97, 1.03, 1] } : {}}
        transition={noAnim ? { duration: 26, repeat: Infinity, ease: "easeInOut" } : {}}
        style={{ willChange: "transform, opacity" }}
      />
      <motion.div
        className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl will-change-transform"
        animate={noAnim ? { x: [0, 15, -20, 0], y: [0, 10, -10, 0], scale: [1, 1.03, 0.97, 1] } : {}}
        transition={noAnim ? { duration: 30, repeat: Infinity, ease: "easeInOut" } : {}}
        style={{ willChange: "transform, opacity" }}
      />
      {noAnim && isLargeScreen &&
        particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: `${p.width}px`,
              height: `${p.height}px`,
              left: `${p.left}%`,
              top: `${p.top}%`,
              background: p.color,
            }}
            animate={{ y: [0, -28, 0], x: [0, p.xOffset * 0.8, 0], opacity: [0.28, 0.7, 0.28] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}
      {stars.map((s, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute rounded-full bg-white"
          style={{ width: s.size, height: s.size, left: `${s.left}%`, top: `${s.top}%`, opacity: 0.85 }}
          animate={noAnim && isLargeScreen ? { opacity: [0.18, 0.95, 0.18], scale: [0.9, 1.12, 0.9] } : { opacity: 0.75 }}
          transition={noAnim && isLargeScreen ? { duration: 2.5 + i * 0.2, repeat: Infinity, delay: s.delay } : {}}
        />
      ))}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.72),_transparent_60%)]"
        animate={
          noAnim
            ? {
                background: [
                  "radial-gradient(circle at top, rgba(15,23,42,0.72), transparent 60%)",
                  "radial-gradient(circle at 30% 20%, rgba(15,23,42,0.72), transparent 60%)",
                  "radial-gradient(circle at bottom, rgba(15,23,42,0.72), transparent 60%)",
                  "radial-gradient(circle at top, rgba(15,23,42,0.72), transparent 60%)",
                ],
              }
            : {}
        }
        transition={noAnim ? { duration: 20, repeat: Infinity, ease: "linear" } : {}}
      />
      {noAnim && isLargeScreen && (
        <motion.div
          className="absolute -left-1/2 top-0 h-full w-1/3 pointer-events-none"
          initial={{ x: "-120%", rotate: -12 }}
          animate={{ x: ["-120%", "120%"] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          style={{
            background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0) 100%)",
            mixBlendMode: "overlay",
          }}
        />
      )}
      <motion.svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-6"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 600 400"
      >
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="0.06" fill="#000" />
      </motion.svg>
    </motion.div>
  );
}
