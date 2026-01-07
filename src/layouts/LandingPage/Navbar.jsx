import {
  Menu,
  X,
  Settings,
  LogOut,
  Home,
  FileText,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router";
import useAuthStore from "@/store/authStore";
import { Dropdown } from "@/components/ui/dropDown";

export default function Navbar() {
  const { logoutStudent, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoggedIn = !!user;

  // ketika berpindah halaman (memastikan re-render menu)
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="h-16 md:h-16">
      <header className="bg-white shadow z-20 sticky top-0">
        {/* === Desktop Navbar === */}
        <div className="flex mx-auto px-4 sm:px-6 lg:px-8 py-2 items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-ppdb-orange">
            <img
              src="/src/assets/logo ppdb.png"
              className="h-12 rounded-full"
              alt="PPDB Online"
            />
          </Link>
          {/* === Right Section (Notif + Avatar + Mobile Button) === */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                {/* <NotificationDropdown
                notifications={siswaNotifikasi}
                onClickNotification={(notif) =>
                  alert(`Buka notifikasi: ${notif.title}`)
                }
                onClickViewAll={() => navigate("/student/notifications")}
                className="mr-2"
                theme={{
                  bg: "bg-orange-50 dark:bg-gray-800",
                  text: "text-gray-900 dark:text-gray-200",
                  hover: "hover:bg-orange-100 dark:hover:bg-gray-600",
                  border: "border-orange-200 dark:border-gray-700",
                  badge: "bg-red-600",
                }}
              /> */}

                <Dropdown
                  theme={{
                    bg: "bg-orange-50",
                    text: "text-gray-900",
                    border: "border-orange-200",
                    hover: "hover:bg-orange-100",
                    label: "text-orange-500",
                    shadow: "shadow-lg",
                  }}
                  trigger={
                    <button className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-[#3897F0] font-medium cursor-pointer">
                      <img
                        className="w-9 h-9 rounded-full object-cover border"
                        src={
                          user?.image ||
                          "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                        }
                        alt="avatar"
                      />
                      <span>{user?.name}</span>
                    </button>
                  }
                  items={[
                    {
                      label: "Pengaturan",
                      onSelect: () => navigate("/student/profile"),
                    },
                    {
                      label: "Keluar",
                      onSelect: () => {
                        logoutStudent();
                        navigate(`/`);
                      },
                    },
                  ]}
                />
              </>
            ) : (
              <Link
                to={`/student/login`}
                className="text-sm font-medium text-gray-700 hover:text-[#3897F0] border border-[#3897F0] px-4 py-2 rounded-md"
              >
                Masuk
              </Link>
            )}

            {/* === Mobile Button === */}
            {isLoggedIn && (
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 "
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            )}
          </div>
        </div>

        {/* === Mobile Menu === */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            mobileOpen
              ? "max-h-[500px] border-t border-orange-200"
              : "max-h-0"
          }`}
        >
          <nav className="flex flex-col bg-orange-50 p-4 space-y-2">
            {isLoggedIn && (
              <div className="flex items-center space-x-3 border-b border-orange-200 pb-3 mb-2">
                <img
                  src={
                    user?.image ||
                    "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  }
                  alt="avatar"
                  className="w-10 h-10 rounded-full border"
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user?.email}
                  </p>
                </div>
              </div>
            )}

            <NavLink
              to="/"
              end
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded font-medium ${
                  isActive
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-700 hover:bg-orange-100"
                }`
              }
            >
              <Home size={16} />
              Home
            </NavLink>
            
            <NavLink
              to="/student/profile"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded font-medium ${
                  isActive
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-700 hover:bg-orange-100"
                }`
              }
            >
              <Settings size={16} />
              Pengaturan
            </NavLink>

            {isLoggedIn && (
              <button
                onClick={() => {
                  logoutStudent();
                  navigate(`/`);
                }}
                className="flex items-center gap-2 text-red-600 hover:bg-red-50 rounded px-3 py-2"
              >
                <LogOut size={16} />
                Keluar
              </button>
            )}
          </nav>
        </div>
      </header>
    </div>
  );
}
