import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import PortalDialog from "@/components/PortalDialog";
import { Link } from "react-router";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openPortal, setOpenPortal] = useState(false);
  const menuItems = ["Home", "Tentang", "Fitur", "Harga", "Pengumuman"];

  return (
    <>
      <header className="bg-white shadow top-100 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-ppdb-orange">
            PPDB Online
          </Link>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-gray-700 hover:text-orange-soft-700 font-medium">Home</Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-700 hover:text-orange-soft-700 font-medium">Tentang</Link>
            </li>
            <li>
              <Link to="/features" className="text-gray-700 hover:text-orange-soft-700 font-medium">Fitur</Link>
            </li>
            <li>
              <Link to="/pricing" className="text-gray-700 hover:text-orange-soft-700 font-medium">Harga</Link>
            </li>
            <li>
              <Link to="/announcement" className="text-gray-700 hover:text-orange-soft-700 font-medium">Pengumuman</Link>
            </li>
          </ul>
          {/* <nav className="hidden md:flex space-x-8">
            {menuItems.map(item => (
              <Link
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className="text-gray-700 hover:text-orange-soft-700 font-medium"
              >{item}</Link>
            ))}
          </nav> */}

          {/* Portal Button for Desktop */}
          <button
            onClick={() => setOpenPortal(true)}
            className="hidden md:inline-flex items-center text-black px-5 py-2 rounded-lg font-medium hover:bg-orange-soft-700 transition"
          >
            Ke Portal PPDB
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

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="md:hidden p-2 text-gray-800 focus:outline-none"
          >
            {openMenu ? "✕" : "☰"}
          </button>
        </div>
        {/* Mobile Navigation */}
        {openMenu && (
          <nav className="md:hidden bg-orange-soft-200 px-4 py-3 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="block text-gray-700 hover:text-orange-soft-700 font-medium"
              >
                {item}
              </Link>
            ))}
            <button
              onClick={() => {
                setOpenPortal(true);
                setOpenMenu(false);
              }}
              className="w-full text-gray-800 px-5 py-2 rounded-lg hover:bg-orange-soft-700 transition"
            >
              Ke Portal PPDB
            </button>
          </nav>
        )}
      </header>

      {/* Portal Login Dialog */}
      <Dialog open={openPortal} onOpenChange={setOpenPortal}>
        <DialogTrigger asChild>
          {/* hidden trigger; we open via state */}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md p-0 bg-transparent border-none shadow-none">
          <DialogTitle className="hidden">Ke Portal PPDB</DialogTitle>
          <PortalDialog onClose={() => setOpenPortal(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
