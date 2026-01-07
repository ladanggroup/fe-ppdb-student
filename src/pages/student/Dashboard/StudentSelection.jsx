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
import SelectionStatusBadge from "@/components/SelectionStatusBadge";

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
      <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Hasil Seleksi Sekolah
        </h1>
        <p className="text-gray-500 mb-6">
          Berikut daftar sekolah yang telah kamu daftar beserta status
          seleksinya.
        </p>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin h-6 w-6 text-gray-800" />
          </div>
        ) : schoolStudents.length === 0 ? (
          <p className="text-gray-700 text-center py-10">
            Belum ada sekolah yang dipilih.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <Table className="text-sm">
              <TableHeader>
                <TableRow className="bg-gray-50 [&_th]:text-black">
                  <TableHead>No</TableHead>
                  <TableHead>Nomor Registrasi</TableHead>
                  <TableHead>Sekolah</TableHead>
                  <TableHead>Nama Peserta</TableHead>
                  <TableHead>NISN</TableHead>
                  <TableHead>Status Seleksi</TableHead>
                  <TableHead className="text-center w-40">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schoolStudents.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <TableCell className="dark:text-gray-800">{schoolStudents.indexOf(item) + 1}</TableCell>
                    <TableCell className="dark:text-gray-800">{item.registration_number}</TableCell>
                    <TableCell className="font-medium dark:text-gray-800">
                      {item.school.name}
                    </TableCell>
                    <TableCell className="dark:text-gray-800">{item.student.name}</TableCell>
                    <TableCell className="dark:text-gray-800">{item.student.nisn}</TableCell>
                    <TableCell>
                      <SelectionStatusBadge status={item.selection_status} />
                    </TableCell>

                    <TableCell className="text-center">
                      {item.selection_status === "passed_selection" && (
                        <Button
                          onClick={() => handlePrint(item)}
                          className="bg-orange-500 hover:bg-orange-600 text-white flex gap-2 cursor-pointer mx-auto"
                          size="sm"
                        >
                          <Printer size={14} />
                          Cetak
                        </Button>
                      )}

                      {item.selection_status ===
                        "rejected_data_does_not_match" && (
                        <Link
                          to={
                            "/student/" +
                            item?.school?.slug +
                            "/complete-registration"
                          }
                          className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-2 rounded-md text-xs"
                        >
                          Lengkapi Data
                        </Link>
                      )}

                      {item.selection_status !== "passed_selection" &&
                        item.selection_status !==
                          "rejected_data_does_not_match" && (
                          <span className="text-gray-500 text-xs">
                            Tidak Ada Aksi
                          </span>
                        )}
                    </TableCell>
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
