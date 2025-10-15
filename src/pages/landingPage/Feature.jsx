import LandingPageLayout from "@/layouts/LandingPage/LandingPageLayout";
import { CalendarCog } from "lucide-react";
import { CheckCircle } from "lucide-react";
import {
  Settings,
  Users,
  ClipboardList,
  BookOpen,
  CreditCard,
  Repeat,
} from "lucide-react";

const Feature = () => {
  const features = [
    {
      icon: Settings,
      text: "Kelola profil sekolah, dokumen legalitas, dan status langganan",
    },
    {
      icon: Users,
      text: "Atur peran dan akses pengguna seperti Admin, Kepala Sekolah, dan Siswa",
    },
    {
      icon: ClipboardList,
      text: "Pendaftaran mandiri atau melalui sekolah, lengkap dengan input data & upload dokumen",
    },
    {
      icon: CheckCircle,
      text: "Proses seleksi dan verifikasi berkas siswa oleh Admin Sekolah",
    },
    {
      icon: BookOpen,
      text: "Kelola dan unduh dokumen siswa dan sekolah dengan mudah",
    },
    {
      icon: CreditCard,
      text: "Pengelolaan pembayaran dari siswa dan langganan sekolah",
    },
    {
      icon: Repeat,
      text: "Dukungan pendaftaran siswa pindahan tahun ajaran berjalan",
    },
    {
      icon: CalendarCog,
      text: "Sesuaikan jadwal & kuota untuk tiap gelombang",
    },
  ];
  return (
    <LandingPageLayout>
      <section className="bg-orange-soft-500 py-10 relative">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-left">
            Fitur Unggulan PPDB Online
          </h2>
        </div>
      </section>

      <section className="px-6 py-12 grid md:grid-cols-2 gap-10 items-center shadow-md">
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Dirancang Fleksibel untuk Berbagai Jenjang Pendidikan dan Jumlah
            Pendaftar
          </h3>
          <p className="text-gray-600 leading-relaxed">
            PPDB Online dapat digunakan oleh sekolah dasar, menengah, hingga
            atas baik negeri maupun swasta, dengan jumlah pendaftar puluhan
            hingga ribuan.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="relative w-64 h-64">
            <img
              src="/src/assets/Desain tanpa judul (34) 1.png"
              alt="Feature 1"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Fitur Lengkap untuk Mendukung Proses PPDB Digital Sekolah
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Semua yang sekolah butuhkan untuk menyelenggarakan penerimaan
              siswa baru secara digital mudah, aman, dan terintegrasi.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {features.map((item, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center text-center h-full"
              >
                {/* Floating Icon */}
                <div className="absolute -top-7 bg-orange-500 text-white rounded-full p-4 shadow-lg">
                  <item.icon className="w-6 h-6" />
                </div>

                {/* Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all pt-12 pb-6 px-5 flex flex-col items-center justify-between h-full min-h-[180px] mb-3">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </LandingPageLayout>
  );
};

export default Feature;
