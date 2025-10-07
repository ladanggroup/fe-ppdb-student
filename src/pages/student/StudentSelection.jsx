// src/pages/student/StudentSelection.jsx
import { useEffect } from "react";
import DashboardLayout from "@/layouts/student/DashboardLayout";
import useSchoolStudent from "@/store/useSchoolStudent";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Loader2, Printer } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Link } from "react-router";

export default function StudentSelection() {
  const { schoolStudents, fetchSchoolStudents, printSelectionLetter, loading } =
    useSchoolStudent();
  const { user: student } = useAuthStore();

  useEffect(() => {
    if (student?.id) {
      fetchSchoolStudents(student.id);
    }
  }, [student, fetchSchoolStudents]);

  const handlePrint = async (schoolStudent) => {
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
      <div className="bg-white dark:bg-gray-800 p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Hasil Seleksi Sekolah
        </h1>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
          </div>
        ) : schoolStudents.length === 0 ? (
          <p className="text-gray-500 text-center">
            Belum ada sekolah yang dipilih.
          </p>
        ) : (
          <div className="overflow-x-auto border border-gray-800 dark:border-gray-600 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="">
                  <TableHead>No</TableHead>
                  <TableHead>nomor registrasi</TableHead>
                  <TableHead>Sekolah</TableHead>
                  <TableHead>Nama Peserta</TableHead>
                  <TableHead>NISN</TableHead>
                  <TableHead>Status Seleksi</TableHead>
                  <TableHead className="text-left">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schoolStudents.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{schoolStudents.indexOf(item) + 1}</TableCell>
                    <TableCell>{item.registration_number}</TableCell>
                    <TableCell className="font-medium">
                      {item.school.name}
                    </TableCell>
                    <TableCell>{item.student.name}</TableCell>
                    <TableCell>{item.student.nisn}</TableCell>
                    <TableCell>
                      {item.selection_status === "passed_selection" ? (
                        <span className="text-green-600 font-semibold">
                          Lulus
                        </span>
                      ) : item.selection_status === "failed_selection" ? (
                        <span className="text-red-600 font-semibold">
                          Tidak Lulus
                        </span>
                      ) : item.selection_status === "verify" ? (
                        <span className="text-blue-600 font-semibold">
                          Verifikasi Berkas
                        </span>
                      ) : item.selection_status ===
                        "data_received_awaiting_selection" ? (
                        <span className="text-yellow-600 font-semibold">
                          Data Diterima, Menunggu Seleksi
                        </span>
                      ) : (
                        <span className="text-gray-400 font-semibold">
                          Ditolak, Data Tidak Sesuai
                        </span>
                      )}
                    </TableCell>
                    {item.selection_status === "passed_selection" ? (
                      <TableCell className="text-center">
                        <Button
                          onClick={() => handlePrint(item)}
                          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white"
                          size="sm"
                        >
                          <Printer size={16} />
                          Cetak
                        </Button>
                      </TableCell>
                    ) : item.selection_status ===
                      "rejected_data_does_not_match" ? (
                      <TableCell className="text-center">
                        <Link
                          to="/student/complete-registration"
                          className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-md"
                          size="sm"
                        >
                          Lengkapi Data
                        </Link>
                      </TableCell>
                    ) : (
                      <TableCell className="text-center">
                        <span className="text-gray-400">Tidak Ada Aksi</span>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
