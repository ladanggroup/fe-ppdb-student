// Layout.jsx
import { Dropdown } from "@/components/ui/dropdown";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import useAuthStore from "@/store/authStore";
import {
  House,
  Wrench,
  Waves,
  Users2,
  Landmark,
  Menu,
  Package,
  UserRoundPlus,
  BookOpen,
} from "lucide-react";
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
          <NavLink
            to="/school/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-white/10 rounded px-3 py-2 ${
                isActive ? "bg-blue-200 dark:bg-white/10" : ""
              }`
            }
          >
            <House className="w-5 h-5" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/school/bank"
            className={({ isActive }) =>
              `flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-white/10 rounded px-3 py-2 ${
                isActive ? "bg-blue-200 dark:bg-white/10" : ""
              }`
            }
          >
            <Landmark className="w-5 h-5" />
            <span>Bank</span>
          </NavLink>
          <NavLink
            to="/school/document-requirement"
            className={({ isActive }) =>
              `flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-white/10 rounded px-3 py-2 ${
                isActive ? "bg-blue-200 dark:bg-white/10" : ""
              }`
            }
          >
            <BookOpen className="w-5 h-5" />
            <span>Permintaan Dokumen</span>
          </NavLink>
          <NavLink
            to="/school/wave"
            className={({ isActive }) =>
              `flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-white/10 rounded px-2.5 py-2 ${
                isActive ? "bg-blue-200 dark:bg-white/10" : ""
              }`
            }
          >
            <Waves className="w-5 h-5" />
            <span>Gelombang Pendaftaran</span>
          </NavLink>
          <NavLink
            to="/school/subscription"
            className={({ isActive }) =>
              `flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-white/10 rounded px-3 py-2 ${
                isActive ? "bg-blue-200 dark:bg-white/10" : ""
              }`
            }
          >
            <Package className="w-5 h-5" />
            <span>Langganan</span>
          </NavLink>
          <NavLink
            to="/school/student"
            className={({ isActive }) =>
              `flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-white/10 rounded px-3 py-2 ${
                isActive ? "bg-blue-200 dark:bg-white/10" : ""
              }`
            }
          >
            <Users2 className="w-5 h-5" />
            <span>Daftar Siswa</span>
          </NavLink>
          {user.roles === "principal" && (
            <NavLink
              to="/school/user"
              className={({ isActive }) =>
                `flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-white/10 rounded px-3 py-2 ${
                  isActive ? "bg-blue-200 dark:bg-white/10" : ""
                }`
              }
            >
              <UserRoundPlus className="w-5 h-5" />
              <span>Pengguna</span>
            </NavLink>
          )}
          <NavLink
            to="/school/setting"
            className={({ isActive }) =>
              `flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-white/10 rounded px-3 py-2 ${
                isActive ? "bg-blue-200 dark:bg-white/10" : ""
              }`
            }
          >
            <Wrench className="w-5 h-5" />
            <span>Pengaturan</span>
          </NavLink>
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
            <NavLink
              to="/school/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-white/10 rounded px-3 py-2 ${
                  isActive ? "bg-blue-200 dark:bg-white/10" : ""
                }`
              }
            >
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/school/bank"
              className={({ isActive }) =>
                `flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-white/10 rounded px-3 py-2 ${
                  isActive ? "bg-blue-200 dark:bg-white/10" : ""
                }`
              }
            >
              <span>Bank</span>
            </NavLink>
            <NavLink
              to="/school/document-requirement"
              className={({ isActive }) =>
                `flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-white/10 rounded px-3 py-2 ${
                  isActive ? "bg-blue-200 dark:bg-white/10" : ""
                }`
              }
            >
              <span>Permintaan Dokumen</span>
            </NavLink>
            <NavLink
              to="/school/wave"
              className={({ isActive }) =>
                `flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-white/10 rounded px-3 py-2 ${
                  isActive ? "bg-blue-200 dark:bg-white/10" : ""
                }`
              }
            >
              <span>Gelombang Pendaftaran</span>
            </NavLink>
            <NavLink
              to="/school/subscription"
              className={({ isActive }) =>
                `flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-white/10 rounded px-3 py-2 ${
                  isActive ? "bg-blue-200 dark:bg-white/10" : ""
                }`
              }
            >
              <span>Langganan</span>
            </NavLink>
            <NavLink
              to="/school/student"
              className={({ isActive }) =>
                `flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-white/10 rounded px-3 py-2 ${
                  isActive ? "bg-blue-200 dark:bg-white/10" : ""
                }`
              }
            >
              <span>Daftar Siswa</span>
            </NavLink>
            {user.roles === "principal" && (
              <NavLink
                to="/school/user"
                className={({ isActive }) =>
                  `flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-white/10 rounded px-3 py-2 ${
                    isActive ? "bg-blue-200 dark:bg-white/10" : ""
                  }`
                }
              >
                <span>Pengguna</span>
              </NavLink>
            )}
            <NavLink
              to="/school/setting"
              className={({ isActive }) =>
                `flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-white/10 rounded px-3 py-2 ${
                  isActive ? "bg-blue-200 dark:bg-white/10" : ""
                }`
              }
            >
              <span>Settings</span>
            </NavLink>
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
              onClickViewAll={() => {}}
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
                    src={user?.school?.logo_url || "/src/assets/Group 1078.png"}
                    alt="Avatar"
                    className="w-9 h-9 object-cover"
                  />
                </button>
              }
              items={[
                {
                  label: "Dashboard",
                  onSelect: () => navigate("/school/dashboard"),
                },
                {
                  label: "Profile",
                  onSelect: () => navigate("/school/user/" + user.id + "/edit"),
                },
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
