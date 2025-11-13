import { useState, useEffect, useMemo } from "react";
import { NavLink, Link, useNavigate, useLocation, useParams } from "react-router";
import {
  Menu,
  X,
  Settings,
  LogOut,
  Home,
  FileText,
  Wallet,
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import { Dropdown } from "@/components/ui/dropDown";
import { NotificationDropdown } from "@/components/NotificationDropdown";

export default function Navbar() {
  const { slug: paramSlug } = useParams();
  const { logoutStudent, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoggedIn = !!user;
  const slug = paramSlug || localStorage.getItem("slug");

  // useMemo selalu update saat slug/user berubah
  const schoolStudentStatus = useMemo(() => {
    if (!user?.school_students?.length || !slug) return null;
    return user.school_students.find((ss) => ss.school?.slug === slug)
      ?.selection_status;
  }, [user, slug]);

  // ketika berpindah halaman (memastikan re-render menu)
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Menu utama
  let menuItems = isLoggedIn
    ? [
        { name: "Home", href: `/${slug}`, icon: <Home size={16} /> },
        {
          name: "Pendaftaran",
          href: `/student/${slug}/complete-registration`,
          icon: <FileText size={16} />,
        },
        {
          name: "Hasil Seleksi",
          href: "/student/selection",
          icon: <Wallet size={16} />,
        },
      ]
    : [
        { name: "Home", href: `/${slug}`, icon: <Home size={16} /> },
        {
          name: "Pendaftaran",
          href: `/student/${slug}/login`,
          icon: <FileText size={16} />,
        },
        {
          name: "Hasil Seleksi",
          href: `/${slug}/announcement`,
          icon: <Wallet size={16} />,
        },
      ];

  // Sembunyikan menu “Pendaftaran” bila siswa lulus seleksi
  if (schoolStudentStatus === "passed_selection") {
    menuItems = menuItems.filter((item) => item.name !== "Pendaftaran");
  }

  const mobileMenuItems = isLoggedIn
    ? [
        ...menuItems,
        {
          name: "Pengaturan",
          href: "/student/profile",
          icon: <Settings size={16} />,
        },
      ]
    : menuItems;

  const siswaNotifikasi = [
    { id: 1, title: "Jadwal Tes Sudah Tersedia", time: "1 jam lalu", unread: true },
    { id: 2, title: "Bukti Pembayaran Diverifikasi", time: "kemarin", unread: false },
  ];

  return (
    <header className="bg-white dark:bg-gray-700 shadow z-20 sticky top-0">
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* === Logo === */}
        <Link to="/" className="text-xl font-bold text-orange-600 dark:text-orange-300">
          <img src="/src/assets/logo ppdb.png" className="h-12 rounded-full" alt="PPDB Online" />
        </Link>

        {/* === Desktop Menu === */}
        <nav className="hidden md:flex space-x-8 items-center justify-center flex-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={
                isLoggedIn
                  ? item.href
                  : item.name === "Pendaftaran"
                  ? `/student/${slug}/login`
                  : item.href
              }
              end
              onClick={() => {
                if (!isLoggedIn && item.name === "Pendaftaran") {
                  navigate(`/student/${slug}/login`);
                }
              }}
              className={({ isActive }) =>
                `font-medium px-2 py-1 rounded transition-colors ${
                  isActive
                    ? "text-[#3897F0]"
                    : "text-gray-700 dark:text-gray-200 hover:text-[#3897F0]"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* === Right Section (Notif + Avatar + Mobile Button) === */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <NotificationDropdown
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
              />

              <Dropdown
                theme={{
                  bg: "bg-orange-50 dark:bg-[#1f2d3a]",
                  text: "text-gray-900 dark:text-gray-200",
                  border: "border-orange-200 dark:border-gray-700",
                  hover: "hover:bg-orange-100 dark:hover:bg-gray-700",
                  label: "text-orange-500",
                  shadow: "shadow-lg",
                }}
                trigger={
                  <button className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-[#3897F0] dark:text-gray-200 font-medium cursor-pointer">
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
                      localStorage.removeItem("slug");
                      navigate(`/${slug}`);
                    },
                  },
                ]}
              />
            </>
          ) : (
            <Link
              to={`/student/${slug}/login`}
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-[#3897F0] border border-[#3897F0] px-4 py-2 rounded-md"
            >
              Masuk
            </Link>
          )}

          {/* === Mobile Button === */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* === Mobile Menu === */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen
            ? "max-h-[500px] border-t border-orange-200 dark:border-gray-600"
            : "max-h-0"
        }`}
      >
        <nav className="flex flex-col bg-orange-50 dark:bg-gray-800 p-4 space-y-2">
          {isLoggedIn && (
            <div className="flex items-center space-x-3 border-b border-orange-200 dark:border-gray-700 pb-3 mb-2">
              <img
                src={
                  user?.image ||
                  "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                }
                alt="avatar"
                className="w-10 h-10 rounded-full border"
              />
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {user?.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>
          )}

          {mobileMenuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded font-medium ${
                  isActive
                    ? "bg-orange-100 text-orange-700 dark:bg-gray-700"
                    : "text-gray-700 dark:text-gray-200 hover:bg-orange-100 dark:hover:bg-gray-700"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}

          {isLoggedIn && (
            <button
              onClick={() => {
                logoutStudent();
                localStorage.removeItem("slug");
                navigate(`/${slug}`);
              }}
              className="flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded px-3 py-2"
            >
              <LogOut size={16} />
              Keluar
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
