// src/pages/Login.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { motion, useReducedMotion } from "framer-motion";
import BackgroundOrbs from "../components/shared/BackgroundOrbs";

// ensure `motion` import is treated as used by static analyzers (JSX uses it)
void motion;

export default function Login() {
  const navigate = useNavigate();

  const shouldReduceMotion = useReducedMotion();
  const [checkingSession, setCheckingSession] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    const checkSession = async () => {
      if (!supabase) {
        setCheckingSession(false);
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        navigate("/dashboard", { replace: true });
      } else {
        setCheckingSession(false);
      }
    };
    checkSession();
  }, [navigate]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => {
      const next = { ...prev };
      // remove the field key entirely when user updates it
      delete next[field];
      return next;
    });
  };

  const hasFormErrors = Object.values(formErrors).some(Boolean);
  const isFormValid = !submitting && !hasFormErrors && form.email?.trim() && form.password?.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const errs = {};
    if (!form.email || !form.email.trim()) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email.";
    if (!form.password || !form.password.trim()) errs.password = "Password is required.";

    setFormErrors(errs);
    if (Object.keys(errs).length > 0) {
      const first = Object.keys(errs)[0];
      if (first === "email" && emailRef.current) emailRef.current.focus();
      else if (first === "password" && passwordRef.current) passwordRef.current.focus();
      return;
    }

    setSubmitting(true);

    try {
      if (!supabase) {
        setErrorMsg("Supabase is not configured. Please check your environment variables.");
        setSubmitting(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      });

      if (error) {
        console.error("Login error", error);
        setErrorMsg(error.message || "Failed to login.");
        setSubmitting(false);
        return;
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  if (checkingSession) {
    // keep background visible while checking
    return (
      <main className="relative min-h-screen text-slate-100 flex items-center justify-center overflow-hidden">
        <BackgroundOrbs />
        <p className="relative z-10 text-sm text-slate-400">
          Checking your session…
        </p>
      </main>
    );
  }

  return (
    // ❗ no bg-slate-950 – BackgroundOrbs provides the background
    <main className="relative min-h-screen text-slate-100 pb-24 flex items-center overflow-hidden">
      <BackgroundOrbs />

      <div className="container-page max-w-5xl mx-auto w-full pt-20 md:pt-24 relative z-10">
        <div className="grid gap-10 md:gap-12 md:grid-cols-[1.1fr,1fr] items-center">
          {/* LEFT: heading / copy */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* badge */}
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-300 shadow-lg shadow-cyan-500/20 backdrop-blur"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium tracking-wide">
                GenXCode · Member Login
              </span>
            </motion.div>

            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight">
                Welcome back,
                <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                  let&apos;s keep building.
                </span>
              </h1>
              <p className="text-sm md:text-base text-slate-400 max-w-md">
                Log in to your GenXCode member area to track challenges, points,
                attendance and your growth across the community.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                Secure sign‑in · Powered by Supabase Auth
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-600" />
              <span>
                New here?{" "}
                <Link
                  to="/signup"
                  className="text-cyan-300 hover:text-cyan-200 underline-offset-2 hover:underline"
                >
                  Create an account
                </Link>
              </span>
            </div>
          </motion.div>

          {/* RIGHT: login card */}
          <motion.div
            className="relative"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            {/* animated glow border like Apply / Home */}
            <motion.div
              className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-cyan-500/40 via-slate-900 to-fuchsia-500/40 opacity-70 blur-lg"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="relative rounded-3xl bg-slate-950/90 border border-slate-700/80 px-6 py-6 md:px-7 md:py-7 shadow-2xl shadow-slate-950/80 backdrop-blur space-y-5"
              animate={shouldReduceMotion ? {} : { y: [0, -6, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            >
              <header className="space-y-1 text-center">
                <h2 className="text-xl md:text-2xl font-semibold">
                  Login to GenXCode
                </h2>
                <p className="text-xs md:text-sm text-slate-400">
                  Use your registered email and password to continue.
                </p>
              </header>

              {errorMsg && (
                <motion.div
                  className="text-xs text-red-300 bg-red-900/30 border border-red-500/40 rounded-lg px-3 py-2"
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errorMsg}
                </motion.div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                autoComplete="on"
              >
                <div className="space-y-1 relative">
                  <label className="text-xs text-slate-400">Email</label>
                  <span className="absolute left-3 top-8 text-slate-500">📧</span>
                  <input
                    ref={emailRef}
                    type="email"
                    className={`input-base pl-10 ${formErrors.email ? "ring-2 ring-red-500/40" : ""}`}
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    aria-invalid={!!formErrors.email}
                    required
                  />
                  {formErrors.email && <p className="text-[11px] text-red-300">{formErrors.email}</p>}
                </div>

                <div className="space-y-1 relative">
                  <label className="text-xs text-slate-400">Password</label>
                  <span className="absolute left-3 top-8 text-slate-500">🔒</span>
                  <input
                    ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                    className={`input-base pl-10 ${formErrors.password ? "ring-2 ring-red-500/40" : ""}`}
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    aria-invalid={!!formErrors.password}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-7 text-xs text-slate-400 hover:text-slate-200"
                    aria-pressed={showPassword}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                  {formErrors.password && <p className="text-[11px] text-red-300">{formErrors.password}</p>}
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                  <span>
                    Don&apos;t have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-cyan-300 hover:text-cyan-200 underline-offset-2 hover:underline"
                    >
                      Sign up
                    </Link>
                  </span>
                  <span className="text-slate-500 text-[10px]">
                    {/* Future: Forgot password? */}
                  </span>
                </div>

                <div className="flex justify-end pt-2">
                  <motion.button
                    type="submit"
                    disabled={!isFormValid}
                    className="btn-primary text-xs px-6 py-2.5 rounded-full disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group"
                    whileHover={shouldReduceMotion ? {} : { scale: submitting ? 1 : 1.04, y: submitting ? 0 : -2 }}
                    whileTap={shouldReduceMotion ? {} : { scale: submitting ? 1 : 0.98 }}
                  >
                    <span className="relative z-[1] flex items-center gap-2">
                      {submitting ? (
                        <>
                          <span className="h-3 w-3 rounded-full border-2 border-cyan-300 border-t-transparent animate-spin" />
                          Logging in…
                        </>
                      ) : (
                        <>
                          <span>Login</span>
                          <span>↗</span>
                        </>
                      )}
                    </span>
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-sky-500/30 to-indigo-500/30 opacity-0 group-hover:opacity-100 transition" />
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
