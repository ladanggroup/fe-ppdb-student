// Layout.jsx
import { Dropdown } from "@/components/ui/dropdown";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import useAuthStore from "@/store/authStore";
import { House, Wrench, Bell } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { NotificationDropdown } from "@/components/NotificationDropdown";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logoutSchool } = useAuthStore();
  const { user } = useAuthStore((state) => state);
  const sekolahNotifikasi = [
    {
      id: 1,
      title: "Ada 5 pendaftar baru",
      time: "10 menit lalu",
      unread: true,
    },
    { id: 2, title: "Rekap harian tersedia", time: "hari ini", unread: false },
  ];
  return (
    <div className="flex min-h-screen w-full bg-blue-50 text-slate-800 dark:bg-[#2c3e50] dark:text-white overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-blue-100 dark:bg-[#1f2d3a] p-4 border-r border-slate-300 dark:border-white/10">
        <div className="text-xl font-bold mb-8">Sekolah</div>
        <nav className="flex flex-col gap-2">
          <Link
            to="/school/dashboard"
            className="flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-white/10 rounded px-3 py-2"
          >
            <House className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/school/setting"
            className="flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-white/10 rounded px-3 py-2"
          >
            <Wrench className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Sidebar Mobile Toggle */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu />
        </button>
      </div>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-blue-100 dark:bg-[#1f2d3a] p-4 border-r border-slate-300 dark:border-white/10 md:hidden">
          <div className="text-xl font-bold mb-8">Sekolah</div>
          <nav className="flex flex-col gap-2">
            <Link
              to="/school/dashboard"
              className="hover:bg-blue-200 dark:hover:bg-white/10 rounded px-3 py-2"
              onClick={() => setSidebarOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/school/settings"
              className="hover:bg-blue-200 dark:hover:bg-white/10 rounded px-3 py-2"
              onClick={() => setSidebarOpen(false)}
            >
              Settings
            </Link>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 flex items-center justify-between px-4 border-b border-slate-300 dark:border-white/10 bg-blue-100 dark:bg-[#2c3e50]">
          <div className="text-lg font-semibold hidden md:block">Dashboard</div>

          <div className="flex items-center gap-4">
            <ModeToggle />
            <NotificationDropdown
              notifications={sekolahNotifikasi}
              onClickNotification={(notif) => {
                alert(`Buka notifikasi: ${notif.title}`);
              }}
              onClickViewAll={() => {
                // Navigasi ke halaman /sekolah/notifikasi
              }}
              className="ml-4"
            />
            <Dropdown
              header={
                <>
                  <p className="text-sm font-semibold">
                    {user?.name?.split(" ").slice(0, 2).join(" ")}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {user?.email}
                  </p>
                </>
              }
              trigger={
                <button className="rounded-full overflow-hidden border border-slate-400 dark:border-white">
                  <img
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    alt="Avatar"
                    className="w-8 h-8 object-cover"
                  />
                </button>
              }
              items={[
                {
                  label: "Dashboard",
                  onSelect: () => navigate("/school/dashboard"),
                },
                {
                  label: "Settings",
                  onSelect: () => navigate("/school/setting"),
                },
                { separator: true },
                {
                  label: "Sign out",
                  onSelect: () => {
                    logoutSchool();
                    navigate("/");
                  },
                },
              ]}
            />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
