import { motion } from "framer-motion";
import { useState } from "react";

export default function Recruitment() {

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    contact: "",
    branch: "",
    year: "",
    domain: "",
    motivation: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  /* ================= FIELD VALIDATORS ================= */

  const validators = {
    fullName: (value) => {
      if (!value.trim()) return "Full name is required.";
      if (!/^[A-Za-z\s]+$/.test(value))
        return "Only alphabets and spaces allowed.";
      if (value.trim().length < 3)
        return "Name must be at least 3 characters.";
      return "";
    },

    email: (value) => {
      if (!value.trim()) return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Enter a valid email address.";
      return "";
    },

    contact: (value) => {
      if (!value.trim()) return "Contact number is required.";
      if (!/^[6-9]\d{9}$/.test(value))
        return "Enter valid 10-digit Indian number.";
      return "";
    },

    branch: (value) => value ? "" : "Please select your branch.",
    year: (value) => value ? "" : "Please select your year.",
    domain: (value) => value ? "" : "Please select a domain.",

    motivation: (value) => {
      if (!value.trim()) return "This field is required.";
      if (value.trim().length < 30)
        return "Minimum 30 characters required.";
      return "";
    },
  };

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "contact") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    if (name === "fullName") {
      updatedValue = value.replace(/[^A-Za-z\s]/g, "");
    }

    setForm((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    const errorMessage = validators[name](updatedValue);
    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  /* ================= HANDLE SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const error = validators[key](form[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Submission failed");
      }

      setShowSuccessModal(true);

      setForm({
        fullName: "",
        email: "",
        contact: "",
        branch: "",
        year: "",
        domain: "",
        motivation: "",
      });

      setErrors({});

    } catch (error) {
      alert("Something went wrong. Please try again.");
    }

    setIsSubmitting(false);
  };

  /* ================= UI ================= */

  return (
    <>
      <div className="relative min-h-screen text-slate-100 px-4 sm:px-6 py-16 sm:py-24">

        <div className="max-w-4xl mx-auto text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
            Become a Part of GenXCode
          </h2>

          <p className="mt-4 text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Complete the application below and join a team that builds, leads,
            and creates meaningful impact.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-12">

          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-semibold">
              Application Form
            </h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>

            <InputField label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} />

            <InputField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />

            <InputField label="WhatsApp Contact" name="contact" type="tel" value={form.contact} onChange={handleChange} error={errors.contact} />

            <SelectField label="Branch" name="branch" value={form.branch} onChange={handleChange} error={errors.branch}>
              <option value="">Select Branch</option>
              <option>CSE</option>
              <option>Artificial Intelligence</option>
              <option>Data Science</option>
              <option>Information Technology</option>
              <option>Other</option>
            </SelectField>

            <SelectField label="Current Year" name="year" value={form.year} onChange={handleChange} error={errors.year}>
              <option value="">Select Year</option>
              <option>FY</option>
              <option>SY</option>
              <option>DSY</option>
              <option>TY</option>
              <option>LY</option>
            </SelectField>

            <SelectField label="Domain Applying For" name="domain" value={form.domain} onChange={handleChange} error={errors.domain}>
              <option value="">Select Domain</option>
              <option>Tech Team</option>
              <option>Event Organization</option>
              <option>Social Media Team</option>
            </SelectField>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">
                Why Should We Select You? *
              </label>
              <textarea
                name="motivation"
                rows="4"
                value={form.motivation}
                onChange={handleChange}
                className={`w-full rounded-xl border ${
                  errors.motivation ? "border-red-500" : "border-slate-700"
                } bg-slate-950/70 px-4 py-3 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all`}
              />
              <div className="flex justify-between text-xs">
                <span className="text-red-400">{errors.motivation}</span>
                <span className="text-slate-400">{form.motivation.length}/30+</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded-full px-6 py-3 text-sm font-semibold text-slate-950 transition-all ${
                isSubmitting
                  ? "bg-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-500 to-indigo-500 hover:brightness-110"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Application 🚀"}
            </button>

          </form>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center shadow-xl"
          >
            <h3 className="text-2xl font-semibold text-cyan-300 mb-4">
              🎉 Application Submitted!
            </h3>

            <p className="text-slate-400 text-sm mb-6">
              Join our WhatsApp community to stay updated with announcements,
              shortlists and upcoming activities.
            </p>

            <a
              href="https://chat.whatsapp.com/JpNxXypDcmuCM6A80q8pPd?mode=gi_t"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-green-400 to-green-600 text-black font-semibold py-3 rounded-full mb-4 hover:brightness-110 transition"
            >
              Join WhatsApp Community
            </a>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="text-slate-400 text-sm hover:text-white transition"
            >
              Maybe Later
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}

/* ---------- Components ---------- */

function InputField({ label, name, type = "text", value, onChange, error }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-slate-300">
        {label} *
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-xl border ${
          error ? "border-red-500" : "border-slate-700"
        } bg-slate-950/70 px-4 py-3 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all`}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function SelectField({ label, name, value, onChange, error, children }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-slate-300">
        {label} *
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-xl border ${
          error ? "border-red-500" : "border-slate-700"
        } bg-slate-950/70 px-4 py-3 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all`}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}