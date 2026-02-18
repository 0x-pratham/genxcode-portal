// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// layout
import Navbar from "./components/Navbar";
import BackgroundOrbs from "./components/BackgroundOrbs";

// pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Apply from "./pages/Apply";
import ApplySuccess from "./pages/ApplySuccess";
import Announcements from "./pages/Announcements";
import Leaderboard from "./pages/Leaderboard";
import Challenges from "./pages/Challenges";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import AdminRoute from "./components/AdminRoute";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      {/* outer wrapper that holds BG + content */}
      <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
        {/* 🔥 global animated background behind everything */}
        <BackgroundOrbs />

        {/* nav + routes on top of background */}
        <div className="relative z-10">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/apply" element={<Apply />} />
            <Route path="/apply/success" element={<ApplySuccess />} />

            <Route path="/announcements" element={<Announcements />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/challenges" element={<Challenges />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminRoute><AdminPanel/></AdminRoute>} />
            <Route path="/profile" element={<Profile />} />

            {/* fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
