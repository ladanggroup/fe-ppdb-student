import PortalDialog from "@/components/PortalDialog";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LandingPageLayout from "@/layouts/LandingPage/LandingPageLayout";
import { CircleCheck, Star, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export default function Home() {
  const [openFAQ, setOpenFAQ] = useState(0);
  const [openPortal, setOpenPortal] = useState(false);

  const steps = [
    { id: 1, title: "Daftar & Aktivasi Sekolah" },
    { id: 2, title: "Atur Jalur & Formulir" },
    { id: 3, title: "Siswa Daftar Mandiri Atau Sekolah Input" },
    { id: 4, title: "Verifikasi & Umumkan Hasil" },
  ];

  const testimonials = [
    {
      name: "Pepe Kakampang",
      role: "Kepala Dinas Pendidikan",
      text: "Sit nec cursus et libero, quis id faucibus quam consectetur cursus quam Vivamus faucibus eget at.",
    },
    {
      name: "Pepe Kakampang",
      role: "Kepala Dinas Pendidikan",
      text: "Sit nec cursus et libero, quis id faucibus quam consectetur cursus quam Vivamus faucibus eget at.",
    },
    {
      name: "Pepe Kakampang",
      role: "Kepala Dinas Pendidikan",
      text: "Sit nec cursus et libero, quis id faucibus quam consectetur cursus quam Vivamus faucibus eget at.",
    },
  ];

  const faqs = [
    {
      q: "Apa itu PPDB Online ?",
      a: "PPDB Online adalah sistem pendaftaran siswa baru yang dilakukan secara daring untuk mempermudah proses seleksi, administrasi, dan komunikasi.",
    },
    {
      q: "Bagaimana cara mendaftar ?",
      a: "Sekolah melakukan aktivasi, mengatur jalur pendaftaran, kemudian siswa bisa mendaftar secara mandiri atau melalui sekolah.",
    },
    {
      q: "Apakah verifikasi otomatis ?",
      a: "Ya, sistem menyediakan verifikasi dan seleksi otomatis dengan monitoring real-time.",
    },
  ];

  return (
    <LandingPageLayout>
      <div className="overflow-y-auto">
        {/* Section Hero */}
        <section className="text-center py-16 bg-orange-50">
          <h1 className="text-4xl font-bold">
            Situs <span className="text-orange-500">PPDB Online</span>
          </h1>
          <p className="mt-2">
            Pendaftaran Sekolah Dalam Genggaman Langkah Cepat Menuju
          </p>
          <p className="mt-1">Sekolah Impian</p>
          <div className="mt-6 space-x-4">
            <button
              onClick={() => setOpenPortal(true)}
              className="px-6 py-2 bg-orange-soft hover:bg-white hover:text-orange-soft-700 hover:border-orange-soft-700 text-white rounded-lg cursor-pointer"
            >
              Daftar Sekarang
            </button>
            <Link
              to="/kontak"
              className="px-6 py-2 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded-lg"
            >
              Hubungi Kami
            </Link>
          </div>
        </section>

        <Dialog open={openPortal} onOpenChange={setOpenPortal}>
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent className="sm:max-w-md p-0 bg-transparent border-none shadow-none">
            <DialogTitle className="hidden">Ke Portal PPDB</DialogTitle>
            <PortalDialog onClose={() => setOpenPortal(false)} />
          </DialogContent>
        </Dialog>

        <section className="py-16 max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 text-left">
              <span className="text-ppdb-orange">
                Mudah, cepat, dan terintegrasi
              </span>{" "}
              untuk mendukung
            </h2>
            <h2 className="text-2xl font-semibold text-gray-800 text-left">
              pembangunan pendidikan untuk Indonesia
            </h2>
            <p className="mt-6 text-gray-600 text-left">
              PPDB Online hadir sebagai solusi praktis untuk membantu sekolah
            </p>
            <p className="text-gray-600 text-left mb-6">
              mengelola pendaftaran siswa baru secara efisien dan profesional.
            </p>
            <p className="mt-4 text-gray-600 text-left">
              <CircleCheck className="text-ppdb-orange inline mr-2" />
              Terintegrasi & Terkontrol
            </p>
            <p className="mt-2 text-gray-600 text-left">
              <CircleCheck className="text-ppdb-orange inline mr-2" />
              Dukungan Jalur & Gelombang Pendaftaran
            </p>
            <p className="mt-2 text-gray-600 text-left">
              <CircleCheck className="text-ppdb-orange inline mr-2" />
              Verifikasi & Seleksi Otomatis
            </p>
            <p className="mt-2 text-gray-600 text-left">
              <CircleCheck className="text-ppdb-orange inline mr-2" />
              Statistik & Monitoring Real-Time
            </p>
            <p className="mt-2 text-gray-600 text-left">
              <CircleCheck className="text-ppdb-orange inline mr-2" />
              Pengelolaan Dokumen & Pembayaran
            </p>
            <p className="mt-2 text-gray-600 text-left">
              <CircleCheck className="text-ppdb-orange inline mr-2" />
              Notifikasi Otomatis ke Siswa
            </p>
          </div>
          <div className="flex flex-col space-y-4">
            <img
              src="/src/assets/Desain tanpa judul (27) 1.png"
              alt="PPDB Online"
              className="w-full"
            />
          </div>
        </section>

        {/* Section Bagaimana Sistem Bekerja */}
        <section className="py-16 bg-gray-50 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-10">
            Bagaimana Sistem Kami Bekerja ?
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold text-lg">
                    {step.id}
                  </div>
                  <p className="mt-3 text-gray-700 text-sm font-medium max-w-[150px]">
                    {step.title}
                  </p>
                </div>
                {idx < steps.length - 1 && (
                  <span className="mx-4 text-orange-400 text-2xl">→</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section Testimoni */}
        <section className="py-16 max-w-7xl mx-auto px-4">
          <h2 className="text-center text-2xl md:text-3xl font-bold mb-4">
            Sekolah Telah{" "}
            <span className="text-orange-500">Membuktikannya</span>
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
            Sistem PPDB Online mempermudah proses seleksi, administrasi, dan
            komunikasi antara sekolah dan calon peserta didik.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center font-bold text-orange-600">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{t.text}</p>
                <div className="flex">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section FAQ */}
        <section className="py-16 bg-gray-50 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Pertanyaan Umum
              </h3>
              <p className="text-gray-600 mb-6">
                Masih ragu? Berikut beberapa jawaban yang mungkin Anda butuhkan.
              </p>
              <Link
                to="/faq"
                className="bg-orange-soft text-white hover:bg-white hover:text-orange-soft-800 px-4 py-2 rounded-xl"
              >
                Hubungi Kami
              </Link>
            </div>
            <div>
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="mb-3 border rounded-lg bg-white overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                    className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-gray-700"
                  >
                    {faq.q}
                    <ChevronDown
                      className={`w-5 h-5 transform transition ${
                        openFAQ === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFAQ === idx && (
                    <div className="px-4 pb-4 text-gray-600">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </LandingPageLayout>
  );
}
