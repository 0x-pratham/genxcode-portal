// src/components/Navbar.jsx
import { useEffect, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { motion, useReducedMotion } from "framer-motion";
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
  const { user, isAdmin, loading, roleLoading } = useAuth();
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

  const renderNavLink = (to, label, end = false) => (
    <NavLink
      key={to}
      to={to}
      end={end}
      className={({ isActive }) => `
        relative px-5 py-2 text-[14px] font-medium tracking-wide transition-all duration-300 font-sans
        ${isActive ? "text-neutral-premiumText" : "text-neutral-secondaryText hover:text-neutral-premiumText"}
      `}
    >
      {({ isActive }) => (
        <>
          <span className="relative z-[1]">{label}</span>
          {isActive && (
            <motion.span
              layoutId="nav-underline"
              className="absolute bottom-0 left-1/4 right-1/4 h-[2px] rounded-full bg-brand-accent shadow-[0_2px_10px_rgba(0,163,255,0.4)]"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <motion.nav
      className={`sticky top-0 z-50 border-b transition-all duration-500 font-sans ${
        scrolled
          ? "border-white/[0.06] bg-brand-cosmos/85 backdrop-blur-md shadow-[0_8px_32px_rgba(2,6,23,0.4)]"
          : "border-transparent bg-transparent"
      }`}
      initial={shouldReduceMotion ? false : { y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`}>
          
          {/* === Brand Identity (Left) === */}
          <Link to="/" className="flex items-center gap-3.5 group shrink-0" onClick={() => setMobileOpen(false)}>
            <div className="relative">
              <div className="absolute inset-0 blur-md bg-brand-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img
                src="https://i.ibb.co/FkVqXHZ8/Gen-XCode-Logo.png"
                alt="GenXCode Logo"
                className={`relative rounded-xl object-contain border border-white/[0.08] bg-brand-midnight transition-all duration-300 ${
                  scrolled ? "h-9 w-9" : "h-11 w-11"
                }`}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-neutral-premiumText font-display leading-none">
                GENXCODE
              </span>
              <span className="text-[7px] uppercase tracking-[0.25em] text-brand-accent mt-1 font-medium">
                CODE. CREATE. CONQUER.
              </span>
            </div>
          </Link>

          {/* === Integrated Center Nav Menu (Desktop) === */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center gap-1 rounded-full border border-white/[0.04] bg-brand-midnight/40 backdrop-blur-md p-1.5">
              {navItems.map((item) => renderNavLink(item.to, item.label, item.to === "/"))}
            </div>
          </div>

          {/* === System User Panel Actions (Desktop) === */}
          <div className="hidden md:flex items-center justify-end gap-4 shrink-0">
            {user ? (
              <>
                <Link to="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-brand-midnight/50 px-4 py-2 text-sm font-medium text-neutral-premiumText hover:border-brand-accent/40 hover:bg-brand-accent/[0.02] transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                    Dashboard
                  </motion.button>
                </Link>

                {isAdmin ? (
                  <Link to="/admin">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-sm font-medium text-neutral-secondaryText hover:text-neutral-premiumText transition-colors"
                    >
                      Admin Control
                    </motion.button>
                  </Link>
                ) : (loading || roleLoading) ? (
                  <div className="text-xs text-neutral-secondaryText animate-pulse font-medium">Authenticating...</div>
                ) : null}

                <ProfileDropdown user={user} isAdmin={isAdmin} onLogout={handleLogout} />
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="text-sm font-medium text-neutral-secondaryText hover:text-neutral-premiumText transition-colors px-4 py-2">
                    Sign In
                  </button>
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-xl bg-brand-accent px-5 py-2.5 text-sm font-semibold text-brand-cosmos shadow-[0_4px_20px_rgba(0,163,255,0.25)] hover:shadow-[0_4px_24px_rgba(0,163,255,0.4)] transition-all"
                  >
                    Join Portal
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* === Compact Mobile Actions === */}
          <div className="md:hidden flex items-center gap-3">
            {user ? (
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                <button className="text-xs font-medium px-3.5 py-1.5 rounded-lg border border-brand-accent/30 bg-brand-accentGlow text-brand-accent">
                  Dashboard
                </button>
              </Link>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <button className="text-xs font-medium px-3.5 py-1.5 rounded-lg border border-white/[0.08] text-neutral-premiumText">
                  Login
                </button>
              </Link>
            )}

            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="h-9 w-9 rounded-lg border border-white/[0.08] bg-brand-midnight flex items-center justify-center"
              aria-label="Toggle Menu"
            >
              <div className="space-y-1.5 w-4">
                <span className={`block h-0.5 w-4 bg-neutral-premiumText transition-transform duration-300 ${mobileOpen ? "rotate-45 translate-y-1" : ""}`} />
                <span className={`block h-0.5 w-4 bg-neutral-premiumText transition-transform duration-300 ${mobileOpen ? "-rotate-45 -translate-y-1" : ""}`} />
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