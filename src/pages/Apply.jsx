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
                className="rounded-2xl border border-cyan-500/10 bg-white/5 px-4 py-4 shadow-[0_0_30px_rgba(34,211,238,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:shadow-cyan-500/10"
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
                className="rounded-2xl border border-cyan-500/10 bg-white/5 px-4 py-4 shadow-[0_0_30px_rgba(34,211,238,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:shadow-cyan-500/10"
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.25, delay: 0.05 }}
              >
                <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300 mb-1">
                  What you get
                </p>
                <ul className="text-[11px] md:text-xs text-slate-200 space-y-2">

                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    <span>Priority access to projects & hackathons</span>
                  </li>

                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>Leadership & mentorship opportunities</span>
                  </li>

                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400" />
                    <span>Portfolio, certificates & recognition</span>
                  </li>

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

            <div className="relative rounded-3xl bg-white/10 border border-white/10 px-5 py-5 md:px-6 md:py-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl space-y-4 overflow-hidden"> 
              {/* top glow */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />

              {/* Premium Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 pb-4 mb-2">

                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-400">
                    GenXCode Recruitment
                  </p>

                  <h2 className="text-lg md:text-xl font-semibold text-white">
                    Tell us about yourself
                  </h2>

                  <p className="text-[11px] text-slate-400">
                    Fill out the application carefully to join the GenXCode community
                  </p>
                </div>

                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-medium text-emerald-300 shadow-sm shadow-emerald-500/10">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Applications Open
                </span>

              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] font-medium tracking-wide text-slate-300">
                      Full name <span className="text-red-400">*</span>
                    </label>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        👤
                      </span>

                      <input
                        ref={fullNameRef}
                        name="full_name"
                        type="text"
                        placeholder="Enter your full name"
                        className={`input-base pl-10 bg-slate-900/60 border border-slate-700/60 backdrop-blur-md focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 focus:scale-[1.01] ${formErrors.full_name ? "ring-2 ring-red-500/40" : ""
                          }`}
                        value={form.full_name}
                        onChange={(e) => handleChange("full_name", e.target.value)}
                        required
                      />
                    </div>

                    {formErrors.full_name && (
                      <p className="text-[11px] text-red-300">
                        {formErrors.full_name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] font-medium tracking-wide text-slate-300">
                      Email <span className="text-red-400">*</span>
                    </label>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        ✉️
                      </span>

                      <input
                        ref={emailRef}
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className={`input-base pl-10 bg-slate-900/60 border border-slate-700/60 backdrop-blur-md focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 focus:scale-[1.01] ${formErrors.email ? "ring-2 ring-red-500/40" : ""
                          }`}
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                      />
                    </div>

                    {formErrors.email && (
                      <p className="text-[11px] text-red-300">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">
                      Branch <span className="text-red-400">*</span>
                    </label>

                    <select
                      ref={branchRef}
                      name="branch"
                      className={`input-base bg-slate-900/60 border border-slate-700/60 backdrop-blur-md focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 focus:scale-[1.01] ${formErrors.branch ? "ring-2 ring-red-500/40" : ""
                        }`}

                      value={form.branch}
                      onChange={(e) => handleChange("branch", e.target.value)}
                      required
                    >
                      <option value="">Select your branch</option>
                      <option value="CSE">CSE</option>
                      <option value="EXTC">AIML</option>
                      <option value="IT">IT</option>
                      <option value="AI-DS">AI-DS</option>
                      <option value="EXTC">EXTC</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Civil">Civil</option>
                    </select>

                    {formErrors.branch && (
                      <p className="text-[11px] text-red-300">
                        {formErrors.branch}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">
                      Year <span className="text-red-400">*</span>
                    </label>

                    <select
                      ref={yearRef}
                      name="year"
                      className={`input-base bg-slate-900/60 border border-slate-700/60 backdrop-blur-md focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 focus:scale-[1.01] ${formErrors.year ? "ring-2 ring-red-500/40" : ""
                        }`}
                      value={form.year}
                      onChange={(e) => handleChange("year", e.target.value)}
                      required
                    >
                      <option value="">Select your year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="Final Year">Final Year</option>
                    </select>

                    {formErrors.year && (
                      <p className="text-[11px] text-red-300">
                        {formErrors.year}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium tracking-wide text-slate-300">
                      Phone Number <span className="text-red-400">*</span>
                    </label>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        📞
                      </span>

                      <input
                        ref={phoneRef}
                        name="phone"
                        type="tel"
                        placeholder="+91 xxxxx-xxxxx"
                        className={`input-base pl-10 bg-slate-900/60 border border-slate-700/60 backdrop-blur-md focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 focus:scale-[1.01] ${formErrors.phone ? "ring-2 ring-red-500/40" : ""
                          }`}
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        required
                      />
                    </div>

                    {formErrors.phone && (
                      <p className="text-[11px] text-red-300">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium tracking-wide text-slate-300">
                      GitHub Profile <span className="text-red-400">*</span>
                    </label>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        🚀
                      </span>

                      <input
                        ref={githubRef}
                        name="github"
                        type="url"
                        placeholder="https://github.com/username"
                        className={`input-base pl-10 bg-slate-900/60 border border-slate-700/60 backdrop-blur-md focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 focus:scale-[1.01] ${formErrors.github ? "ring-2 ring-red-500/40" : ""
                          }`}
                        value={form.github}
                        onChange={(e) => handleChange("github", e.target.value)}
                        required
                      />
                    </div>

                    {formErrors.github && (
                      <p className="text-[11px] text-red-300">
                        {formErrors.github}
                      </p>
                    )}

                    <p className="text-[10px] text-slate-500 mt-1">
                      Share your GitHub profile to showcase your projects and coding experience.
                    </p>
                  </div>

                  <div className="space-y-2 md:col-span-2">

                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-medium tracking-wide text-slate-300">
                        Why do you want to join GenXCode?
                        <span className="text-red-400 ml-1">*</span>
                      </label>

                      <span className="text-[10px] text-cyan-400">
                        Share your motivation ✨
                      </span>
                    </div>

                    <div className="relative">

                      <div className="absolute top-3 left-3 text-slate-500">
                        💡
                      </div>

                      <textarea
                        ref={whyRef}
                        name="why_join"
                        rows={5}
                        maxLength={300}
                        className={`input-base pl-10 pt-3 resize-none bg-slate-900/60 border border-slate-700/60 backdrop-blur-md focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 focus:scale-[1.01] ${formErrors.why_join ? "ring-2 ring-red-500/40" : ""
                          }`}
                        value={form.why_join}
                        onChange={(e) => handleChange("why_join", e.target.value)}
                        placeholder="Tell us about your interests, skills, experience and what you want to build with GenXCode..."
                        required
                      />

                    </div>

                    <div className="flex items-center justify-between">

                      {formErrors.why_join ? (
                        <p className="text-[11px] text-red-300">
                          {formErrors.why_join}
                        </p>
                      ) : (
                        <p className="text-[10px] text-slate-500">
                          Be genuine and concise.
                        </p>
                      )}

                      <p className="text-[10px] text-slate-500">
                        {form.why_join.length}/300
                      </p>

                    </div>

                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Once you submit, the core team will review your application.
                    You will be contacted by email if selected for the next
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
                      className="btn-primary text-xs px-6 py-3 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
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
                            <span className="font-medium tracking-wide">
                              Submit Application
                            </span>
                            <span>↗</span>
                          </>
                        )}
                      </span>
                     <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/30 via-sky-500/20 to-indigo-500/30 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                    </motion.button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.section >
      </div >
    </main >
  );
}
