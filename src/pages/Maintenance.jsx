import BackgroundOrbs from "../components/shared/BackgroundOrbs";

export default function Maintenance() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden">

      {/* Background */}
      <BackgroundOrbs />

      {/* Gradient Blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-indigo-500/5" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">

        <div className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-2xl shadow-[0_0_100px_rgba(56,189,248,0.15)] p-10 md:p-14 text-center">

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

            <span className="text-cyan-300 font-medium tracking-wide">
              MAINTENANCE IN PROGRESS
            </span>

          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold leading-[1.2] pb-2 bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
            We're Building Something Better
          </h1>

          {/* Description */}
          <p className="mt-8 text-slate-300 text-lg leading-8 max-w-2xl mx-auto">
            GenXCode is currently undergoing scheduled maintenance while we
            introduce new features, improve performance, and strengthen our
            infrastructure to deliver a better experience for everyone.
          </p>

          {/* Notice */}
          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-950/60 p-6">

            <h3 className="text-cyan-300 font-semibold text-lg">
              What's happening?
            </h3>

            <p className="mt-3 text-slate-400 leading-7">
              Our engineering team is working behind the scenes to ensure every
              update is stable, secure, and ready before reopening the platform.
            </p>

          </div>

          {/* Footer */}
          <div className="mt-10 border-t border-slate-800 pt-6">

            <p className="text-slate-500">
              There is currently <span className="text-cyan-300 font-medium">no estimated completion time.</span>
            </p>

            <p className="mt-3 text-sm text-slate-600">
              Thank you for your patience and continued support.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}