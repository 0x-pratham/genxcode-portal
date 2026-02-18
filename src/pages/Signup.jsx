// src/pages/Signup.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import BackgroundOrbs from "../components/BackgroundOrbs";

// Branch options
const BRANCHES = [
  "CSE",
  "IT",
  "AI-DS",
  "ECE",
  "EEE",
  "ME",
  "CE",
  "Other",
];

// Year options
const YEARS = ["1st Year", "2nd Year", "3rd Year", "Final Year"];

// Password strength checker
const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: "", color: "" };
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength <= 2) return { strength, label: "Weak", color: "red" };
  if (strength <= 4) return { strength, label: "Medium", color: "amber" };
  return { strength, label: "Strong", color: "emerald" };
};

export default function Signup() {
  const navigate = useNavigate();

  const [checkingSession, setCheckingSession] = useState(true);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    branch: "",
    year: "",
    github: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      if (!supabase) {
        setCheckingSession(false);
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (data?.session) navigate("/dashboard", { replace: true });
      else setCheckingSession(false);
    };
    checkSession();
  }, [navigate]);

  // Validation functions
  const validateField = (field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case "full_name":
        if (!value.trim()) {
          newErrors.full_name = "Full name is required";
        } else if (value.trim().length < 2) {
          newErrors.full_name = "Name must be at least 2 characters";
        } else {
          delete newErrors.full_name;
        }
        break;

      case "email":
        if (!value.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;

      case "password":
        if (!value) {
          newErrors.password = "Password is required";
        } else if (value.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        } else {
          delete newErrors.password;
        }
        // Re-validate confirm password if it exists
        if (form.confirmPassword) {
          if (value !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
          } else {
            delete newErrors.confirmPassword;
          }
        }
        break;

      case "confirmPassword":
        if (!value) {
          newErrors.confirmPassword = "Please confirm your password";
        } else if (value !== form.password) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      case "branch":
        if (!value) {
          newErrors.branch = "Branch is required";
        } else {
          delete newErrors.branch;
        }
        break;

      case "year":
        if (!value) {
          newErrors.year = "Year is required";
        } else {
          delete newErrors.year;
        }
        break;

      case "github":
        if (!value.trim()) {
          newErrors.github = "GitHub profile is required";
        } else if (
          !/^https?:\/\/(www\.)?github\.com\/[\w-]+/.test(value.trim())
        ) {
          newErrors.github = "Please enter a valid GitHub profile URL";
        } else {
          delete newErrors.github;
        }
        break;

      case "phone":
        if (value && !/^\+?[\d\s-()]+$/.test(value)) {
          newErrors.phone = "Please enter a valid phone number";
        } else {
          delete newErrors.phone;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field) => {
    setTouched((t) => ({ ...t, [field]: true }));
    validateField(field, form[field]);
  };

  const validateForm = () => {
    const requiredFields = [
      "full_name",
      "email",
      "password",
      "confirmPassword",
      "branch",
      "year",
      "github",
    ];

    const newTouched = {};
    const newErrors = {};

    requiredFields.forEach((field) => {
      newTouched[field] = true;
      validateField(field, form[field]);
    });

    setTouched(newTouched);

    // Check if there are any errors
    Object.keys(errors).forEach((field) => {
      if (errors[field]) {
        newErrors[field] = errors[field];
      }
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");

    if (!validateForm()) {
      setErrorMsg("Please fix the errors in the form.");
      return;
    }

    const { full_name, email, password, branch, year, github, phone } = form;

    setSubmitting(true);

    try {
      if (!supabase) {
        setErrorMsg("Supabase is not configured. Please check your environment variables.");
        setSubmitting(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            full_name: full_name.trim(),
            branch,
            year,
            github: github.trim(),
            phone: phone.trim() || null,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setSubmitting(false);
        return;
      }

      const userId = data?.user?.id;
      if (!userId) {
        setInfoMsg("Signup successful. Please verify your email.");
        setSubmitting(false);
        return;
      }

      // Profile and leaderboard are created automatically by trigger
      // But we'll upsert to ensure they exist
      await supabase.from("profiles").upsert({
        id: userId,
        full_name: full_name.trim(),
        branch,
        year,
        github: github.trim(),
        phone: phone.trim() || null,
      });

      await supabase.from("leaderboard").upsert({
        user_id: userId,
        points: 0,
        league: "Bronze",
      });

      setInfoMsg("Signup successful! Redirecting…");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const passwordStrength = getPasswordStrength(form.password);

  if (checkingSession) {
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
    <main className="relative min-h-screen text-slate-100 pb-24 flex items-center overflow-hidden">
      <BackgroundOrbs />

      <div className="container-page max-w-6xl mx-auto w-full pt-20 md:pt-24 relative z-10">
        <div className="grid gap-10 md:gap-12 lg:grid-cols-[1.2fr,1.1fr] items-start">
          {/* LEFT SIDE - Enhanced */}
          <motion.section
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-300 shadow-lg shadow-cyan-500/20 backdrop-blur"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.span
                className="inline-flex h-2 w-2 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="font-medium tracking-wide">
                Step into the GenXCode ecosystem
              </span>
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Create your{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                  GenXCode
                </span>{" "}
                account.
              </motion.h1>
              <motion.p
                className="text-sm md:text-base text-slate-400 max-w-xl leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Join a community of builders, learners, and innovators. One
                account unlocks challenges, leaderboard rankings, developer
                profiles, and exclusive opportunities.
              </motion.p>
            </div>

            {/* Benefits list */}
            <motion.ul
              className="space-y-3 text-sm text-slate-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {[
                "Access to coding challenges and projects",
                "Track your progress on the leaderboard",
                "Earn points and climb leagues",
                "Connect with fellow developers",
              ].map((benefit, idx) => (
                <motion.li
                  key={benefit}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
                >
                  <motion.span
                    className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400 flex-shrink-0"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: idx * 0.3,
                    }}
                  />
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              className="flex items-center gap-2 text-[11px] text-slate-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <span className="h-1 w-1 rounded-full bg-slate-600" />
              <span>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-cyan-300 hover:text-cyan-200 underline-offset-2 hover:underline transition"
                >
                  Sign in
                </Link>
              </span>
            </motion.div>
          </motion.section>

          {/* RIGHT SIDE - Enhanced Form */}
          <motion.section
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {/* Animated glow border */}
            <motion.div
              className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-cyan-500/40 via-slate-900 to-fuchsia-500/40 opacity-70 blur-lg"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="relative rounded-3xl bg-slate-950/90 border border-slate-700/80 px-6 py-6 md:px-8 md:py-8 backdrop-blur shadow-2xl shadow-slate-950/80"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            >
              <header className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-semibold mb-2">
                  Get started
                </h2>
                <p className="text-xs md:text-sm text-slate-400">
                  Fill in your details to create your account
                </p>
              </header>

              <AnimatePresence>
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xs text-red-300 bg-red-900/30 border border-red-500/40 rounded-xl px-4 py-3 mb-4"
                  >
                    {errorMsg}
                  </motion.div>
                )}

                {infoMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xs text-emerald-300 bg-emerald-900/30 border border-emerald-500/40 rounded-xl px-4 py-3 mb-4"
                  >
                    {infoMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={(e) => handleChange("full_name", e.target.value)}
                    onBlur={() => handleBlur("full_name")}
                    placeholder="John Doe"
                    className={`input-base ${
                      errors.full_name
                        ? "border-red-500/50 focus:border-red-400"
                        : touched.full_name && !errors.full_name
                        ? "border-emerald-500/50"
                        : ""
                    }`}
                  />
                  {errors.full_name && (
                    <p className="text-[10px] text-red-400">{errors.full_name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="john.doe@example.com"
                    className={`input-base ${
                      errors.email
                        ? "border-red-500/50 focus:border-red-400"
                        : touched.email && !errors.email
                        ? "border-emerald-500/50"
                        : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[10px] text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Branch and Year - Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">
                      Branch <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={form.branch}
                      onChange={(e) => handleChange("branch", e.target.value)}
                      onBlur={() => handleBlur("branch")}
                      className={`input-base ${
                        errors.branch
                          ? "border-red-500/50 focus:border-red-400"
                          : touched.branch && !errors.branch
                          ? "border-emerald-500/50"
                          : ""
                      }`}
                    >
                      <option value="">Select branch</option>
                      {BRANCHES.map((branch) => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                    {errors.branch && (
                      <p className="text-[10px] text-red-400">{errors.branch}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">
                      Year <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={form.year}
                      onChange={(e) => handleChange("year", e.target.value)}
                      onBlur={() => handleBlur("year")}
                      className={`input-base ${
                        errors.year
                          ? "border-red-500/50 focus:border-red-400"
                          : touched.year && !errors.year
                          ? "border-emerald-500/50"
                          : ""
                      }`}
                    >
                      <option value="">Select year</option>
                      {YEARS.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    {errors.year && (
                      <p className="text-[10px] text-red-400">{errors.year}</p>
                    )}
                  </div>
                </div>

                {/* GitHub */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">
                    GitHub Profile <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="url"
                    value={form.github}
                    onChange={(e) => handleChange("github", e.target.value)}
                    onBlur={() => handleBlur("github")}
                    placeholder="https://github.com/username"
                    className={`input-base ${
                      errors.github
                        ? "border-red-500/50 focus:border-red-400"
                        : touched.github && !errors.github
                        ? "border-emerald-500/50"
                        : ""
                    }`}
                  />
                  {errors.github && (
                    <p className="text-[10px] text-red-400">{errors.github}</p>
                  )}
                  <p className="text-[10px] text-slate-500">
                    Your GitHub profile URL (e.g., https://github.com/username)
                  </p>
                </div>

                {/* Phone - Optional */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">
                    Phone <span className="text-slate-500">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    placeholder="+91 1234567890"
                    className={`input-base ${
                      errors.phone ? "border-red-500/50 focus:border-red-400" : ""
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-[10px] text-red-400">{errors.phone}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      onBlur={() => handleBlur("password")}
                      placeholder="Create a strong password"
                      className={`input-base pr-10 ${
                        errors.password
                          ? "border-red-500/50 focus:border-red-400"
                          : touched.password && !errors.password
                          ? "border-emerald-500/50"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[10px] text-red-400">{errors.password}</p>
                  )}
                  {form.password && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${
                              passwordStrength.color === "red"
                                ? "bg-red-500"
                                : passwordStrength.color === "amber"
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(passwordStrength.strength / 6) * 100}%`,
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <span
                          className={`text-[10px] ${
                            passwordStrength.color === "red"
                              ? "text-red-400"
                              : passwordStrength.color === "amber"
                              ? "text-amber-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {passwordStrength.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Use 8+ characters with mix of letters, numbers & symbols
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) =>
                        handleChange("confirmPassword", e.target.value)
                      }
                      onBlur={() => handleBlur("confirmPassword")}
                      placeholder="Confirm your password"
                      className={`input-base pr-10 ${
                        errors.confirmPassword
                          ? "border-red-500/50 focus:border-red-400"
                          : touched.confirmPassword &&
                            !errors.confirmPassword &&
                            form.confirmPassword
                          ? "border-emerald-500/50"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[10px] text-red-400">
                      {errors.confirmPassword}
                    </p>
                  )}
                  {form.confirmPassword &&
                    !errors.confirmPassword &&
                    form.password === form.confirmPassword && (
                      <p className="text-[10px] text-emerald-400">
                        ✓ Passwords match
                      </p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-primary px-6 py-3 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group"
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                  >
                    <span className="relative z-[1] flex items-center justify-center gap-2">
                      {submitting ? (
                        <>
                          <span className="h-4 w-4 rounded-full border-2 border-cyan-300 border-t-transparent animate-spin" />
                          Creating account…
                        </>
                      ) : (
                        <>
                          <span>Create account</span>
                          <span>↗</span>
                        </>
                      )}
                    </span>
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-400/40 via-sky-500/30 to-indigo-500/40 opacity-0 transition group-hover:opacity-100" />
                  </motion.button>
                </div>

                <p className="text-[10px] text-slate-500 text-center pt-2">
                  By signing up, you agree to GenXCode's{" "}
                  <span className="text-cyan-300">Terms of Service</span> and{" "}
                  <span className="text-cyan-300">Privacy Policy</span>
                </p>
              </form>
            </motion.div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
