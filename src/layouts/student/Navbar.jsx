import { Link, useNavigate } from "react-router";
import useAuthStore from "@/store/authStore";
import { Dropdown } from "../../components/ui/dropDown";
import { NotificationDropdown } from "@/components/NotificationDropdown";

export default function Navbar() {
  const { logoutStudent } = useAuthStore();
  const navigate = useNavigate();
  // const { user } = useAuthStore((state) => state);
  const menuItems = ["Home", "Pendaftaran", "Harga Pendaftaran"];
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
    <header className="bg-orange-soft-300 shadow sticky top-100 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-gray-800">
          PPDB Online
        </Link>
        <nav className="hidden md:flex space-x-8 items-center">
          {menuItems.map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="text-gray-700 hover:text-orange-soft-700 font-medium"
            >
              {item}
            </Link>
          ))}
          <NotificationDropdown
            notifications={siswaNotifikasi}
            onClickNotification={(notif) => {
              alert(`Buka notifikasi: ${notif.title}`);
            }}
            onClickViewAll={() => {
              // Navigasi ke halaman /sekolah/notifikasi
            }}
            className="ml-4"
            theme={{
              bg: "bg-orange-50",
              text: "text-orange-900",
              secondaryText: "text-orange-500",
              hover: "hover:bg-orange-100",
              border: "border-orange-200",
              badge: "bg-red-600",
            }}
          />
          <Dropdown
            theme={{
              bg: "bg-orange-soft-100",
              text: "text-orange-900",
              border: "border-orange-200",
              hover: "hover:bg-orange-100",
              label: "text-orange-500",
              shortcut: "text-orange-400",
              shadow: "shadow-xl",
            }}
            trigger={
              <button className="text-gray-700 hover:text-orange-soft-700 font-medium">
                Akun
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
        </nav>
      </div>
    </header>
  );
}
