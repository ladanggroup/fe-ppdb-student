import { Link, NavLink } from "react-router";

export default function Navbar() {

  return (
    <>
      <header className="w-full bg-white dark:bg-gray-900 shadow fixed top-0 left-0 z-50">
        {/* === Desktop Navbar === */}
        <div className="md:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-ppdb-orange">
            <img
              src="/src/assets/logo ppdb.png"
              className="h-12 rounded-full"
              alt="PPDB Online"
            />
          </Link>
        </div>
      </header>

      {/* Spacer agar konten tidak tertutup navbar fixed */}
      <div className="h-16 md:h-16" />
    </>
  );
}
