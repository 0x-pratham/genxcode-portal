import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-[#030712] text-white">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminTopbar />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#0f172a]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
