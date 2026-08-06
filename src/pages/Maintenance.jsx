import { useEffect, useState } from "react";
import BackgroundOrbs from "../components/shared/BackgroundOrbs";

export default function Maintenance() {
  // 🔥 Set your launch date & time here
  // Example: August 7, 2026 at 6:45 PM
  const launchDate = new Date("2026-08-07T18:45:00").getTime();

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = launchDate - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      ),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Background */}
      <BackgroundOrbs />

      {/* Gradient Blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-indigo-500/5" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-2xl shadow-[0_0_100px_rgba(56,189,248,0.15)] p-10 md:p-14 text-center">
          {/* Logo */}
          <img
            src="https://i.ibb.co/SDYy36xJ/Logo.jpg"
            alt="GenXCode Logo"
            className="mx-auto h-20 w-20 rounded-2xl shadow-lg mb-8"
          />

          {/* Status Badge */}
          <div className="inline-flex items-center gap-3 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-2 mb-8">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-400"></span>
            </span>

            <span className="text-cyan-300 font-medium tracking-wider">
              MAINTENANCE IN PROGRESS
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
            We're Building Something Better
          </h1>

          {/* Description */}
          <p className="mt-8 text-slate-300 text-lg leading-8 max-w-2xl mx-auto">
            GenXCode is currently undergoing scheduled maintenance while we
            introduce new features, improve performance, and strengthen our
            infrastructure to deliver a faster and more reliable learning
            platform.
          </p>

          {/* Countdown */}
          <div className="mt-12">
            <p className="text-cyan-300 uppercase tracking-[0.3em] text-sm mb-8">
              Estimated Time Remaining
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {/* Days */}
              <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/60 p-6">
                <h2 className="text-5xl font-bold text-cyan-300">
                  {String(timeLeft.days).padStart(2, "0")}
                </h2>
                <p className="mt-3 text-slate-500 uppercase text-xs tracking-[0.25em]">
                  Days
                </p>
              </div>

              {/* Hours */}
              <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/60 p-6">
                <h2 className="text-5xl font-bold text-cyan-300">
                  {String(timeLeft.hours).padStart(2, "0")}
                </h2>
                <p className="mt-3 text-slate-500 uppercase text-xs tracking-[0.25em]">
                  Hours
                </p>
              </div>

              {/* Minutes */}
              <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/60 p-6">
                <h2 className="text-5xl font-bold text-cyan-300">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </h2>
                <p className="mt-3 text-slate-500 uppercase text-xs tracking-[0.25em]">
                  Minutes
                </p>
              </div>

              {/* Seconds */}
              <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/60 p-6">
                <h2 className="text-5xl font-bold text-cyan-300">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </h2>
                <p className="mt-3 text-slate-500 uppercase text-xs tracking-[0.25em]">
                  Seconds
                </p>
              </div>
            </div>
          </div>

          {/* Notice */}
          <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
            <h3 className="text-cyan-300 font-semibold text-xl">
              What are we working on?
            </h3>

            <p className="mt-4 text-slate-400 leading-8">
              Our engineering team is upgrading the GenXCode platform with a
              brand-new Learning Management System (LMS), improved dashboards,
              faster performance, enhanced security, and a smoother experience
              for every student.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-12 border-t border-slate-800 pt-8">
            <p className="text-slate-400 text-lg">
              Launching on
              <span className="text-cyan-300 font-semibold">
                {" "}
                7 August 2026
              </span>
            </p>

            <p className="mt-4 text-sm text-slate-500">
              Thank you for your patience and continued support.
              <br />
              We'll be back soon with an even better GenXCode experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}