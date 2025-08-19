import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">PPDB Online</h4>
          <p className="text-gray-600 text-sm">
            Turut Membangun Pendidikan untuk Indonesia
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Kontak</h4>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>
              <Link to="/kontak" className="hover:text-gray-900">
                Hubungi Kami
              </Link>
            </li>
            <li>
              <Link to="/berlangganan" className="hover:text-gray-900">
                Berlangganan
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Bantuan</h4>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>
              <Link to="/bantuan" className="hover:text-gray-900">
                Situs Bantuan
              </Link>
            </li>
            <li>
              <Link to="/tanya-jawab" className="hover:text-gray-900">
                Tanya Jawab
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Login Aplikasi</h4>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>
              <Link to="/admin" className="hover:text-gray-900">
                Admin Dinas
              </Link>
            </li>
            <li>
              <Link to="/sekolah" className="hover:text-gray-900">
                Admin Sekolah
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-gray-50 py-4">
        <p className="text-center text-gray-500 text-xs">
          © 2025 SIAP PPDB Online. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
