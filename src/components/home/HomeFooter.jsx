// src/components/home/HomeFooter.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function HomeFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className="mt-16 pt-8 border-t border-slate-800/60"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[11px] text-slate-400">© {currentYear} GenXCode. All rights reserved.</p>
          <p className="text-[10px] text-slate-500">
            Engineered by <span className="text-red-400">Cosmolix Pvt. Ltd.</span> for{" "}
            <span className="text-blue-400">GenXCode</span> students community.
          </p>
        </div>

        <div className="flex items-center gap-4 text-[10px]">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/privacy" className="text-slate-500 hover:text-cyan-300 transition">
              Privacy
            </Link>
          </motion.div>
          <span className="h-1 w-1 rounded-full bg-slate-600" />
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/terms" className="text-slate-500 hover:text-cyan-300 transition">
              Terms
            </Link>
          </motion.div>
          <span className="h-1 w-1 rounded-full bg-slate-600" />
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/contact" className="text-slate-500 hover:text-cyan-300 transition">
              Contact
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
}
