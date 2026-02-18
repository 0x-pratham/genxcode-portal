// src/components/Navbar.jsx
import { useEffect, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
void motion;
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

// ✏️ Put your real admin emails here
const ADMIN_EMAILS = [
  "ofc.genxcode@gmail.com",
  "prathmeshbhil86@gmail.com",
];

const navItems = [
  { label: "Home", to: "/" },
  { label: "Announcements", to: "/announcements" },
  { label: "Challenges", to: "/challenges" },
  { label: "Leaderboard", to: "/leaderboard" },
];

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // If you want DB-based roles later, you can re-enable role loading.
  const [profileRole] = useState(null);
  const [roleLoading] = useState(false);

  // ---- Auth & user loading ----
  useEffect(() => {
    const loadUser = async () => {
      if (!isSupabaseConfigured()) return;

      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    };

    loadUser();

    if (!isSupabaseConfigured()) return;
    const { data: { subscription } = { subscription: null } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        const u = session?.user ?? null;
        setUser(u);
      });

    return () => subscription?.unsubscribe?.();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/login");
  };

  // ---- Robust admin check ----
  const email = user?.email || "";
  const userMeta = user?.user_metadata || {};
  const appMeta = user?.app_metadata || {};

  // Prefer authoritative role from `profiles` table. Fall back to other heuristics.
  const isAdmin =
    profileRole === "admin" ||
    (!!user && (
      userMeta.role === "admin" ||
      userMeta.is_admin === true ||
      userMeta.is_admin === "true" ||
      appMeta.role === "admin" ||
      (Array.isArray(appMeta.roles) && appMeta.roles.includes("admin")) ||
      ADMIN_EMAILS.includes(email)
    ));

  // Avatar initials
  const initials =
    userMeta.full_name?.[0]?.toUpperCase() ||
    email?.[0]?.toUpperCase() ||
    "G";

  // Helper: desktop nav links
  const renderNavLink = (to, label, end = false) => (
    <NavLink
      key={to}
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "relative px-5 py-2 text-sm md:text-[15px] font-medium transition-all",
          "text-slate-300 hover:text-slate-50",
          isActive ? "text-cyan-300" : "",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <span className="relative z-[1]">{label}</span>
          <span
            className={[
              "pointer-events-none absolute inset-x-4 -bottom-1 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400",
              "transition-all duration-300",
              isActive
                ? "opacity-100 scale-100 shadow-[0_0_18px_rgba(34,211,238,0.7)]"
                : "opacity-0 scale-50",
            ].join(" ")}
          />
        </>
      )}
    </NavLink>
  );

  return (
    <motion.nav
      className="sticky top-0 z-50 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur-xl"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* glow line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-cyan-500/40 via-fuchsia-500/40 to-emerald-400/40" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* main row */}
        <div className="flex items-center justify-between gap-6 py-4 md:py-5">
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
                className="relative h-11 w-11 md:h-12 md:w-12 rounded-2xl object-contain ring-1 ring-cyan-400/40 bg-slate-950/80"
                whileHover={{ scale: 1.06, rotate: -2 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
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
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="flex items-center gap-1 rounded-full border border-slate-800/80 bg-slate-950/60 px-2 py-1.5 shadow-md shadow-slate-950/60">
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
                  <button className="inline-flex items-center gap-2 rounded-full border border-cyan-500/70 bg-slate-950/70 px-5 py-2.5 text-xs md:text-sm font-medium text-cyan-200 hover:bg-cyan-500/10 hover:border-cyan-400/80 hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
                    <span className="text-[13px]">📊</span>
                    <span>Dashboard</span>
                  </button>
                </Link>

                {/* Admin (only if admin) */}
                {(profileRole === "admin" || ADMIN_EMAILS.includes(email)) ? (
                  <Link to="/admin">
                    <button aria-label="Open admin panel" className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/70 bg-gradient-to-r from-fuchsia-600/10 via-transparent to-pink-600/6 px-5 py-2.5 text-xs md:text-sm font-medium text-fuchsia-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-fuchsia-500/30 transition-transform">
                      <span className="text-[13px]">⚙</span>
                      <span>Admin Panel</span>
                    </button>
                  </Link>
                ) : roleLoading ? (
                  <div className="px-4 py-2 text-xs text-slate-400">Checking role…</div>
                ) : null}

                {/* Profile pill */}
                <Link to="/profile">
                  <button className="px-0 py-0">
                    <div className="flex items-center gap-2">
                      <div className="relative h-9 w-9 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 text-xs flex items-center justify-center font-semibold text-slate-950 shadow-lg shadow-cyan-500/40">
                        {initials}
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-[2px] border-slate-950" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs md:text-sm text-slate-200 max-w-[140px] truncate">
                          {userMeta.full_name || email?.split("@")[0]}
                        </span>
                        <span className="text-[10px] text-cyan-300">
                          {isAdmin ? "Admin" : "Member"}
                        </span>
                      </div>
                    </div>
                  </button>
                </Link>

                <button
  onClick={handleLogout}
  className="text-[11px] md:text-xs text-rose-300 hover:text-rose-200 hover:underline transition-all"
>
  Logout
</button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="rounded-full border border-slate-700 bg-slate-950/70 px-5 py-2.5 text-xs md:text-sm text-slate-200 hover:border-cyan-400 hover:text-cyan-200 hover:shadow-md hover:shadow-cyan-500/20 transition-all">
                    Log in
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 px-6 py-2.5 text-xs md:text-sm font-medium text-slate-950 shadow-lg shadow-cyan-500/40 hover:brightness-110 active:scale-95 transition-all">
                    Join now
                  </button>
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
              className="relative h-9 w-9 rounded-full border border-slate-700 bg-slate-900/80 flex items-center justify-center active:scale-95 transition-all"
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

      {/* === Mobile menu === */}
      <div
        className={`md:hidden origin-top border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl transition-all duration-300 ${
          mobileOpen
            ? "max-h-[380px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-2">
          <div className="flex flex-col gap-1 pb-2 border-b border-slate-800/60">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  [
                    "flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-colors",
                    isActive
                      ? "bg-slate-900 text-cyan-300"
                      : "text-slate-300 hover:bg-slate-900/80",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.7)]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {user ? (
            <>
              <div className="flex items-center justify-between gap-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center text-xs font-semibold text-slate-950">
                    {initials}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-slate-200">
                      {userMeta.full_name || email?.split("@")[0]}
                    </span>
                    <span className="text-[10px] text-cyan-300">
                      {isAdmin ? "Admin" : "Member"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-[11px] text-slate-400 hover:text-rose-300 hover:underline"
                >
                  Logout
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pb-2">
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                  <button className="btn-outline px-3 py-1.5 text-xs">
                    Dashboard
                  </button>
                </Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)}>
                  <button className="btn-outline px-3 py-1.5 text-xs">
                    Profile
                  </button>
                </Link>
                {(profileRole === "admin" || ADMIN_EMAILS.includes(email)) && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)}>
                    <button className="btn-outline px-3 py-1.5 text-xs border-fuchsia-500/60 text-fuchsia-300">
                      Admin Panel
                    </button>
                  </Link>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1 pb-2">
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <button className="btn-outline px-3 py-1.5 text-xs">
                  Log in
                </button>
              </Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)}>
                <button className="btn-primary px-3 py-1.5 text-xs">
                  Join now
                </button>
              </Link>
            </div>
          )}

          <p className="text-[10px] text-slate-500 pt-1 pb-1">
            You are on:{" "}
            <span className="font-mono text-cyan-300 text-[10px]">
              {location.pathname || "/"}
            </span>
          </p>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
