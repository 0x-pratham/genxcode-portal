import { motion, AnimatePresence } from "framer-motion";
import { NavLink, Link } from "react-router-dom";

const MobileMenu = ({
  mobileOpen,
  setMobileOpen,
  user,
  isAdmin,
  handleLogout,
  navItems,
  location,
}) => {
  const email = user?.email || "";
  const userMeta = user?.user_metadata || {};

  const initials =
    userMeta.full_name?.[0]?.toUpperCase() ||
    email?.[0]?.toUpperCase() ||
    "G";

  return (
    <AnimatePresence>
      {mobileOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />

          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed top-[72px] left-0 right-0 z-50 md:hidden bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800 shadow-2xl shadow-black/40"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
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
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
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
                      className="text-[11px] text-slate-400 hover:text-rose-300"
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

                    {isAdmin && (
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

              <p className="text-[10px] text-slate-500 pt-1">
                You are on:{" "}
                <span className="font-mono text-cyan-300">
                  {location.pathname || "/"}
                </span>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;