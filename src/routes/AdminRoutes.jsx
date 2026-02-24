import { Route } from "react-router-dom";
import { lazy } from "react";
import AdminRoute from "../components/AdminRoute";

// Lazy loaded admin page
const AdminPanel = lazy(() => import("../pages/AdminPanel"));

export default function AdminRoutes() {
  return (
    <>
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        }
      />
    </>
  );
}