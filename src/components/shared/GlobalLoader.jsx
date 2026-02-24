import { motion, useReducedMotion } from "framer-motion";

const GlobalLoader = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-slate-950">
      <div className="relative flex flex-col items-center gap-6">
        
        {/* Glow Orb */}
        <motion.div
          className="h-20 w-20 rounded-full bg-cyan-400/30 blur-2xl"
          animate={
            shouldReduceMotion
              ? {}
              : {
                  scale: [1, 1.15, 1],
                  opacity: [0.6, 1, 0.6],
                }
          }
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Core Circle */}
        <motion.div
          className="absolute h-10 w-10 rounded-full bg-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.8)]"
          animate={
            shouldReduceMotion
              ? {}
              : {
                  scale: [1, 1.2, 1],
                }
          }
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Text */}
        <motion.p
          className="mt-8 text-sm md:text-base text-slate-400 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Loading experience…
        </motion.p>
      </div>
    </div>
  );
};

export default GlobalLoader;