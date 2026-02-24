import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GlobalLoader from "./shared/GlobalLoader";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <GlobalLoader />;

  if (!user) return <Navigate to="/login" />;

  return children;
}