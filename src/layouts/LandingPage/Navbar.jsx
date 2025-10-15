import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router";
import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import PortalDialog from "@/components/PortalDialog";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropDown";
import { LogOut, LayoutDashboard, User, AlertCircle } from "lucide-react";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openPortal, setOpenPortal] = useState(false);
  const {
    user,
    isAuthenticated,
    role,
    logoutSchool,
    logoutAdmin,
    restoreAuth,
  } = useAuthStore();

  useEffect(() => {
    async () => {
      await restoreAuth();
    };
  }, [restoreAuth]);

  const getNavClass = ({ isActive }) =>
    `font-medium transition px-3 py-2 rounded-md 
     ${
       isActive
         ? "text-orange-soft-700 dark:text-orange-400 font-semibold"
         : "text-gray-700 dark:text-gray-200 hover:text-orange-soft-700 dark:hover:text-orange-400"
     }`;

  const handleLogout = async () => {
    if (role === "admin") {
      await logoutAdmin();
    } else if (role === "school") {
      await logoutSchool();
    }
    window.location.href = "/";
  };

  const latestSubscription =
    role === "school"
      ? user?.school?.subscriptions?.[user.school.subscriptions.length - 1]
      : null;

  // 🔸 Dropdown items
  const dropdownItems = [
    role === "admin"
      ? {
          label: "Dashboard Admin",
          icon: <LayoutDashboard className="w-4 h-4" />,
          onSelect: () => (window.location.href = "/admin/dashboard"),
        }
      : role === "school"
      ? {
          label: "Dashboard Sekolah",
          icon: <LayoutDashboard className="w-4 h-4" />,
          onSelect: () => (window.location.href = "/school/dashboard"),
        }
      : null,
    latestSubscription &&
    ["expired", "verify", "rejected"].includes(latestSubscription.status)
      ? {
          label: "Langganan Expired",
          icon: <AlertCircle className="w-4 h-4 text-yellow-500" />,
          onSelect: () =>
            (window.location.href = "/school/subscription/expired"),
          className:
            "text-yellow-600 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-gray-700",
        }
      : null,
    { type: "separator" },
    {
      label: "Keluar",
      icon: <LogOut className="w-4 h-4 text-red-500" />,
      className: "text-red-500 hover:bg-red-500/10",
      onSelect: handleLogout,
    },
  ].filter(Boolean);

  return (
    <>
      <header className="w-full bg-white dark:bg-gray-900 shadow fixed top-0 left-0 z-50">
        {/* === Desktop Navbar === */}
        <div className="hidden md:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-ppdb-orange">
            <img
              src="/src/assets/logo ppdb.png"
              className="h-12 rounded-full"
              alt="PPDB Online"
            />
          </Link>

          {/* Menu Utama */}
          <div className="flex items-center justify-center space-x-8">
            <ul className="flex space-x-6">
              <li>
                <NavLink to="/" className={getNavClass}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={getNavClass}>
                  Tentang
                </NavLink>
              </li>
              <li>
                <NavLink to="/features" className={getNavClass}>
                  Fitur
                </NavLink>
              </li>
              <li>
                <NavLink to="/pricing" className={getNavClass}>
                  Harga
                </NavLink>
              </li>
              <li>
                <NavLink to="/announcement" className={getNavClass}>
                  Pengumuman
                </NavLink>
              </li>
            </ul>
          </div>

          {/* 🔸 Auth Section */}
          {isAuthenticated ? (
            <Dropdown
              trigger={
                <button className="flex items-center gap-2 bg-transparent hover:bg-orange-soft-100 dark:hover:bg-gray-800 text-gray-800 dark:text-white px-3 py-2 rounded-md transition">
                  <User className="w-5 h-5" />
                  <span>{user?.name?.split(" ").slice(0, 2).join(" ")}</span>
                </button>
              }
              items={dropdownItems}
              header={
                <span className="text-sm">
                  {user?.school?.name || user?.name}
                </span>
              }
              theme={{
                bg: "bg-white dark:bg-gray-800",
                text: "text-gray-800 dark:text-gray-100",
                hover: "hover:bg-gray-100 dark:hover:bg-gray-700",
                border: "border-gray-200 dark:border-gray-700",
                label: "text-gray-500 dark:text-gray-400",
                shadow: "shadow-lg",
              }}
            />
          ) : (
            <button
              onClick={() => setOpenPortal(true)}
              className="hidden md:inline-flex items-center text-black dark:text-white px-5 py-2 rounded-lg font-medium hover:bg-orange-soft-700 transition cursor-pointer"
            >
              Masuk/Daftar
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>

        {/* === Mobile Header === */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 w-full">
          <Link to="/" className="text-xl font-bold text-ppdb-orange">
            PPDB Online
          </Link>
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="p-2 text-gray-800 dark:text-white focus:outline-none"
          >
            {openMenu ? "✕" : "☰"}
          </button>
        </div>

        {/* === Mobile Menu === */}
        {openMenu && (
          <nav className="md:hidden w-full bg-orange-soft-200 dark:bg-gray-800 px-4 py-3 space-y-2 border-t border-orange-300 dark:border-gray-700">
            <NavLink
              to="/"
              onClick={() => setOpenMenu(false)}
              className={getNavClass}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setOpenMenu(false)}
              className={getNavClass}
            >
              Tentang
            </NavLink>
            <NavLink
              to="/features"
              onClick={() => setOpenMenu(false)}
              className={getNavClass}
            >
              Fitur
            </NavLink>
            <NavLink
              to="/pricing"
              onClick={() => setOpenMenu(false)}
              className={getNavClass}
            >
              Harga
            </NavLink>
            <NavLink
              to="/announcement"
              onClick={() => setOpenMenu(false)}
              className={getNavClass}
            >
              Pengumuman
            </NavLink>

            {isAuthenticated ? (
              <>
                <p className="text-gray-700 dark:text-gray-300 px-5">
                  Hai, <span className="font-semibold">{user?.name}</span>
                </p>
                <Button
                  onClick={handleLogout}
                  className="w-full text-red-600 font-medium px-5 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-gray-700 transition"
                >
                  Keluar
                </Button>
              </>
            ) : (
              <button
                onClick={() => {
                  setOpenPortal(true);
                  setOpenMenu(false);
                }}
                className="w-full text-gray-800 dark:text-white px-5 py-2 rounded-lg hover:bg-orange-soft-700 transition"
              >
                Masuk/Daftar
              </button>
            )}
          </nav>
        )}
      </header>

      {/* === Portal Dialog === */}
      <Dialog open={openPortal} onOpenChange={setOpenPortal}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-md p-0 bg-transparent border-none shadow-none">
          <DialogTitle className="hidden">Ke Portal PPDB</DialogTitle>
          <PortalDialog onClose={() => setOpenPortal(false)} />
        </DialogContent>
      </Dialog>

      {/* Spacer agar konten tidak tertutup navbar fixed */}
      <div className="h-16 md:h-16" />
    </>
  );
}
