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
    <main className="relative min-h-screen text-slate-100 pb-24 overflow-hidden">
      <BackgroundOrbs />
      {/* All page content sits above global BG */}
      <div className="container-page relative z-10 max-w-5xl mx-auto pt-20 md:pt-24 space-y-8">
        {/* ===== HEADER ===== */}
        <motion.header
          className="space-y-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* pill */}
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-300 shadow-lg shadow-cyan-500/20 backdrop-blur"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium tracking-wide">
              GenXCode · Core team updates
            </span>
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Announcements
            </h1>
            <p className="text-sm md:text-base text-slate-400 max-w-2xl">
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
            className="relative overflow-hidden rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 px-6 py-10 text-sm text-slate-300 text-center shadow-lg shadow-slate-950/70"
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
                  className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 px-5 py-4 md:px-6 md:py-5 shadow-lg shadow-slate-950/70 transition-all"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  whileHover={shouldReduce ? {} : { translateY: -6, boxShadow: "0 30px 60px rgba(2,6,23,0.6)" }}
                >
                  {/* gradient top accent */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-cyan-400 via-sky-500 to-fuchsia-400 opacity-80" />

                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-base md:text-lg font-semibold">
                          {a.title || "Announcement"}
                        </h2>
                        {isLatest && (
                          <span className="rounded-full bg-emerald-500/12 border border-emerald-400/30 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-emerald-200">
                            Latest
                          </span>
                        )}
                      </div>

                      {created && (
                        <p className="text-[11px] text-slate-500">
                          {created.toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-[11px] text-slate-500 font-mono">#{reversedIndex.toString().padStart(2, "0")}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const url = `${window.location.origin}/announcements#${a.id}`;
                            navigator.clipboard?.writeText(url);
                            // small inline feedback could be improved with toasts
                          }}
                          className="text-[11px] text-slate-400 hover:text-slate-200 px-2 py-1 rounded border border-slate-800/60"
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
                          className="text-[11px] text-slate-400 hover:text-slate-200 px-2 py-1 rounded border border-slate-800/60"
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  </div>

                  {a.content && (
                    <div className="mt-3 text-sm md:text-[15px] text-slate-200 leading-relaxed">
                      <p className="whitespace-pre-line">{preview}</p>
                      {a.content.length > 300 && (
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                            className="text-xs text-cyan-300 hover:underline"
                          >
                            {expandedId === a.id ? "Show less" : "Read more"}
                          </button>
                        </div>
                      )}

                      <AnimatePresence>
                        {expandedId === a.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: shouldReduce ? 0 : 0.28 }}
                            className="overflow-hidden mt-3"
                          >
                            <p className="whitespace-pre-line text-slate-200">{a.content}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
