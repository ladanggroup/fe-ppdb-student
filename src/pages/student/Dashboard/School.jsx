import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import useSchoolStore from "@/store/useSchoolStore";
import LoadingOverlay from "@/components/LoadingOverlay";
import DashboardLayout from "@/layouts/student/DashboardLayout";
import { GraduationCap, Bookmark } from "lucide-react";
import Pagination from "@/components/Pagination";
import SchoolDetail from "@/components/student/wave/SchoolDetail";
import useAuthStore from "@/store/authStore";

const School = () => {
  const { slug } = useParams();
  const { currentSchool, showSchoolStudent, loading } = useSchoolStore();
  const { user: student } = useAuthStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWave, setSelectedWave] = useState(null);
  const perPage = 3;
  localStorage.setItem("slug", slug);

  useEffect(() => {
    showSchoolStudent(slug);
  }, [showSchoolStudent, slug]);

  if (loading || !currentSchool) {
    return <LoadingOverlay />;
  }

  const waves = currentSchool?.waves || [];
  const totalPages = Math.ceil(waves.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedWaves = waves.slice(startIndex, startIndex + perPage);

  const paginationData = {
    current_page: currentPage,
    last_page: totalPages,
  };

  if (currentSchool && selectedWave) {
    return (
      <SchoolDetail
        school={currentSchool}
        wave={selectedWave}
        onBack={() => {
          setSelectedWave(null);
        }}
      />
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center px-6 py-10">
        {/* ================= HEADER ================= */}
        <div className="text-center grid grid-cols-1 md:grid-cols-2 px-4 md:px-10 py-10 md:py-4 mb-8">
          <div className="md:order-last">
            <img
              src={currentSchool.logo_url || "/src/assets/Group 1078.png"}
              alt="Logo Sekolah"
              className="w-[285.81px] h-[275.38px] rounded-xl mx-auto mb-4"
            />
          </div>

          <div className="flex flex-col items-center md:items-start md:text-left justify-center md:order-first md:ml-8">
            <h1 className="text-3xl font-bold mb-2">
              {currentSchool.name?.toUpperCase()}
            </h1>
            <p className="text-gray-600 mb-6">
              Penerimaan Peserta Didik Baru Tahun Ajaran Baru. Bergabunglah
              bersama {currentSchool.name} untuk meraih prestasi dan masa depan
              gemilang.
            </p>
            {student ? (
              <Link
                to={"/student/profile"}
                className="bg-[#00529D] text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition"
              >
                Cek Profile
              </Link>
            ) : (
              <Link
                to={"/student/" + slug + "/register"}
                className="bg-[#00529D] text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition"
              >
                Daftar Sekarang
              </Link>
            )}
          </div>
        </div>

        {/* ================= GELOMBANG PENDAFTARAN ================= */}
        <section className="relative w-[98%] bg-[#0C6496] text-white px-8 py-10 rounded-2xl shadow-lg mb-10">
          <Bookmark className="absolute top-[-10px] right-[-2px] text-[#C2E4FF] w-[105px] h-[104px]" />
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-semibold">Gelombang Pendaftaran</h2>
          </div>

          {/* Kartu Gelombang */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paginatedWaves.map((wave) => (
              <div
                key={wave.id}
                className="bg-white text-gray-800 rounded-xl p-6 text-center shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3 items-center">
                    <div className="text-[#01547C]">
                      <GraduationCap className="w-10 h-10" />
                    </div>
                    <h3 className="text-lg font-semibold">{wave.name}</h3>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full uppercase font-medium ${
                      wave.status === "open"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {wave.status === "open" ? "Buka" : "Tutup"}
                  </span>
                </div>

                <p className="text-sm text-left mb-1">
                  Pembukaan pendaftaran :
                  <br />
                  {new Date(wave.start_date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  –{" "}
                  {new Date(wave.end_date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm text-left mb-4">
                  Kuota : {wave.quota || 120}
                </p>
                <div className="mt-auto flex justify-end">
                  <button
                    className="bg-[#00529D] text-white py-2 px-4 rounded-md hover:bg-blue-700 transition cursor-pointer"
                    onClick={() => setSelectedWave(wave)}
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            pagination={paginationData}
            onPageChange={(page) => setCurrentPage(page)}
            className="mt-8 bg-white text-[#0C6496] hover:bg-blue-100"
          />
        </section>

        {/* Dokumen Pendaftaran */}
        <section className="text-center px-4 md:px-2 mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <img
              src="/src/assets/PPD Online (1) 1.png"
              alt="Dokumen"
              className="w-[342px] h-[342px] mb-4"
            />
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold mb-4">
                Dokumen Pendaftaran
              </h2>
              <p className="text-gray-600 mb-4">
                Harap menyiapkan dokumen berikut sebagai kelengkapan persyaratan
                administrasi:
              </p>
              {currentSchool?.document_requirements?.map((doc, index) => (
                <ul
                  key={index}
                  className="md:text-left md:pl-4 list-inside list-disc mb-6 space-y-2 text-gray-700"
                >
                  <li>{doc.name}</li>
                </ul>
              ))}
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default School;
