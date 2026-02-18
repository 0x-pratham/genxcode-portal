import { Link, useLocation } from "react-router-dom";
import { Megaphone, Users, Code, BarChart3, Home } from "lucide-react";

const AdminSidebar = () => {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition 
     ${pathname === path ? "bg-[#1e293b] text-cyan-400" : "text-gray-300 hover:bg-[#1e293b]"}`;

  return (
    <aside className="w-64 h-full bg-[#0b1120] border-r border-gray-800 p-5">
      <h2 className="text-xl font-bold text-cyan-400 mb-6">GenXCode Admin</h2>

      <nav className="flex flex-col gap-2">
        <Link className={linkClass("/admin")} to="/admin">
          <Home size={18} /> Dashboard
        </Link>

        <Link className={linkClass("/admin/announcements")} to="/admin/announcements">
          <Megaphone size={18} /> Announcements
        </Link>

        <Link className={linkClass("/admin/applications")} to="/admin/applications">
          <Users size={18} /> Applications
        </Link>

        <Link className={linkClass("/admin/challenges")} to="/admin/challenges">
          <Code size={18} /> Coding Challenges
        </Link>

        <Link className={linkClass("/admin/leaderboard")} to="/admin/leaderboard">
          <BarChart3 size={18} /> Leaderboard
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
