import { Route } from "react-router-dom";
import { lazy } from "react";

// Lazy loaded pages
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const Apply = lazy(() => import("../pages/Apply"));
const ApplySuccess = lazy(() => import("../pages/ApplySuccess"));
const Announcements = lazy(() => import("../pages/Announcements"));
const Leaderboard = lazy(() => import("../pages/Leaderboard"));
const Challenges = lazy(() => import("../pages/Challenges"));
const Privacy = lazy(() => import("../pages/Privacy"));
const Terms = lazy(() => import("../pages/Terms"));
const Contact = lazy(() => import("../pages/Contact"));
const RecruitmentClosed = lazy(() => import("../pages/RecruitmentClosed"));
const NotFound = lazy(() => import("../pages/NotFound"));

export default function PublicRoutes() {
  return (
    <>
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
      <Route path="*" element={<NotFound />} />
    </>
  );
}