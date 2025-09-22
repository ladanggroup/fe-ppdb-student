import { Instagram } from "lucide-react";
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8 mt-12">
      <div className="container mx-auto px-6 grid md:grid-cols-4 gap-6 text-sm">
        <div>
          <h3 className="font-bold text-orange-500">PPDB Online</h3>
          <p>PPDB Online, Turut Mendorong Pendidikan Merata di Indonesia</p>
        </div>
        <div>
          <h3 className="font-bold">Navigasi</h3>
          <ul>
            <li>Beranda</li>
            <li>Tentang</li>
            <li>Fitur</li>
            <li>Harga</li>
            <li>Pengumuman</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold">Panduan & Bantuan</h3>
          <ul>
            <li>FAQ</li>
            <li>Kebijakan Privasi</li>
            <li>Syarat & Ketentuan</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold">Hubungi Kami</h3>
          <p>0811-1000-8008</p>
          <p>info@ppdbonline.com</p>
        </div>
      </div>
      <div className="text-center text-xs mt-6">
        © 2025 PPDB Online. All Rights Reserved.
      </div>
    </footer>
  );
}
