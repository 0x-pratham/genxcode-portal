import { supabase } from "@/supabaseClient";

const AdminTopbar = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-[#0b1120] border-b border-gray-800">
      <h1 className="text-lg font-semibold">Admin Panel</h1>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition"
      >
        Logout
      </button>
    </header>
  );
};

export default AdminTopbar;
