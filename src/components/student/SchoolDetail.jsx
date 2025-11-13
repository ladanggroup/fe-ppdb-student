import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Printer } from "lucide-react";
import PaginationSlidingWindow from "@/components/PaginationSlidingWindow";
import SelectionStatusBadge from "../SelectionStatusBadge";
import { Link, useParams, useSearchParams, useNavigate } from "react-router";
import DashboardLayout from "@/layouts/student/DashboardLayout";
import useAuthStore from "@/store/authStore";
import useSchoolStudent from "@/store/useSchoolStudent";

export default function SchoolDetail({ school }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore(); // ambil user login
  const { printSelectionLetter } = useSchoolStudent();

  const initialSearch = searchParams.get("search") || "";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  const [search, setSearch] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const perPage = 10;

  // === Update URL params ===
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (currentPage > 1) params.set("page", currentPage);
    else params.delete("page");
    navigate(`?${params.toString()}`, { replace: true });
  }, [search, currentPage, navigate]);

  // === Filter siswa ===
  const filteredStudents = useMemo(() => {
    const q = search.toLowerCase();
    return (
      school.school_students?.filter((s) => {
        const name = s.student?.name?.toLowerCase() || "";
        const nisn = s.student?.nisn?.toLowerCase() || "";
        const reg = s.registration_number?.toLowerCase() || "";
        return name.includes(q) || nisn.includes(q) || reg.includes(q);
      }) || []
    );
  }, [school, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // === Pagination ===
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredStudents.slice(start, start + perPage);
  }, [filteredStudents, currentPage]);

  // === Cetak surat hasil seleksi ===
  const handlePrint = async (schoolStudent) => {
    if (!user) {
      navigate(`/student/${slug}/login`);
      return;
    }

    try {
      const response = await printSelectionLetter(
        schoolStudent.registration_number
      );
      const blob = new Blob([response], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Gagal cetak PDF:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-4">
            <Link to={`/${slug}`} className="text-gray-500 hover:underline">
              Home
            </Link>{" "}
            / <span className="text-gray-700 font-medium">Hasil Seleksi</span>
          </div>

          {/* Card utama */}
          <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 mb-6 gap-4">
              {/* Header Info Sekolah */}
              <div className="flex items-center gap-4">
                <img
                  src={school.logo_url || "/src/assets/Group 1078.png"}
                  alt={school.name}
                  className="w-16 h-16 rounded-md object-cover border border-gray-200"
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

              {/* Search bar */}
              <div>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="flex items-center gap-3 w-full"
                >
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Cari nama siswa / NISN / No. Pendaftaran..."
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
                    <th className="py-2 px-4 text-left">NISN</th>
                    <th className="py-2 px-4 text-left">Status</th>
                    <th className="py-2 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
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
                        <td className="py-2 px-4 font-mono">
                          {ss.student?.nisn || "-"}
                        </td>
                        <td className="py-2 px-4">
                          <SelectionStatusBadge status={ss.selection_status} />
                        </td>
                        <td className="py-2 px-4 text-center">
                          {ss.selection_status === "passed_selection" ? (
                            <button
                              onClick={() => handlePrint(ss)}
                              className="inline-flex items-center cursor-pointer gap-1 px-3 py-1.5 text-xs font-medium bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition"
                            >
                              <Printer size={14} />
                              Cetak
                            </button>
                          ) : (
                            <span className="text-gray-400 text-xs italic">
                              -
                            </span>
                          )}
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
    </DashboardLayout>
  );
}