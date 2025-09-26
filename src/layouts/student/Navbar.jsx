import { NavLink, Link, useNavigate } from "react-router";
import useAuthStore from "@/store/authStore";
import { Dropdown } from "../../components/ui/dropDown";
import { NotificationDropdown } from "@/components/NotificationDropdown";

export default function Navbar() {
  const { logoutStudent } = useAuthStore();
  const navigate = useNavigate();
  const { user } = useAuthStore((state) => state);
  const menuItems = [
    {
      name: "Home",
      href: "/student/dashboard",
    },
    {
      name: "Pendaftaran",
      href: "/student/complete-registration",
    },
    {
      name: "Harga Pendaftaran",
      href: "/student/harga-pendaftaran",
    },
  ];
  const siswaNotifikasi = [
    {
      id: 1,
      title: "Jadwal Tes Sudah Tersedia",
      time: "1 jam lalu",
      unread: true,
    },
    {
      id: 2,
      title: "Bukti Pembayaran Diverifikasi",
      time: "kemarin",
      unread: false,
    },
  ];
  return (
    <header className="bg-white dark:bg-gray-700 shadow top-100 z-10">
      <div className="px-4 sm:px-6 lg:px-8 flex items-center h-16">
        <Link
          to="/"
          className="text-xl font-bold text-ppdb-orange dark:text-gray-200"
        >
          PPDB Online
        </Link>
        <nav className="hidden md:flex space-x-8 items-center justify-center flex-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `font-medium px-2 py-1 rounded ${
                  isActive
                    ? "text-orange-soft-700"
                    : "text-gray-700 dark:text-gray-200 hover:text-orange-soft-700"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {/* {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-gray-700 dark:text-gray-200 hover:text-orange-soft-700 font-medium"
            >
              {item.name}
            </Link>
          ))} */}
        </nav>
        <div className="flex items-center">
          <NotificationDropdown
            notifications={siswaNotifikasi}
            onClickNotification={(notif) => {
              alert(`Buka notifikasi: ${notif.title}`);
            }}
            onClickViewAll={() => {
              // Navigasi ke halaman /sekolah/notifikasi
            }}
            className="ml-4 mr-4"
            theme={{
              bg: "bg-orange-soft-100",
              text: "text-orange-900",
              secondaryText: "text-orange-500",
              hover: "hover:bg-orange-100",
              border: "border-orange-200",
              badge: "bg-red-600",
            }}
          />
          <Dropdown
            theme={{
              bg: "bg-orange-soft-100 dark:bg-[#1f2d3a]",
              text: "text-orange-900 dark:text-gray-200",
              border: "border-orange-200 dark:border-gray-700",
              hover: "hover:bg-orange-100 dark:hover:bg-gray-700",
              label: "text-orange-500 dark:text-gray-200",
              shortcut: "text-orange-400 dark:text-gray-200",
              shadow: "shadow-xl",
            }}
            trigger={
              <button className="flex items-center space-x-2 text-gray-700 hover:text-orange-soft-700 dark:text-gray-200 font-medium">
                <img
                  className="w-6 h-6 rounded-full"
                  src={user?.avatar}
                  alt=""
                />
                <span className="">{user?.name}</span>
              </button>
            }
            items={[
              {
                label: "Hasil Seleksi",
                onClick: () => alert("Buka Hasil Seleksi"),
              },
              {
                label: "Pengaturan",
                onClick: () => alert("Buka Pengaturan"),
              },
              {
                label: "Keluar",
                onSelect: () => {
                  logoutStudent();
                  navigate("/");
                },
              },
            ]}
          />
        </div>
      </div>
    </header>
  );
}
