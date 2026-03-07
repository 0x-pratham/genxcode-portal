import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GlobalLoader from "../components/shared/GlobalLoader";

export default function AdminRoute() {
  const { user, isAdmin, loading, roleLoading } = useAuth();

  if (loading || roleLoading) {
    return <GlobalLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}