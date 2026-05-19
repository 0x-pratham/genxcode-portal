// src/components/home/HomeFooter.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function HomeFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className="mt-16 pt-8 border-t border-white/[0.04] max-w-4xl mx-auto pb-8 text-left"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 font-sans">
        
        {/* --- LEFT SIDE: LEGAL RECOGNITION & BRAND MATRIX --- */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-accent/50" />
            <p className="text-[11px] font-bold tracking-wide text-neutral-premiumText">
              © {currentYear} GenXCode. All rights reserved.
            </p>
          </div>
          
          <p className="text-[11px] text-neutral-secondaryText/60 leading-relaxed max-w-md font-medium">
            Engineered with precise architectural principles by{" "}
            <a 
              href="https://cosmolix.co.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-brand-accent transition-colors hover:text-brand-accent/80 underline underline-offset-2 decoration-brand-accent/20 hover:decoration-brand-accent/50"
            >
              Cosmolix Pvt. Ltd.
            </a>{" "}
            exclusively for the GenXCode student developer ecosystem.
          </p>
        </div>

        {/* --- RIGHT SIDE: PREMIUM UTILITY ACTION DIRECTORY --- */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-medium text-neutral-secondaryText/50">
          
          {/* Privacy Link Element */}
          <Link to="/privacy" className="group relative py-1 text-neutral-secondaryText transition-colors hover:text-brand-accent">
            <span>Privacy Policy</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-accent transition-all duration-300 group-hover:w-full" />
          </Link>
          
          <span className="h-1 w-1 rounded-full bg-white/10 hidden sm:block" />
          
          {/* Terms Link Element */}
          <Link to="/terms" className="group relative py-1 text-neutral-secondaryText transition-colors hover:text-brand-accent">
            <span>Terms of Service</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-accent transition-all duration-300 group-hover:w-full" />
          </Link>
          
          <span className="h-1 w-1 rounded-full bg-white/10 hidden sm:block" />
          
          {/* Contact Link Element */}
          <Link to="/contact" className="group relative py-1 text-neutral-secondaryText transition-colors hover:text-brand-accent">
            <span>System Contact</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-accent transition-all duration-300 group-hover:w-full" />
          </Link>

        </div>
      </div>

      {/* --- DECORATIVE CONSOLE MARKER FOOTNOTE --- */}
      <div className="mt-6 pt-4 border-t border-white/[0.02] flex items-center justify-between text-[9px] font-mono text-neutral-secondaryText/20 font-bold uppercase tracking-widest">
        <span>Ecosystem Terminal // v2.6.0</span>
        <span>Status // Secure Operations</span>
      </div>
    </motion.footer>
  );
}