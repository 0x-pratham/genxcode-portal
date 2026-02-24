import { Suspense, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrowserRouter as Router, Routes, useLocation } from "react-router-dom";

import ErrorBoundary from "./components/shared/ErrorBoundary";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import GlobalLoader from "./components/shared/GlobalLoader";
import PublicRoutes from "./routes/PublicRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { AuthProvider } from "./context/AuthContext";
import RouteProgress from "./components/shared/RouteProgress";

function AnimatedRoutes() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <RouteProgress isLoading={isLoading} />

      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{
          duration: 0.35,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <Suspense fallback={<GlobalLoader />}>
          <Routes location={location}>
            {PublicRoutes()}
            {ProtectedRoutes()}
            {AdminRoutes()}
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

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