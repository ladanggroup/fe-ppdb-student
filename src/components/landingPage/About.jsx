import LandingPageLayout from "@/layouts/LandingPageLayout";
import { Users } from "lucide-react";
import { House } from "lucide-react";
import { Bell } from "lucide-react";
import { BookOpen } from "lucide-react";
import { Activity } from "lucide-react";
import { Zap } from "lucide-react";
import { CircleCheckBig } from "lucide-react";
import { Database } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { Settings } from "lucide-react";

export default function About() {
  return (
    <LandingPageLayout>
      <section className="px-6 py-12 bg-orange-soft text-left">
        <h1 className="text-3xl font-bold text-white mb-4">Tentang Kami</h1>
        <p className="text-white">
          Kenali kami lebih dekat dalam mendukung digitalisasi PPDB di sekolah
          Indonesia.
        </p>
      </section>
      <section className="py-16 max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold text-left mb-4">
            Mengapa PPDB Online Diciptakan ?
          </h1>
          <p className="text-left">
            Dengan memahami tantangan administrasi penerimaan siswa di berbagai
            jenjang pendidikan, PPDB Online dikembangkan untuk memberikan solusi
            digital yang andal bagi sekolah di seluruh Indonesia. Tidak hanya
            memfasilitasi proses pendaftaran siswa baru secara daring, sistem
            ini juga menyederhanakan tahapan verifikasi dokumen, membantu
            sekolah melakukan seleksi, dan memberikan akses mudah bagi calon
            siswa maupun orang tua/wali yang terlibat langsung dalam proses
            tersebut.
          </p>
          <p className="text-left mt-4">
            PPDB Online dirancang untuk beroperasi sepanjang tahun ajaran,
            mendukung berbagai jalur dan gelombang pendaftaran, serta menyimpan
            arsip data yang dapat diakses kembali oleh sekolah kapan pun
            dibutuhkan.
          </p>
        </div>
        <div>
          <img
            src="/src/assets/Concept of Unknown things.png"
            alt="PPDB Online"
            className="w-full"
          />
        </div>
      </section>
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            Menjadi <span className="text-orange-soft">Solusi</span> Bagi
            Sekolah di Indonesia
          </h2>
          <p className="text-center">
            Menerapkan PPDB berbasis digital yang efisien
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="flex flex-col items-center justify-center bg-orange-100 rounded-lg p-4">
            <img
              src="/src/assets/Group 598.png"
              alt="PPDB Online"
              className="w-10 h-10"
            />
            <p className="text-center mt-4">
              Menyediakan sistem pendaftaran online yang mudah digunakan oleh
              sekolah
            </p>
          </div>
          <div className="flex flex-col items-center justify-center bg-orange-100 rounded-lg p-4">
            <img
              src="/src/assets/Group 599.png"
              alt="PPDB Online"
              className="w-10 h-10"
            />
            <p className="text-center mt-4">
              Meningkatkan efisiensi dan akurasi pengelolaan data{" "}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center bg-orange-100 rounded-lg p-4">
            <img
              src="/src/assets/Group 600.png"
              alt="PPDB Online"
              className="w-10 h-10"
            />
            <p className="text-center mt-4">
              Mendukung pemerataan akses teknologi untuk sekolah-sekolah di
              seluruh Indonesia
            </p>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Semua <span className="text-orange-soft">Lebih Mudah</span>, Baik
            untuk Sekolah Maupun Orang Tua!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Keuntungan Bagi Sekolah */}
            <div>
              <h3 className="text-xl font-semibold text-left mb-6">
                Keuntungan Bagi Sekolah
              </h3>
              <ul className="space-y-6 text-gray-700 text-left">
                <li className="flex items-start gap-3">
                  <Settings className="mr-2 h-10 w-10 text-orange-soft bg-orange-100 rounded-lg p-2" />
                  <div>
                    <p className="font-semibold">
                      Efisiensi administrasi sekolah
                    </p>
                    <p className="text-sm text-gray-600">
                      Proses pendaftaran dan verifikasi dokumen dilakukan secara
                      otomatis, mengurangi beban kerja manual staf sekolah.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <LayoutDashboard className="mr-2 h-10 w-10 text-orange-soft bg-orange-100 rounded-lg p-2" />
                  <div>
                    <p className="font-semibold">
                      Dashboard terpusat & mudah dikelola
                    </p>
                    <p className="text-sm text-gray-600">
                      Kelola semua jalur, gelombang, dan status siswa dari satu
                      tempat.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Database className="mr-2 h-10 w-10 text-orange-soft bg-orange-100 rounded-lg p-2" />
                  <div>
                    <p className="font-semibold">
                      Data tersimpan aman & terstruktur
                    </p>
                    <p className="text-sm text-gray-600">
                      Riwayat pendaftaran tersimpan rapi dan bisa diakses kapan
                      saja.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CircleCheckBig className="mr-2 h-10 w-10 text-orange-soft bg-orange-100 rounded-lg p-2" />
                  <div>
                    <p className="font-semibold">
                      Seleksi dan verifikasi lebih cepat
                    </p>
                    <p className="text-sm text-gray-600">
                      Sekolah dapat menetapkan kriteria dan melakukan seleksi
                      digital.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="mr-2 h-10 w-10 text-orange-soft bg-orange-100 rounded-lg p-2" />
                  <div>
                    <p className="font-semibold">
                      Akses multi peran untuk semua staf
                    </p>
                    <p className="text-sm text-gray-600">
                      Admin, kepala sekolah, dan tim verifikasi bisa bekerja
                      bersama.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Keuntungan Bagi Orang Tua */}
            <div className="text-left">
              <h3 className="text-xl font-semibold mb-6">
                Keuntungan Bagi Orang Tua / Wali Siswa
              </h3>
              <ul className="space-y-6 text-gray-700">
                <li className="flex items-start gap-3">
                  <House className="mr-2 h-10 w-10 text-orange-soft bg-orange-100 rounded-lg p-2" />
                  <div>
                    <p className="font-semibold">
                      Daftar dari rumah tanpa perlu ke sekolah
                    </p>
                    <p className="text-sm text-gray-600">
                      Orang tua cukup mendaftar online tanpa repot datang
                      langsung.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="mr-2 h-10 w-10 text-orange-soft bg-orange-100 rounded-lg p-2" />
                  <div>
                    <p className="font-semibold">
                      Proses cepat dan tidak ribet
                    </p>
                    <p className="text-sm text-gray-600">
                      Upload dokumen dan pantau status langsung lewat laptop/HP.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Bell className="mr-2 h-10 w-10 text-orange-soft bg-orange-100 rounded-lg p-2" />
                  <div>
                    <p className="font-semibold">
                      Notifikasi otomatis via email & portal
                    </p>
                    <p className="text-sm text-gray-600">
                      Setiap perubahan status akan diberitahukan otomatis.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Activity className="mr-2 h-10 w-10 text-orange-soft bg-orange-100 rounded-lg p-2" />
                  <div>
                    <p className="font-semibold">
                      Status pendaftaran bisa dipantau langsung
                    </p>
                    <p className="text-sm text-gray-600">
                      Orang tua bisa tahu tahap yang sudah selesai & yang belum.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <BookOpen className="mr-2 h-10 w-10 text-orange-soft bg-orange-100 rounded-lg p-2" />
                  <div>
                    <p className="font-semibold">
                      Akses informasi lengkap dan jelas
                    </p>
                    <p className="text-sm text-gray-600">
                      Panduan, jadwal, dan pengumuman tersedia online & bisa
                      diunduh.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* Digunakan oleh Sekolah */}
      <section className="py-16 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-bold text-left mb-4">
              Digunakan oleh Sekolah dari <br /> Berbagai Daerah
            </h2>
            <p className="text-gray-600 text-left mb-8">
              PPDB Online telah dipercaya oleh puluhan sekolah dasar, menengah,
              dan kejuruan dari berbagai kota dan kabupaten.
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-red-500 text-white text-lg font-semibold">
              SD/MI
            </div>
            <div className="w-28 h-28 flex items-center justify-center rounded-full bg-[#1E458A] text-white text-lg font-semibold">
              SMP/MTS
            </div>
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-400 text-white text-lg font-semibold">
              SMA/MA
            </div>
            <div className="w-26 h-26 flex items-center justify-center rounded-full bg-gray-500 text-white text-lg font-semibold">
              SMK/MAK
            </div>
          </div>
        </div>
      </section>
    </LandingPageLayout>
  );
}
