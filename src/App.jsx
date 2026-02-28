import { Suspense, useState, useEffect, lazy } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Outlet,
  Navigate,
} from "react-router-dom";

import ErrorBoundary from "./components/shared/ErrorBoundary";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import GlobalLoader from "./components/shared/GlobalLoader";
import RouteProgress from "./components/shared/RouteProgress";
import AdminRoute from "./components/AdminRoute";

/* ===========================
   🔹 Lazy Loaded Pages
=========================== */

// Public
const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Apply = lazy(() => import("./pages/Apply"));
const ApplySuccess = lazy(() => import("./pages/ApplySuccess"));
const Announcements = lazy(() => import("./pages/Announcements"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Challenges = lazy(() => import("./pages/Challenges"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Contact = lazy(() => import("./pages/Contact"));
const RecruitmentClosed = lazy(() => import("./pages/RecruitmentClosed"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Protected
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));

// Admin
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

/* ===========================
   🔐 Auth Route Protection
=========================== */

function AuthRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

/* ===========================
   🔹 Animated Routes
=========================== */

function AnimatedRoutes() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 350);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <>
      <RouteProgress isLoading={isLoading} />

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{
            duration: 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <Suspense fallback={<GlobalLoader />}>
            <Routes location={location}>
              {/* ================= PUBLIC ================= */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/apply/success" element={<ApplySuccess />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/recruitment" element={<RecruitmentClosed />} />

              {/* ================= PROTECTED ================= */}
              <Route element={<AuthRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* ================= ADMIN ================= */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPanel />} />
              </Route>

              {/* ================= 404 ================= */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

/* ===========================
   🔹 App Root
=========================== */

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <AnimatedRoutes />
          </ToastProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;