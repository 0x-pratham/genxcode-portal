// src/components/shared/ScrollProgressBar.jsx
import { useScroll, useTransform } from "framer-motion";
import { motion } from "framer-motion";

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div
      className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 z-50 origin-left shadow-lg shadow-cyan-500/50"
      style={{ width, transformOrigin: "left" }}
    />
  );
}
