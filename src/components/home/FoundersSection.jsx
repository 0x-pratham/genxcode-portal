// src/components/home/FoundersSection.jsx
import { motion } from "framer-motion";

export default function FoundersSection({ founder, coFounder, mentor }) {
  return (
    <motion.section
      className="space-y-6"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">
            Founders&apos; vision for <span className="text-cyan-300">GenXCode</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mt-1">
            The leadership mindset that guides how the community runs every single week.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.article
          className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 px-5 py-5 shadow-lg shadow-slate-950/50"
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ duration: 0.25 }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-cyan-400 via-emerald-400 to-sky-500 opacity-80" />
          <p className="text-[11px] text-cyan-300 mb-1 uppercase tracking-[0.2em]">Founder&apos;s Vision</p>
          <h3 className="text-sm md:text-base font-semibold mb-1">{founder.name}</h3>
          <p className="text-[11px] text-slate-400 mb-3">{founder.role}</p>
          <p className="text-sm md:text-base text-slate-200 mb-3">&quot;{founder.quote}&quot;</p>
          <ul className="space-y-1.5 text-[11px] md:text-xs text-slate-300">
            {founder.focusPoints.map((point) => (
              <li key={point} className="flex gap-2">
                <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-cyan-400/80" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </motion.article>

        <motion.article
          className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 px-5 py-5 shadow-lg shadow-slate-950/50"
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ duration: 0.25 }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-fuchsia-400 via-cyan-400 to-indigo-500 opacity-80" />
          <p className="text-[11px] text-fuchsia-300 mb-1 uppercase tracking-[0.2em]">Co‑Founder&apos;s Vision</p>
          <h3 className="text-sm md:text-base font-semibold mb-1">{coFounder.name}</h3>
          <p className="text-[11px] text-slate-400 mb-3">{coFounder.role}</p>
          <p className="text-sm md:text-base text-slate-200">&quot;{coFounder.quote}&quot;</p>
          <ul className="space-y-1.5 text-[11px] md:text-xs text-slate-300 mt-3">
            {coFounder.focusPoints.map((point) => (
              <li key={point} className="flex gap-2">
                <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-fuchsia-400/80" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </motion.article>

        <motion.article
          className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 px-5 py-5 shadow-lg shadow-slate-950/50"
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ duration: 0.25 }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500 opacity-80" />
          <p className="text-[11px] text-emerald-300 mb-1 uppercase tracking-[0.2em]">Mentor</p>
          <h3 className="text-sm md:text-base font-semibold mb-1">{mentor.name}</h3>
          <p className="text-[11px] text-slate-400 mb-3">{mentor.role}</p>
          <p className="text-sm md:text-base text-slate-200">&quot;{mentor.quote}&quot;</p>
          <ul className="space-y-1.5 text-[11px] md:text-xs text-slate-300 mt-3">
            {mentor.focusPoints.map((point) => (
              <li key={point} className="flex gap-2">
                <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </motion.article>
      </div>
    </motion.section>
  );
}
