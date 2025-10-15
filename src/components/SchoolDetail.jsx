import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import PaginationSlidingWindow from "@/components/PaginationSlidingWindow";
import LandingPageLayout from "@/layouts/LandingPage/LandingPageLayout";
import SelectionStatusBadge from "./SelectionStatusBadge";

export default function SchoolDetail({ school, onBack }) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const filteredStudents =
    school.school_students?.filter((s) =>
      s.student?.name?.toLowerCase().includes(search.toLowerCase())
    ) || [];

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <LandingPageLayout>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-4">
            <span className="cursor-pointer hover:underline" onClick={onBack}>
              Hasil Seleksi
            </span>{" "}
            / <span className="text-gray-700 font-medium">Detail Sekolah</span>
          </div>

          {/* Card utama */}
          <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6">
            <div className="grid grid-cols-2 mb-6">
              {/* Header Info Sekolah */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={school.logo_url || "/src/assets/Group 1078.png"}
                    alt={school.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {school.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      NPSN: {school.npsn} &nbsp;|&nbsp; Jumlah Pagu:{" "}
                      {school.waves?.[0]?.quota || 0} Siswa
                    </p>
                    <p className="text-sm text-gray-500">
                      {school.cities?.name}, {school.provinces?.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Search bar */}
              <div className="mb-4">
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="flex items-center gap-3 w-full"
                >
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Cari nama siswa..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full text-sm">
                <thead className="bg-gradient-to-r from-orange-100 to-orange-50 text-gray-800 font-semibold">
                  <tr>
                    <th className="py-2 px-4 text-left">No</th>
                    <th className="py-2 px-4 text-left">No. Pendaftaran</th>
                    <th className="py-2 px-4 text-left">Nama</th>
                    <th className="py-2 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-8 text-gray-500 italic"
                      >
                        Tidak ada data siswa
                      </td>
                    </tr>
                  ) : (
                    paginatedStudents.map((ss, index) => (
                      <tr
                        key={ss.id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-2 px-4">
                          {(currentPage - 1) * perPage + index + 1}
                        </td>
                        <td className="py-2 px-4 font-mono text-gray-700">
                          {ss.registration_number || "-"}
                        </td>
                        <td className="py-2 px-4">{ss.student?.name || "-"}</td>
                        <td className="py-2 px-4">
                          <SelectionStatusBadge status={ss.selection_status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center">
              <PaginationSlidingWindow
                currentPage={currentPage}
                totalPages={Math.ceil(filteredStudents.length / perPage)}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </LandingPageLayout>
  );
}
