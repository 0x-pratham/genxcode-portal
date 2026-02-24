import { motion, AnimatePresence } from "framer-motion";

const RouteProgress = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed top-0 left-0 h-[3px] z-[9999] bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
          initial={{ width: "0%", opacity: 1 }}
          animate={{
            width: ["0%", "70%", "90%"],
            opacity: 1,
          }}
          exit={{
            width: "100%",
            opacity: 0,
            transition: { duration: 0.25 },
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default RouteProgress;