import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const ProfileDropdown = ({ user, isAdmin, onLogout }) => {
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);

  const email = user?.email || "";
  const userMeta = user?.user_metadata || {};

  const initials =
    userMeta.full_name?.[0]?.toUpperCase() ||
    email?.[0]?.toUpperCase() ||
    "G";

  // ✅ Outside click + ESC close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-full border border-slate-700/60 bg-slate-950/50 backdrop-blur-xl px-3 py-2 shadow-lg shadow-slate-900/40 hover:border-cyan-400/50 transition-all"
      >
        <div className="relative h-9 w-9 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center text-xs font-semibold text-slate-950">
          {initials}
        </div>

        <div className="hidden lg:flex flex-col text-left">
          <span className="text-xs md:text-sm text-slate-200 max-w-[120px] truncate">
            {userMeta.full_name || email?.split("@")[0]}
          </span>
          <span className="text-[10px] text-cyan-300">
            {isAdmin ? "Admin" : "Member"}
          </span>
        </div>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          className="text-slate-400 text-xs"
        >
          ▼
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-800 bg-slate-950/95 backdrop-blur-2xl shadow-2xl shadow-slate-950/70 overflow-hidden z-50"
          >
            <div className="flex flex-col py-2 text-sm">
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="px-4 py-2 hover:bg-slate-900 transition-colors text-slate-200"
              >
                Profile
              </Link>

              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="px-4 py-2 hover:bg-slate-900 transition-colors text-slate-200"
              >
                Dashboard
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 hover:bg-slate-900 transition-colors text-fuchsia-300"
                >
                  Admin Panel
                </Link>
              )}

              <div className="border-t border-slate-800 my-2" />

              <button
                onClick={() => {
                  setOpen(false);
                  onLogout();
                }}
                className="text-left px-4 py-2 hover:bg-slate-900 text-rose-300 transition-colors"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;