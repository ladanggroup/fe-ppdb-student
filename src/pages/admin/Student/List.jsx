import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/admin/DashboardLayout";
import useStudentStore from "@/store/useStudentStore";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Pagination from "@/components/pagination";
import { Search, Eye, Loader2 } from "lucide-react";
import { Link } from "react-router";

const List = () => {
  const { students, fetchStudentsAdmin, loading, error } = useStudentStore();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchStudentsAdmin(page, search);
    }, 500);
    return () => clearTimeout(delay);
  }, [page, search, fetchStudentsAdmin]);

  const handlePageChange = (newPage) => setPage(newPage);

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header dan Pencarian */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-3">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Daftar Siswa
          </h1>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari nama atau NISN siswa..."
              className="pl-8 bg-white border border-slate-300 dark:border-slate-600"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>
        </div>

        {/* Tabel Data */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
          </div>
        ) : error ? (
          <p className="text-center text-red-500 py-4">{error}</p>
        ) : students?.data?.length === 0 ? (
          <p className="text-gray-600 dark:text-white">
            Belum ada data siswa.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table className="bg-teal-100 dark:bg-gray-800 mt-4 rounded-xl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-600 dark:text-white">No</TableHead>
                  <TableHead className="text-gray-600 dark:text-white">Nama</TableHead>
                  <TableHead className="text-gray-600 dark:text-white">NISN</TableHead>
                  <TableHead className="text-gray-600 dark:text-white">Email</TableHead>
                  <TableHead className="text-gray-600 dark:text-white">Status</TableHead>
                  <TableHead className="text-gray-600 dark:text-white text-center">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.data?.map((student, index) => (
                  <TableRow
                    key={student.id}
                    className="hover:bg-teal-200 dark:hover:bg-gray-600 transition"
                  >
                    <TableCell className="text-gray-600 dark:text-white px-3 py-4">
                      {students.from + index}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-white px-3 py-4">
                      {student.name}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-white px-3 py-4">
                      {student.nisn}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-white px-3 py-4">
                      {student.email}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-white px-3 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          student.status === "active"
                            ? "bg-green-100 text-green-700"
                            : student.status === "inactive"
                            ? "bg-gray-100 text-gray-700"
                            : student.status === "reject"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {student.status === "active"
                          ? "Aktif"
                          : student.status === "inactive"
                          ? "Tidak Aktif"
                          : student.status === "reject"
                          ? "Ditolak"
                          : "Menunggu"}
                      </span>
                    </TableCell>
                    <TableCell className="flex justify-center gap-2 px-3 py-4">
                      <Link
                        to={`/admin/student/${student.id}/show`}
                        className="bg-sky-500 text-white hover:bg-sky-600 px-3 py-2 rounded-md"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {students?.total > 0 && (
          <div className="mt-4">
            <Pagination pagination={students} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default List;
