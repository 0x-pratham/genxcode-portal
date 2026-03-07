import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GlobalLoader from "../components/shared/GlobalLoader";

/**
 * Route-guard wrapper for admin-only routes.
 * Used in `App.jsx` as: <Route element={<AdminRoute />}> ... </Route>
 */
export default function AdminRoute() {
  const { user, isAdmin, loading, roleLoading } = useAuth();

  if (loading || roleLoading) return <GlobalLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}