import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/admin/DashboardLayout";
import useStudentStore from "@/store/useStudentStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Pagination from "@/components/pagination";
import { Search } from "lucide-react";
import { Eye } from "lucide-react";
import { Link } from "react-router";

const List = () => {
  const { students, fetchStudentsAdmin, loading, error } = useStudentStore();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // debounce agar tidak langsung fetch tiap ketik
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
        <Card className="border-0 shadow-md bg-gradient-to-b from-teal-200 to-teal-200 dark:from-slate-900 dark:to-slate-900">
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="">
                  <TableRow>
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>NISN</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Memuat data...
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-4 text-red-500"
                      >
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : students?.data?.length > 0 ? (
                    students.data.map((student, index) => (
                      <TableRow
                        key={student.id}
                        className="hover:bg-teal-50 dark:hover:bg-slate-800 transition"
                      >
                        <TableCell>{students.from + index}</TableCell>
                        <TableCell>
                          {student.name}
                        </TableCell>
                        <TableCell>{student.nisn}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
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
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Link
                              to={`/admin/student/${student.id}/show`}
                              className="bg-teal-500 hover:bg-teal-600 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-2 rounded text-xs font-medium"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-4 text-slate-500 dark:text-slate-400"
                      >
                        Tidak ada data siswa
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {students?.total > 0 && (
              <Pagination
                pagination={students}
                onPageChange={handlePageChange}
                className="mt-2 bg-teal-200 dark:bg-teal-900 hover:bg-teal-300 dark:hover:bg-teal-700"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default List;
