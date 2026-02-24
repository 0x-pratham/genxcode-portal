// src/components/Navbar.jsx
import { useEffect, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import ProfileDropdown from "./navbar/ProfileDropdown";
import MobileMenu from "./navbar/MobileMenu";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Announcements", to: "/announcements" },
  { label: "Challenges", to: "/challenges" },
  { label: "Leaderboard", to: "/leaderboard" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  
  const email = user?.email || "";
  const userMeta = user?.user_metadata || {};
  const [scrolled, setScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
  let ticking = false;

  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

useEffect(() => {
  setMobileOpen(false);
}, [location.pathname]);

  const handleLogout = async () => {
  await supabase.auth.signOut();
  navigate("/login");
};
  // Helper: desktop nav links
  const renderNavLink = (to, label, end = false) => (
  <NavLink
    key={to}
    to={to}
    end={end}
    className={({ isActive }) =>
      [
        "relative px-5 py-2 text-sm md:text-[15px] font-medium transition-all duration-200 transform-gpu",
isActive
  ? "text-cyan-300"
  : "text-slate-300 hover:text-white hover:scale-[1.03]",
      ].join(" ")
    }
  >
    {({ isActive }) => (
      <>
        <span className="relative z-[1]">{label}</span>

        {isActive && (
          <motion.span
            layoutId="nav-underline"
            className="absolute inset-x-4 -bottom-1 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 shadow-[0_0_18px_rgba(34,211,238,0.7)]"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
      </>
    )}
  </NavLink>
);
  return (
    <motion.nav
      className={`sticky top-0 z-50 border-b transition-all duration-300 transition-colors ${
  scrolled
  ? "border-slate-800/90 bg-slate-950/98 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
  : "border-slate-800/50 bg-slate-950/60 backdrop-blur-xl"
}`}
      initial={shouldReduceMotion ? false : { y: -25, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
whileHover={shouldReduceMotion ? {} : { boxShadow: "0 12px 50px rgba(0,0,0,0.7)" }}
transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* glow line */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-b from-transparent to-slate-950/40" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-cyan-400/20 via-fuchsia-400/20 to-emerald-400/20" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* main row */}
        <div
  className={`flex items-center justify-between gap-6 transition-all duration-300 ${
    scrolled ? "py-3 md:py-3.5" : "py-4 md:py-5"
  }`}
>
          {/* === Logo (left) === */}
          <Link
            to="/"
            className="flex items-center gap-3 group shrink-0"
            onClick={() => setMobileOpen(false)}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 blur-md bg-cyan-400/40 opacity-0 group-hover:opacity-100"
                initial={false}
                transition={{ duration: 0.3 }}
              />
              <motion.img
                src="https://i.ibb.co/FkVqXHZ8/Gen-XCode-Logo.png"
                alt="GenXCode logo"
                className={`relative rounded-2xl object-contain ring-1 ring-cyan-400/40 bg-slate-950/80 transition-all duration-300 ${
  scrolled
    ? "h-9 w-9 md:h-10 md:w-10"
    : "h-11 w-11 md:h-12 md:w-12"
}`}
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg md:text-2xl font-semibold tracking-tight">
                GenXCode
              </span>
              <span className="text-[4px] md:text-[6px] uppercase tracking-[0.3em] text-cyan-300/80">
                Code · Create · Conquer
              </span>
            </div>
          </Link>

          {/* === Center nav (desktop) === */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center gap-1 rounded-full border border-slate-800/70 bg-slate-950/50 backdrop-blur-xl px-2 py-1.5 shadow-inner shadow-slate-900/40">
              {navItems.map((item) =>
                renderNavLink(item.to, item.label, item.to === "/")
              )}
            </div>
          </div>

          {/* === Right side (desktop actions) === */}
          <div className="hidden md:flex items-center justify-end gap-4 shrink-0">
            {user ? (
              <>
                {/* Dashboard */}
                <Link to="/dashboard">
  <motion.button
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.96 }}
    className="relative inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-slate-950/50 backdrop-blur-xl px-5 py-2.5 text-xs md:text-sm font-medium text-cyan-200 shadow-lg shadow-cyan-500/10 overflow-hidden transition-all duration-300 hover:border-cyan-300 hover:shadow-cyan-400/30"
  >
    <span className="relative z-10 flex items-center gap-2">
      <span className="text-[13px]">📊</span>
      Dashboard
    </span>

    {/* light sweep */}
    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
  </motion.button>
</Link>

                {/* Admin (only if admin) */}
                {isAdmin ? (
                  <Link to="/admin">
  <motion.button
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.96 }}
    aria-label="Open admin panel"
    className="relative inline-flex items-center gap-2 rounded-full border border-fuchsia-400/40 bg-slate-950/50 backdrop-blur-xl px-5 py-2.5 text-xs md:text-sm font-medium text-fuchsia-200 shadow-lg shadow-fuchsia-500/10 overflow-hidden transition-all duration-300 hover:border-fuchsia-300 hover:shadow-fuchsia-400/30"
  >
    <span className="relative z-10 flex items-center gap-2">
      <span className="text-[13px]">⚙</span>
      Admin Panel
    </span>

    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-fuchsia-400/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
  </motion.button>
</Link>
                ) :loading ? (
                  <div className="px-4 py-2 text-xs text-slate-400">Checking role…</div>
                ) : null}

                {/* Profile pill */}
                {/* Profile Dropdown */}
                <ProfileDropdown
  user={user}
  isAdmin={isAdmin}
  onLogout={handleLogout}
/>

              </>
            ) : (
              <>
                <Link to="/login">
  <motion.button
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.96 }}
    className="rounded-full border border-slate-700 bg-slate-950/70 px-5 py-2.5 text-xs md:text-sm text-slate-200 hover:border-cyan-400 hover:text-cyan-200 hover:shadow-md hover:shadow-cyan-500/20 transition-all"
  >
    Log in
  </motion.button>
</Link>
                <Link to="/signup">
  <motion.button
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.96 }}
    className="rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 px-6 py-2.5 text-xs md:text-sm font-medium text-slate-950 shadow-lg shadow-cyan-500/40 hover:brightness-110 active:scale-95 transition-all"
  >
    Join now
  </motion.button>
</Link>
              </>
            )}
          </div>

          {/* === Mobile right side (logo stays same) === */}
          <div className="md:hidden flex items-center gap-2">
            {user ? (
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                <button className="text-[11px] px-3 py-1.5 rounded-full border border-cyan-500/60 bg-slate-950/80 text-cyan-200">
                  Dashboard
                </button>
              </Link>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <button className="text-[11px] px-3 py-1.5 rounded-full border border-slate-700 bg-slate-950/80">
                  Login
                </button>
              </Link>
            )}

            {/* hamburger */}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="relative h-10 w-10 sm:h-9 sm:w-9 rounded-full border border-slate-700 bg-slate-900/80 flex items-center justify-center active:scale-95 transition-all"
              aria-label="Toggle navigation menu"
            >
              <div className="relative h-3.5 w-4">
                <span
                  className={`absolute left-0 right-0 h-0.5 rounded-full bg-slate-100 transition-transform ${
                    mobileOpen ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 right-0 h-0.5 rounded-full bg-slate-100 transition-opacity ${
                    mobileOpen ? "opacity-0" : "top-1.5 opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 right-0 h-0.5 rounded-full bg-slate-100 transition-transform ${
                    mobileOpen ? "bottom-1.5 -rotate-45" : "bottom-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

<MobileMenu
  mobileOpen={mobileOpen}
  setMobileOpen={setMobileOpen}
  user={user}
  isAdmin={isAdmin}
  handleLogout={handleLogout}
  navItems={navItems}
  location={location}
/>
</motion.nav>
  );
};

export default Navbar;
