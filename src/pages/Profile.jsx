// src/pages/Profile.jsx
import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { motion, useReducedMotion } from "framer-motion";
// keep `motion` referenced for static analyzers (used in JSX)
void motion;

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [profile, setProfile] = useState({
    full_name: "",
    branch: "",
    year: "",
    github: "",
  });

  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const shouldReduce = useReducedMotion();
  const [initialProfile, setInitialProfile] = useState(null);
  const fileInputRef = useRef(null);
  // --------------------------------------------------
  // LOAD PROFILE (OWN USER ONLY)
  // moved above useEffect to avoid calling before declaration
  // --------------------------------------------------
  const loadProfile = async (currentUser) => {
    setProfileLoading(true);
    setErrorMsg("");

    if (!isSupabaseConfigured()) {
      setErrorMsg("Supabase is not configured. Please check your environment variables.");
      setProfileLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .single();

    const resolved = error
      ? {
          full_name: currentUser.user_metadata?.full_name || "",
          branch: "",
          year: "",
          github: "",
        }
      : {
          full_name: data.full_name || "",
          branch: data.branch || "",
          year: data.year || "",
          github: data.github || "",
        };

    setProfile(resolved);
    setInitialProfile(resolved); // for change-detection
    setProfileLoading(false);
  };

  // --------------------------------------------------
  // LOAD AUTH USER
  // --------------------------------------------------
  useEffect(() => {
    const loadUser = async () => {
      if (!isSupabaseConfigured()) {
        setErrorMsg("Supabase is not configured. Please check your environment variables.");
        setLoadingUser(false);
        setProfileLoading(false);
        return;
      }

      const { data } = await supabase.auth.getUser();

      if (!data?.user) {
        navigate("/login");
        return;
      }

      setUser(data.user);
      setLoadingUser(false);
      await loadProfile(data.user);
    };

    loadUser();
  }, [navigate]);

  // memoized initials (hooks must run unconditionally)
  const initials = useMemo(() => {
    const parts = (profile.full_name || "").trim().split(" ").filter(Boolean);
    const initialsRaw = parts.length === 0 ? "GM" : parts.length === 1 ? parts[0][0] : parts[0][0] + (parts[1] ? parts[1][0] : "");
    return initialsRaw.toUpperCase();
  }, [profile.full_name]);

  // --------------------------------------------------
  // SAVE PROFILE (RLS SAFE)
  // --------------------------------------------------
  const handleSave = async () => {
    if (!user) return;
    // basic validation
    if (!profile.full_name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const payload = {
      id: user.id, // 🔐 MUST MATCH auth.uid()
      full_name: profile.full_name.trim(),
      branch: profile.branch.trim(),
      year: profile.year.trim(),
      github: profile.github.trim(),
    };

    const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });

    setSaving(false);

    if (error) {
      console.error(error);
      setErrorMsg("Failed to update profile. Please try again.");
      return;
    }

    setInitialProfile(payload);
    setSuccessMsg("Profile updated successfully.");
  };

  // --------------------------------------------------
  // UI STATES
  // --------------------------------------------------
  if (loadingUser) {
    return (
      <main className="min-h-screen flex items-center justify-center text-slate-400">
        Loading profile…
      </main>
    );
  }

  if (!user) return null;

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <main className="relative min-h-screen text-slate-100 pb-20 overflow-hidden">
      <div className="container-page max-w-3xl mx-auto pt-20 space-y-8 relative z-10">

        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Your{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
              Profile
            </span>
          </h1>
          <p className="text-sm text-slate-400">
            These details appear on your dashboard and leaderboard.
          </p>
        </motion.header>

        {/* STATUS MESSAGES */}
        {errorMsg && (
          <div className="text-xs text-red-300 bg-red-900/30 border border-red-500/40 rounded-lg px-3 py-2">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="text-xs text-emerald-300 bg-emerald-900/30 border border-emerald-500/40 rounded-lg px-3 py-2">
            {successMsg}
          </div>
        )}

        {/* PROFILE CARD */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <motion.div
            className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-cyan-500/40 via-slate-900 to-fuchsia-500/40 opacity-70 blur-lg"
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          <div className="relative rounded-3xl bg-slate-950/90 border border-slate-800 px-6 py-6 shadow-2xl backdrop-blur space-y-5">

            {profileLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2 flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-slate-800 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 bg-slate-800 rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-slate-800 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-10 bg-slate-800 rounded animate-pulse" />
                <div className="h-10 bg-slate-800 rounded animate-pulse" />
                <div className="md:col-span-2 h-10 bg-slate-800 rounded animate-pulse" />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">

                {/* Avatar & quick actions */}
                <div className="md:col-span-2 flex items-center gap-4">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center text-slate-900 font-bold text-xl">
                      {initials}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 bg-slate-800/80 border border-slate-700 rounded-full p-1 text-xs text-slate-200"
                    >
                      Edit
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
                  </div>

                  <div className="flex-1">
                    <label className="text-xs text-slate-400">Full name</label>
                    <input
                      className="input-base mt-1"
                      value={profile.full_name}
                      onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
                    />
                    <p className="text-[11px] text-slate-500 mt-1">This name appears on your leaderboard and profile badge.</p>
                  </div>
                </div>

                {/* Branch */}
                <div>
                  <label className="text-xs text-slate-400">Branch</label>
                  <input
                    className="input-base mt-1"
                    value={profile.branch}
                    onChange={(e) => setProfile((p) => ({ ...p, branch: e.target.value }))}
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="text-xs text-slate-400">Year</label>
                  <input
                    className="input-base mt-1"
                    value={profile.year}
                    onChange={(e) => setProfile((p) => ({ ...p, year: e.target.value }))}
                  />
                </div>

                {/* GitHub */}
                <div className="md:col-span-2">
                  <label className="text-xs text-slate-400">GitHub</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      className="input-base flex-1"
                      placeholder="github username or URL"
                      value={profile.github}
                      onChange={(e) => setProfile((p) => ({ ...p, github: e.target.value }))}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const url = profile.github?.trim() || "";
                        const username = url.replace(/https?:\/\/(www\.)?github.com\//, "").replace(/^@/, "").split("/")[0];
                        const final = username ? `https://github.com/${username}` : "";
                        if (final) window.open(final, "_blank");
                      }}
                      className="text-xs px-3 py-2 rounded bg-slate-800/50"
                    >
                      Open
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Add your github username to show on the leaderboard.</p>
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex justify-between items-center pt-4">
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="text-xs text-slate-400 hover:text-cyan-300">
                  ← Back to dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    const profileUrl = `${window.location.origin}/u/${user.id}`;
                    navigator.clipboard?.writeText(profileUrl);
                    setSuccessMsg("Profile link copied to clipboard.");
                    setTimeout(() => setSuccessMsg(""), 2000);
                  }}
                  className="text-xs text-slate-400 hover:text-slate-200 bg-slate-800/40 px-2 py-1 rounded"
                >
                  Copy profile link
                </button>
              </div>

              <div className="flex items-center gap-3">
                {errorMsg && <div className="text-xs text-red-300">{errorMsg}</div>}
                {successMsg && <div className="text-xs text-emerald-300">{successMsg}</div>}

                <motion.button
                  onClick={handleSave}
                  disabled={saving || JSON.stringify(profile) === JSON.stringify(initialProfile)}
                  className="btn-primary text-xs px-6 py-2 disabled:opacity-60"
                  whileHover={!shouldReduce ? { scale: 1.03 } : {}}
                >
                  {saving ? "Saving…" : "Save changes"}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
