// src/pages/Apply.jsx
import { useState, useRef, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import { submitApplication } from "../services/recruitmentService";
import { useToast } from "../context/ToastContext";

export default function Apply() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    branch: "",
    year: "",
    phone: "",
    github: "",
    why_join: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  

  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const branchRef = useRef(null);
  const yearRef = useRef(null);
  const phoneRef = useRef(null);
  const githubRef = useRef(null);
  const whyRef = useRef(null);

  const validate = (values) => {
    const errors = {};
    if (!values.full_name || !values.full_name.trim()) errors.full_name = "Please enter your full name.";
    if (!values.email || !values.email.trim()) errors.email = "Please enter your email.";
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = "Enter a valid email address.";
    if (!values.branch || !values.branch.trim()) errors.branch = "Please enter your branch.";
    if (!values.year || !values.year.trim()) errors.year = "Please enter your year.";
    if (!values.phone || !values.phone.trim()) errors.phone = "Please enter your phone number.";
    else if (!/^[+\d][\d\s-]{6,}$/.test(values.phone)) errors.phone = "Enter a valid phone number.";
    if (!values.github || !values.github.trim()) errors.github = "Please provide your GitHub profile.";
    else if (!/github\.com/.test(values.github) && !/^https?:\/\//.test(values.github)) errors.github = "Provide a GitHub URL or include github.com.";
    if (!values.why_join || !values.why_join.trim()) errors.why_join = "Tell us why you want to join.";
    return errors;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    
  };

  const isFormValid = useMemo(() => {
    const errs = validate(form);
    return Object.keys(errs).length === 0;
  }, [form]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const errors = validate(form);
  setFormErrors(errors);

  if (Object.keys(errors).length > 0) {
    const firstKey = Object.keys(errors)[0];

    if (firstKey === "full_name" && fullNameRef.current) fullNameRef.current.focus();
    else if (firstKey === "email" && emailRef.current) emailRef.current.focus();
    else if (firstKey === "branch" && branchRef.current) branchRef.current.focus();
    else if (firstKey === "year" && yearRef.current) yearRef.current.focus();
    else if (firstKey === "phone" && phoneRef.current) phoneRef.current.focus();
    else if (firstKey === "github" && githubRef.current) githubRef.current.focus();
    else if (firstKey === "why_join" && whyRef.current) whyRef.current.focus();

    return;
  }

  setSubmitting(true);

  try {
    const { data: { user } } = await supabase.auth.getUser();

    const applicationData = {
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      branch: form.branch.trim(),
      year: form.year.trim(),
      phone: form.phone.trim(),
      github: form.github.trim(),
      why_join: form.why_join.trim(),
      status: "pending",
      user_id: user?.id || null,
    };

    const response = await submitApplication(applicationData);

    if (!response.success) {
  showToast(response.error?.message || "Submission failed", "error");
  setSubmitting(false);
  return;
}

showToast("Application submitted successfully!", "success");

// optional form reset
setForm({
  full_name: "",
  email: "",
  branch: "",
  year: "",
  phone: "",
  github: "",
  why_join: "",
});

setSubmitting(false);

navigate("/apply/success");

  } catch (err) {
    console.error(err);
    showToast("Something went wrong. Please try again.", "error");
    setSubmitting(false);
  }
};

  return (
    // ✅ Same structure as Home: animated BG + content above it
    <main className="relative min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100 pb-28 overflow-hidden">
      {/* ⭐ Animated background orbs – SAME as Home.jsx */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* cyan blob */}
        <motion.div
          className="absolute -top-40 -left-20 h-80 w-80 rounded-full bg-cyan-500/25 blur-3xl"
          animate={{ x: [0, 30, -10, 0], y: [0, -10, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        />
        {/* purple blob */}
        <motion.div
          className="absolute top-64 -right-10 h-72 w-72 rounded-full bg-purple-500/25 blur-3xl"
          animate={{ x: [0, -25, 10, 0], y: [0, 20, -15, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        />
        {/* emerald blob */}
        <motion.div
          className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl"
          animate={{ x: [0, 15, -20, 0], y: [0, 10, -10, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        {/* subtle radial darkening so content pops */}
        <motion.div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.72),_transparent_60%)]" animate={{ opacity: [0.9, 1, 0.9] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} />

        {/* subtle SVG noise overlay for premium texture */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-6" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 600 400">
          <filter id="noiseF">
            <feTurbulence baseFrequency="0.9" numOctaves="1" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseF)" opacity="0.06" fill="#000" />
        </svg>
      </motion.div>

      {/* 🔝 All actual content above the BG */}
      <div className="container-page relative z-10 pt-20 md:pt-24 max-w-5xl mx-auto space-y-12">
        {/* TOP HEADER STRIP */}
        <motion.div
          className="flex flex-wrap items-center justify-between gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-300 shadow-xl shadow-cyan-600/18 backdrop-blur"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium tracking-wide">
              GenXCode · Core Member Application
            </span>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 text-[11px] text-slate-400"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <span className="hidden sm:inline-block">
              Avg review time:{" "}
              <span className="text-cyan-300">24–72 hours</span>
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-600" />
            <span className="text-slate-500">
              Already a member?{" "}
              <Link
                to="/dashboard"
                className="text-cyan-300 hover:text-cyan-200 hover:underline"
              >
                Go to dashboard ↗
              </Link>
            </span>
          </motion.div>
        </motion.div>

        {/* MAIN GRID: LEFT INFO · RIGHT FORM */}
        <motion.section
          className="grid gap-10 lg:grid-cols-[1.2fr,1.1fr] items-start"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* LEFT SIDE – COPY, POINTS, MINI ROADMAP */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight md:leading-[1.1]">
                Apply to{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                  join the GenXCode core squad
                </span>
                .
              </h1>
              <p className="text-sm md:text-base text-slate-400 max-w-xl">
                You&apos;re not just filling another club form. You&apos;re
                joining a focused community that ships real products, runs
                events and mentors juniors on your campus.
              </p>
            </div>

            {/* cards: what we look for / what you get */}
            <div className="grid gap-3 md:grid-cols-2">
              <motion.div
                className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 shadow-lg shadow-slate-950/50"
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.25 }}
              >
                <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300 mb-1">
                  What we look for
                </p>
                <ul className="text-[11px] md:text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Curiosity about tech & building things</li>
                  <li>Consistency over perfection</li>
                  <li>Willingness to learn and share</li>
                </ul>
              </motion.div>

              <motion.div
                className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 shadow-lg shadow-slate-950/50"
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.25, delay: 0.05 }}
              >
                <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300 mb-1">
                  What you get
                </p>
                <ul className="text-[11px] md:text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Priority access to projects & hackathons</li>
                  <li>Leadership & mentorship opportunities</li>
                  <li>Portfolio, certificates & recognition</li>
                </ul>
              </motion.div>
            </div>

            {/* Small horizontal “timeline” */}
            <motion.div
              className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 shadow-md shadow-slate-950/60 space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                Your journey inside GenXCode
              </p>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  Apply
                </span>
                <span className="text-slate-500">——</span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Intro & onboarding
                </span>
                <span className="text-slate-500">——</span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Projects, events, mentoring
                </span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE – FORM CARD */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* animated glow border */}
            <motion.div
              className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-cyan-500/40 via-slate-900 to-fuchsia-500/40 opacity-70 blur-lg"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

              <div className="relative rounded-3xl bg-slate-950/92 border border-slate-800/80 px-5 py-5 md:px-6 md:py-6 shadow-2xl shadow-slate-950/90 backdrop-blur space-y-4">
              {/* top row: step + badge */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>
                  Step 1 of 1 ·{" "}
                  <span className="text-cyan-300">Tell us about you</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Open for Future GenXCode Members
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] text-slate-400">
                      Full name <span className="text-red-400">*</span>
                    </label>
                    <input
                      ref={fullNameRef}
                      name="full_name"
                      type="text"
                      className={`input-base ${formErrors.full_name ? "ring-2 ring-red-500/40" : ""}`}
                      value={form.full_name}
                      onChange={(e) => handleChange("full_name", e.target.value)}
                      required
                    />
                    {formErrors.full_name && <p className="text-[11px] text-red-300">{formErrors.full_name}</p>}
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] text-slate-400">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      ref={emailRef}
                      name="email"
                      type="email"
                      className={`input-base ${formErrors.email ? "ring-2 ring-red-500/40" : ""}`}
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                    />
                    {formErrors.email && <p className="text-[11px] text-red-300">{formErrors.email}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Branch <span className="text-red-400">*</span></label>
                    <input
                      ref={branchRef}
                      name="branch"
                      type="text"
                      className={`input-base ${formErrors.branch ? "ring-2 ring-red-500/40" : ""}`}
                      value={form.branch}
                      onChange={(e) => handleChange("branch", e.target.value)}
                      placeholder="CSE / IT / AI‑DS…"
                      required
                    />
                    {formErrors.branch && <p className="text-[11px] text-red-300">{formErrors.branch}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Year <span className="text-red-400">*</span></label>
                    <input
                      ref={yearRef}
                      name="year"
                      type="text"
                      className={`input-base ${formErrors.year ? "ring-2 ring-red-500/40" : ""}`}
                      value={form.year}
                      onChange={(e) => handleChange("year", e.target.value)}
                      placeholder="1st / 2nd / 3rd / Final"
                      required
                    />
                    {formErrors.year && <p className="text-[11px] text-red-300">{formErrors.year}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Phone <span className="text-red-400">*</span></label>
                    <input
                      ref={phoneRef}
                      name="phone"
                      type="tel"
                      className={`input-base ${formErrors.phone ? "ring-2 ring-red-500/40" : ""}`}
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+91…"
                      required
                    />
                    {formErrors.phone && <p className="text-[11px] text-red-300">{formErrors.phone}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">GitHub profile <span className="text-red-400">*</span></label>
                    <input
                      ref={githubRef}
                      name="github"
                      type="url"
                      className={`input-base ${formErrors.github ? "ring-2 ring-red-500/40" : ""}`}
                      value={form.github}
                      onChange={(e) => handleChange("github", e.target.value)}
                      placeholder="https://github.com/username"
                      required
                    />
                    {formErrors.github && <p className="text-[11px] text-red-300">{formErrors.github}</p>}
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] text-slate-400">
                      Why do you want to join GenXCode? <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      ref={whyRef}
                      name="why_join"
                      rows={4}
                      className={`input-base resize-y ${formErrors.why_join ? "ring-2 ring-red-500/40" : ""}`}
                      value={form.why_join}
                      onChange={(e) => handleChange("why_join", e.target.value)}
                      placeholder="Tell us about your interests, experience and what you want to build with the community."
                      required
                    />
                    {formErrors.why_join && <p className="text-[11px] text-red-300">{formErrors.why_join}</p>}
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Once you submit, the core team will review your application.
                  You&apos;ll be contacted by email if selected for the next
                  steps (intro call / onboarding).
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
                  <p className="text-[10px] text-slate-500 max-w-xs">
                    By applying you agree to follow the{" "}
                    <span className="text-slate-300">
                      GenXCode community guidelines.
                    </span>
                  </p>
                  <motion.button
                    type="submit"
                    disabled={submitting || !isFormValid}
                    className="btn-primary text-xs px-6 py-2.5 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group"
                    whileHover={shouldReduceMotion ? {} : { scale: submitting ? 1 : 1.04, y: submitting ? 0 : -2, boxShadow: submitting ? "" : "0 10px 30px rgba(34,211,238,0.12)" }}
                    whileTap={shouldReduceMotion ? {} : { scale: submitting ? 1 : 0.98 }}
                  >
                    <span className="relative z-[1] flex items-center gap-2">
                      {submitting ? (
                        <>
                          <span className="h-3 w-3 rounded-full border-2 border-cyan-300 border-t-transparent animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          <span>Submit application</span>
                          <span>↗</span>
                        </>
                      )}
                    </span>
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-400/40 via-sky-500/30 to-indigo-500/40 opacity-0 transition group-hover:opacity-100" />
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.section>
      </div>
    </main>
  );
}
