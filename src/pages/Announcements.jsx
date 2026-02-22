// src/pages/Announcements.jsx
import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import BackgroundOrbs from "../components/BackgroundOrbs";

// keep static analyzer happy when JSX doesn't reference AnimatePresence directly
void AnimatePresence;

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      
      if (!isSupabaseConfigured()) {
        console.error("Supabase is not configured");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading announcements", error);
        setAnnouncements([]);
      } else {
        setAnnouncements(data || []);
      }
      setLoading(false);
    };

    load();
  }, []);

  return (
    // ❗ no bg-slate-950 here so global BackgroundOrbs stays visible
    <main className="relative min-h-screen scroll-smooth text-slate-100 pb-24 overflow-hidden">
      <BackgroundOrbs />
      {/* All page content sits above global BG */}
     <motion.div
  className="container-page relative z-10 max-w-5xl mx-auto pt-20 md:pt-24 space-y-8"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
        {/* ===== HEADER ===== */}
        <motion.header
          className="relative space-y-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* subtle header glow */}
<div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
          {/* pill */}
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-300 shadow-lg shadow-cyan-500/20 backdrop-blur"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium tracking-wide">
              GenXCode · President team updates
            </span>
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Announcements
            </h1>
            <p className="text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed">
              Stay in sync with sessions, events, challenge drops and important
              updates from the GenXCode core team.
            </p>
          </div>

          {!loading && (
            <p className="text-[11px] text-slate-500">
              {announcements.length === 0
                ? "No announcements right now."
                : `Showing ${announcements.length} announcement${
                    announcements.length > 1 ? "s" : ""
                  } · Latest on top`}
            </p>
          )}
        </motion.header>
<div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-60" />
        {/* ===== CONTENT ===== */}
        {loading ? (
          // loading state
          <motion.div
            className="rounded-2xl border border-slate-800 bg-slate-950/70 px-5 py-6 text-sm text-slate-300 shadow-lg shadow-slate-950/70"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-3 h-3 w-24 rounded-full bg-slate-700/60 animate-pulse" />
            <div className="space-y-2">
              <div className="h-2.5 w-full rounded bg-slate-800/70 animate-pulse" />
              <div className="h-2.5 w-5/6 rounded bg-slate-800/70 animate-pulse" />
              <div className="h-2.5 w-4/6 rounded bg-slate-800/70 animate-pulse" />
            </div>
          </motion.div>
        ) : announcements.length === 0 ? (
          // empty state
          <motion.div
  className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/70 backdrop-blur-xl px-5 py-6 shadow-xl shadow-slate-950/80 transition-all"
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-emerald-400 opacity-60" />
            <p className="text-base md:text-lg font-medium mb-1">
              No announcements yet
            </p>
            <p className="text-xs md:text-sm text-slate-400 max-w-md mx-auto">
              New events, workshops, challenges and important notices will
              appear here as soon as the core team posts them. Check back soon.
            </p>
          </motion.div>
        ) : (
          // list
          <div className="space-y-4">
            {announcements.map((a, index) => {
              const reversedIndex = announcements.length - index;
              const isLatest = index === 0;
              const created = a.created_at ? new Date(a.created_at) : null;
              const preview = a.content && a.content.length > 300 ? a.content.slice(0, 300) + "…" : a.content;

              return (
                <motion.article
                  key={a.id}
                  className={`relative overflow-hidden rounded-2xl border ${
  isLatest
    ? "border-cyan-500/40 shadow-[0_0_40px_rgba(34,211,238,0.15)]"
    : "border-slate-800/70"
} bg-gradient-to-b from-slate-900/70 to-slate-950/70 backdrop-blur-2xl px-6 py-6 md:px-10 md:py-8 shadow-2xl shadow-slate-950/80 transition-all`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
                  whileHover={
    shouldReduce
      ? {}
      : {
          y: -4,
          scale: 1.006
        }
  }
>
                  {/* gradient top accent */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-cyan-400 via-sky-500 to-fuchsia-400 opacity-80" />

                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg md:text-xl font-semibold tracking-tight text-slate-100">
                          {a.title || "Announcement"}
                        </h2>
                        {isLatest && (
                          <span className="rounded-full bg-cyan-500/10 border border-cyan-400/30 px-3 py-0.5 text-[10px] uppercase tracking-[0.15em] text-cyan-300 backdrop-blur">
                            Latest
                          </span>
                        )}
                      </div>

                      {created && (
                        <p className="text-[11px] text-slate-500 tracking-wide">
                          {created.toLocaleDateString(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
})}
                        </p>
                      )}
                      <div className="mt-3 h-px w-full bg-slate-800/60" />
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Post {reversedIndex}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const url = `${window.location.origin}/announcements#${a.id}`;
                            navigator.clipboard?.writeText(url);
                            alert("Link copied");
                            // small inline feedback could be improved with toasts
                          }}
                          className="text-[11px] text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800/70 bg-slate-900/60 hover:bg-slate-800/70 transition-all"
                        >
                          Copy link
                        </button>
                        <button
                          onClick={() => {
                            const url = `${window.location.origin}/announcements#${a.id}`;
                            if (navigator.share) {
                              navigator.share({ title: a.title, text: a.content?.slice(0, 120), url }).catch(() => {});
                            } else {
                              window.open(url, "_blank");
                            }
                          }}
                          className="text-[11px] text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800/70 bg-slate-900/60 hover:bg-slate-800/70 transition-all"
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  </div>

                  {a.content && (
  <div className="mt-5 text-sm md:text-[15px] text-slate-200 leading-[1.8]">
    <AnimatePresence mode="wait">
      <motion.p
        key={expandedId === a.id ? "full" : "preview"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: shouldReduce ? 0 : 0.2 }}
        className="whitespace-pre-line"
      >
        {expandedId === a.id ? a.content : preview}
      </motion.p>
    </AnimatePresence>

    {a.content.length > 300 && (
      <div className="mt-4">
        <button
          onClick={() =>
            setExpandedId(expandedId === a.id ? null : a.id)
          }
          className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
        >
          {expandedId === a.id ? "Collapse ↑" : "Continue reading →"}
        </button>
      </div>
    )}
  </div>
)}
<motion.div
style={{ willChange: "transform, opacity" }}
  className="pointer-events-none absolute inset-0 opacity-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.08),transparent)]"
  animate={{}}
  whileHover={
    shouldReduce
      ? {}
      : {
          opacity: [0, 0.6, 0],
          x: ["-120%", "120%"]
        }
  }
  transition={{
    duration: 0.9,
    ease: "easeInOut"
  }}
/>
                </motion.article>
              );
            })}
          </div>
        )}
      </motion.div>
    </main>
  );
}
