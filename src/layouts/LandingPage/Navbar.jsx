import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import PortalDialog from "@/components/PortalDialog";
import { Link, NavLink } from "react-router";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openPortal, setOpenPortal] = useState(false);
  const getNavClass = ({ isActive }) =>
    `font-medium transition px-3 py-2 rounded-md 
     ${
       isActive
         ? "text-orange-soft-700 dark:text-orange-400 font-semibold"
         : "text-gray-700 dark:text-gray-200 hover:text-orange-soft-700 dark:hover:text-orange-400"
     }`;

  return (
    <>
      <header className="w-full bg-white dark:bg-gray-900 shadow fixed top-0 left-0 z-50">
        {/* === Desktop Navbar === */}
        <div className="hidden md:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-ppdb-orange">
            {/* PPDB Online */}
            <img 
              src="/src/assets/logo ppdb.png"
              className="h-12 rounded-full"
              alt="PPDB Online" />
          </Link>
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

          {/* Portal Button for Desktop */}
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
              className={({ isActive }) =>
                `block w-full font-medium px-5 py-2 rounded-lg transition ${
                  isActive
                    ? "text-orange-soft-700"
                    : "text-gray-700 dark:text-gray-200 hover:text-orange-soft-700"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setOpenMenu(false)}
              className={({ isActive }) =>
                `block w-full font-medium px-5 py-2 rounded-lg transition ${
                  isActive
                    ? "text-orange-soft-700"
                    : "text-gray-700 dark:text-gray-200 hover:text-orange-soft-700"
                }`
              }
            >
              Tentang
            </NavLink>
            <NavLink
              to="/features"
              onClick={() => setOpenMenu(false)}
              className={({ isActive }) =>
                `block w-full font-medium px-5 py-2 rounded-lg transition ${
                  isActive
                    ? "text-orange-soft-700"
                    : "text-gray-700 dark:text-gray-200 hover:text-orange-soft-700"
                }`
              }
            >
              Fitur
            </NavLink>
            <NavLink
              to="/pricing"
              onClick={() => setOpenMenu(false)}
              className={({ isActive }) =>
                `block w-full font-medium px-5 py-2 rounded-lg transition ${
                  isActive
                    ? "text-orange-soft-700"
                    : "text-gray-700 dark:text-gray-200 hover:text-orange-soft-700 "
                }`
              }
            >
              Harga
            </NavLink>
            <NavLink
              to="/announcement"
              onClick={() => setOpenMenu(false)}
              className={({ isActive }) =>
                `block w-full font-medium px-5 py-2 rounded-lg transition ${
                  isActive
                    ? "text-orange-soft-700"
                    : "text-gray-700 dark:text-gray-200 hover:text-orange-soft-700 "
                }`
              }
            >
              Pengumuman
            </NavLink>
            <button
              onClick={() => {
                setOpenPortal(true);
                setOpenMenu(false);
              }}
              className="w-full text-gray-800 dark:text-white px-5 py-2 rounded-lg hover:bg-orange-soft-700 transition"
            >
              Masuk/Daftar
            </button>
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
