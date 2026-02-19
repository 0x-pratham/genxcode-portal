import { useEffect, useState } from "react";

export default function Maintenance() {
  const launchDate = new Date();
  launchDate.setHours(launchDate.getHours() + 72);

  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = launchDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen isolate overflow-hidden bg-slate-950 text-slate-100">

      {/* 🌌 Premium Mesh Background */}
      <div className="absolute inset-0 -z-10">

        {/* Soft animated radial depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.15),transparent_40%)] animate-mesh" />

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-32 pb-20">

        <div className="rounded-3xl border border-slate-800 bg-slate-950/85 backdrop-blur-2xl shadow-[0_0_80px_rgba(56,189,248,0.15)] px-8 py-12 text-center transition-all duration-500 hover:scale-[1.02]">

          {/* Logo */}
          <div className="mb-6">
            <img
              src="https://i.ibb.co/SDYy36xJ/Logo.jpg"
              alt="GenXCode Logo"
              className="mx-auto h-16 w-16 rounded-xl shadow-lg"
            />
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-semibold bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400 bg-clip-text text-transparent mb-6">
            We’re Upgrading GenXCode
          </h1>

          <p className="text-sm md:text-base text-slate-400 mb-10">
            We are deploying major improvements to enhance performance,
            scalability and overall experience.
          </p>

          {/* Countdown */}
          <div className="grid grid-cols-4 gap-4">
            {["days", "hours", "minutes", "seconds"].map((unit) => (
              <div
                key={unit}
                className="rounded-xl bg-slate-900 border border-slate-800 py-5"
              >
                <p className="text-2xl md:text-3xl font-semibold text-cyan-300 animate-pulse-glow">
                  {timeLeft[unit] ?? "00"}
                </p>
                <p className="text-[11px] uppercase text-slate-500 tracking-wide mt-1">
                  {unit}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-xs text-slate-500">
            Expected relaunch soon. Thank you for your patience.
          </div>

        </div>

      </div>
    </div>
  );
}
