import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const isAdmin = true; // replace with real logic
<Routes location={location}>
  {/* Public */}
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

  {/* Protected */}
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/profile" element={<Profile />} />

  {/* Admin Layout Route */}
  <Route element={<AdminRoute />}>
    <Route path="/admin" element={<AdminPanel />} />
  </Route>

  {/* 404 */}
  <Route path="*" element={<NotFound />} />
</Routes>

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}