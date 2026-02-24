import { Route } from "react-router-dom";
import { lazy } from "react";

// Lazy loaded protected pages
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));

export default function ProtectedRoutes() {
  return (
    <>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
    </>
  );
}