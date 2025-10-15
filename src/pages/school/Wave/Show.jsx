import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/layouts/school/DashboardLayout";
import formatIdr from "@/utils/formatIdr";
import { ArrowLeft } from "lucide-react";
import PaginationSlidingWindow from "@/components/PaginationSlidingWindow";
import SelectionStatusBadge from "@/components/SelectionStatusBadge";

const Show = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const wave = location.state?.wave;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalRegistered = wave?.school_students?.length || 0;
  const totalPages = Math.ceil(totalRegistered / itemsPerPage);
  const paginatedStudents =
    wave?.school_students?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ) || [];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (!wave) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">
          <p>Data tidak ditemukan. Silakan kembali ke daftar gelombang.</p>
          <Button
            onClick={() => navigate("/school/wave")}
            className="cursor-pointer mt-4"
          >
            Kembali
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const remainingQuota = wave.quota - totalRegistered;

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)}
              className="cursor-pointer rounded-full"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Detail Gelombang
            </h1>
          </div>
        </div>

        {/* Info Gelombang */}
        <div className="bg-sky-200 dark:bg-[#1f2d3a] p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-semibold mb-3">{wave.name}</h2>
          <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
            <p>
              <span className="font-semibold text-gray-600 dark:text-white">
                Tanggal:
              </span>{" "}
              {wave.start_date} s.d. {wave.end_date}
            </p>
            <p>
              <span className="font-semibold">Harga:</span> {formatIdr(wave.price)}
            </p>
            <p>
              <span className="font-semibold text-gray-600 dark:text-white">
                Kuota:
              </span>{" "}
              {remainingQuota} / {wave.quota} siswa
            </p>
            <p>
              <span className="font-semibold text-gray-600 dark:text-white">
                Total Pendaftar:
              </span>{" "}
              {totalRegistered} siswa
            </p>
          </div>

          <div className="mt-4">
            <p className="font-semibold text-gray-600 dark:text-white">
              Keterangan:
            </p>
            <p className="text-gray-700 dark:text-gray-400 mt-1">
              {wave.description || "-"}
            </p>
          </div>

          {/* Dokumen Persyaratan */}
          {wave.wave_document_requirements?.length > 0 && (
            <div className="mt-5">
              <p className="font-semibold text-gray-600 dark:text-white mb-2">
                Dokumen Persyaratan:
              </p>
              <div className="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-300">
                {(() => {
                  const docs = wave.wave_document_requirements.map(
                    (doc) => doc.document_requirement?.name || "-"
                  );
                  const chunkSize = 3;
                  const rows = [];
                  for (let i = 0; i < docs.length; i += chunkSize) {
                    rows.push(docs.slice(i, i + chunkSize));
                  }
                  return rows.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="flex flex-wrap gap-x-6"
                    >
                      {row.map((name, idx) => (
                        <span
                          key={idx}
                          className="before:content-['-'] before:mr-1 whitespace-nowrap bg-teal-200 dark:bg-teal-800 px-2 py-1 rounded-md"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Daftar Siswa */}
        <div className="bg-sky-200 dark:bg-[#1f2d3a] p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Daftar Siswa Terdaftar</h3>

          {totalRegistered > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                  <thead className="bg-sky-100 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 border">No</th>
                      <th className="px-4 py-2 border text-left">Nama</th>
                      <th className="px-4 py-2 border text-left">NISN</th>
                      <th className="px-4 py-2 border text-left">
                        Status Seleksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedStudents.map((student, index) => (
                      <tr
                        key={student.id}
                        className="border-t hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-4 py-2 text-center">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-4 py-2">
                          {student.student?.name || "-"}
                        </td>
                        <td className="px-4 py-2">
                          {student.student?.nisn || "-"}
                        </td>
                        <td className="px-4 py-2">
                          <SelectionStatusBadge
                            status={student.selection_status}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <PaginationSlidingWindow
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Belum ada siswa yang mendaftar pada gelombang ini.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Show;
