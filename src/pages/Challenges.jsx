// src/pages/Challenges.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { motion, useReducedMotion } from "framer-motion";
import BackgroundOrbs from "../components/BackgroundOrbs";

// keep static analyzer happy
void motion;

function isValidUrl(value) {
  try {
    if (!value) return false;
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch (_) {
    return false;
  }
}

const difficultyColors = {
  easy: "text-emerald-300 bg-emerald-900/40 border border-emerald-500/40",
  medium: "text-amber-300 bg-amber-900/40 border border-amber-500/40",
  hard: "text-red-300 bg-red-900/40 border border-red-500/40",
};

export default function Challenges() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [submittingId, setSubmittingId] = useState(null);
  const [submitErrors, setSubmitErrors] = useState({});
  const [links, setLinks] = useState({}); // challengeId -> github link
  const shouldReduce = useReducedMotion();

  const navigate = useNavigate();

  useEffect(() => {
    const loadUserAndChallenges = async () => {
      if (!supabase) {
        console.error("Supabase is not configured");
        setLoadingUser(false);
        setLoading(false);
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      setUser(userData?.user ?? null);
      setLoadingUser(false);

      setLoading(true);
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading challenges", error);
        setChallenges([]);
      } else {
        setChallenges(data || []);
      }
      setLoading(false);
    };

    loadUserAndChallenges();
  }, []);

  const filteredChallenges = challenges.filter((c) => {
    const difficulty = (c.difficulty || "").toLowerCase();
    if (difficultyFilter !== "all" && difficulty !== difficultyFilter) {
      return false;
    }
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (c.title || "").toLowerCase().includes(q) ||
      (c.description || "").toLowerCase().includes(q)
    );
  });

  const handleChangeLink = (id, value) => {
    setLinks((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitChallenge = async (challenge) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const github_link = (links[challenge.id] || "").trim();
    if (!github_link) {
      setSubmitErrors((prev) => ({
        ...prev,
        [challenge.id]: "GitHub repository URL is required.",
      }));
      return;
    }

    setSubmitErrors((prev) => ({ ...prev, [challenge.id]: "" }));
    setSubmittingId(challenge.id);

    try {
      if (!supabase) {
        setSubmitErrors((prev) => ({
          ...prev,
          [challenge.id]: "Supabase is not configured.",
        }));
        setSubmittingId(null);
        return;
      }

      const { error } = await supabase.from("submissions").insert([
        {
          user_id: user.id,
          challenge_id: challenge.id,
          github_link,
          status: "pending",
          points_awarded: 0,
        },
      ]);

      if (error) {
        console.error("Error inserting submission", error);
        setSubmitErrors((prev) => ({
          ...prev,
          [challenge.id]: "Failed to submit. Please try again.",
        }));
        setSubmittingId(null);
        return;
      }

      setLinks((prev) => ({ ...prev, [challenge.id]: "" }));
      setSubmitErrors((prev) => ({
        ...prev,
        [challenge.id]: "Submitted! Pending review.",
      }));
    } catch (err) {
      console.error(err);
      setSubmitErrors((prev) => ({
        ...prev,
        [challenge.id]: "Something went wrong. Please try again.",
      }));
    }

    setSubmittingId(null);
  };

  return (
    <main className="relative min-h-screen text-slate-100 pb-24 overflow-hidden">
      {/* global animated background – same as Home/Login/Apply */}
      <BackgroundOrbs />

      <div className="container-page relative z-10 pt-20 md:pt-24 space-y-8">
        {/* HEADER */}
        <motion.header
          className="space-y-3"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/80 px-3 py-1.5 text-[11px] text-slate-300 shadow-lg shadow-cyan-500/25 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>GenXCode · Live Coding Challenges</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight">
                Pick a challenge,{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                  ship your solution
                </span>
                .
              </h1>
              <p className="text-sm md:text-base text-slate-400 max-w-2xl">
                Build your solution on GitHub, submit the repo link and earn
                points as the core team reviews and approves your work.
              </p>
            </div>

            <p className="text-[11px] text-slate-500">
              Track your progress in the{" "}
              <Link
                to="/dashboard"
                className="text-cyan-300 hover:text-cyan-200 underline-offset-2 hover:underline"
              >
                member dashboard ↗
              </Link>
            </p>
          </div>
        </motion.header>

        {/* FILTERS */}
        <motion.section
          className="flex flex-wrap gap-3 items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 shadow-lg shadow-slate-950/60"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <div className="flex flex-wrap gap-2 text-[11px] md:text-xs">
            <span className="text-slate-400 mr-1">Difficulty:</span>
            <button
              onClick={() => setDifficultyFilter("all")}
              className={`px-3 py-1.5 rounded-full border transition-all ${
                difficultyFilter === "all"
                  ? "bg-slate-900 border-cyan-500/70 text-cyan-200 shadow-md shadow-cyan-500/30"
                  : "bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setDifficultyFilter("easy")}
              className={`px-3 py-1.5 rounded-full border transition-all ${
                difficultyFilter === "easy"
                  ? "bg-emerald-900/60 border-emerald-500/80 text-emerald-100 shadow-md shadow-emerald-500/25"
                  : "bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500"
              }`}
            >
              Easy
            </button>
            <button
              onClick={() => setDifficultyFilter("medium")}
              className={`px-3 py-1.5 rounded-full border transition-all ${
                difficultyFilter === "medium"
                  ? "bg-amber-900/60 border-amber-500/80 text-amber-100 shadow-md shadow-amber-500/25"
                  : "bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500"
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setDifficultyFilter("hard")}
              className={`px-3 py-1.5 rounded-full border transition-all ${
                difficultyFilter === "hard"
                  ? "bg-red-900/60 border-red-500/80 text-red-100 shadow-md shadow-red-500/25"
                  : "bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500"
              }`}
            >
              Hard
            </button>
          </div>

          <div className="flex-1 min-w-[200px] max-w-md">
            <input
              type="text"
              placeholder="Search by title or description…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base text-xs w-full bg-slate-950/80 border-slate-700/80"
            />
          </div>
        </motion.section>

        {/* LIST / STATES */}
        {loading ? (
          <div className="grid gap-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/85 px-5 py-4 shadow-lg"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="h-5 w-1/3 bg-slate-800 rounded mb-3 animate-pulse" />
                <div className="h-3 w-full bg-slate-800 rounded mb-2 animate-pulse" />
                <div className="h-3 w-3/4 bg-slate-800 rounded animate-pulse" />
              </motion.div>
            ))}
          </div>
        ) : filteredChallenges.length === 0 ? (
          <motion.div
            className="card px-5 py-8 text-sm text-slate-300 text-center border border-dashed border-slate-700 bg-slate-950/70"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            No challenges found with the current filters.
          </motion.div>
        ) : (
          <section className="space-y-4">
            {filteredChallenges.map((c, index) => {
              const difficulty = (c.difficulty || "easy").toLowerCase();
              const diffClass =
                difficultyColors[difficulty] || difficultyColors.easy;

              const tagsArray =
                Array.isArray(c.tags)
                  ? c.tags
                  : typeof c.tags === "string" && c.tags.trim().length
                  ? c.tags.split(",").map((t) => t.trim())
                  : [];

              const points = c.points ?? 0;

              return (
                <motion.article
                  key={c.id}
                  className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/85 px-5 py-4 shadow-lg shadow-slate-950/70 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  whileHover={shouldReduce ? {} : { y: -3, scale: 1.01 }}
                >
                  {/* accent bar */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-cyan-400 via-sky-500 to-fuchsia-400 opacity-70" />

                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-start gap-3">
                        <h2 className="text-base md:text-lg font-semibold flex-1">
                          {c.title}
                        </h2>
                        <div className="flex-shrink-0 text-right">
                          <div className="inline-flex items-center gap-2">
                            <span className="text-[11px] text-slate-400">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
                            <div className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${diffClass}`}>
                              {difficulty}
                            </div>
                          </div>
                          <div className="mt-2 text-sm font-bold text-cyan-300">{points} pts</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[11px] text-slate-400 mt-2">
                        {tagsArray.map((tag, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-br from-slate-900/70 to-slate-950/70 border border-slate-800 text-slate-300 text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {c.github_template && (
                      <a
                        href={c.github_template}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-cyan-300 underline break-all md:text-right hover:text-cyan-200"
                      >
                        Open starter repo/template →
                      </a>
                    )}
                  </div>

                  {c.description && (
                    <p className="text-sm text-slate-200 whitespace-pre-line mt-3 leading-relaxed">
                      {c.description}
                    </p>
                  )}

                  {c.resources && (
                    <p className="text-[11px] text-slate-400 whitespace-pre-line mt-2">
                      <span className="font-semibold text-slate-300">
                        Resources:{" "}
                      </span>
                      {c.resources}
                    </p>
                  )}

                  {/* submission area */}
                  <div className="border-t border-slate-800 mt-3 pt-3 space-y-2">
                    {loadingUser ? (
                      <p className="text-[11px] text-slate-400">
                        Checking login status…
                      </p>
                    ) : !user ? (
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        <span>Login to submit your solution.</span>
                        <Link
                          to="/login"
                          className="text-cyan-300 underline hover:text-cyan-200"
                        >
                          Go to login →
                        </Link>
                      </div>
                    ) : (
                      <>
                        <p className="text-[11px] text-slate-400">
                          Submit your GitHub repository URL for this challenge.
                        </p>
                        <div className="flex flex-col md:flex-row gap-2 items-center">
                          <input
                            type="url"
                            placeholder="https://github.com/your-username/your-repo"
                            value={links[c.id] || ""}
                            onChange={(e) => handleChangeLink(c.id, e.target.value)}
                            className="input-base text-xs flex-1 bg-slate-950/80 border-slate-700/80"
                          />

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const v = links[c.id] || "";
                                if (isValidUrl(v)) window.open(v, "_blank");
                              }}
                              disabled={!isValidUrl(links[c.id])}
                              className="text-xs px-3 py-2 rounded bg-slate-800/50 disabled:opacity-50"
                              title="Open repo (if valid)"
                            >
                              Open
                            </button>

                            <button
                              onClick={() => {
                                navigator.clipboard?.readText().then((text) => {
                                  if (text && isValidUrl(text)) {
                                    handleChangeLink(c.id, text);
                                  }
                                });
                              }}
                              className="text-xs px-3 py-2 rounded bg-slate-800/50"
                              title="Paste URL from clipboard"
                            >
                              Paste
                            </button>

                            <button
                              onClick={() => handleSubmitChallenge(c)}
                              disabled={submittingId === c.id || !isValidUrl(links[c.id])}
                              className="btn-primary text-xs px-4 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {submittingId === c.id ? "Submitting…" : "Submit"}
                            </button>
                          </div>
                        </div>
                        {submitErrors[c.id] && (
                          <p className="text-[11px] text-amber-300 mt-1">
                            {submitErrors[c.id]}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
