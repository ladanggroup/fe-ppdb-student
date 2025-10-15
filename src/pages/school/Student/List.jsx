// src/pages/school/Student/List.jsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dropdown } from "@/components/ui/dropdown";
import DashboardLayout from "@/layouts/school/DashboardLayout";
import { Link, useSearchParams, Outlet } from "react-router";
import useSchoolStudent from "@/store/useSchoolStudent";
import useAuthStore from "@/store/authStore";
import LoadingOverlay from "@/components/LoadingOverlay";
import Pagination from "@/components/Pagination";
import { Filter, CheckCircle, Eye, Ban, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import RejectDialog from "@/components/RejectDialog";
import CreateStudentDialog from "@/components/CreateStudentDialog";
import { confirmToast } from "@/components/ui/confirmToast";
import VerifySelectionDialog from "@/components/school/VerifySelectionDialog";
import SelectionStatusBadge from "@/components/SelectionStatusBadge";

const List = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const page = Number(searchParams.get("page")) || 1;
  const {
    schools: students,
    registerStudent,
    fetchStudents,
    verifyRegistration,
    rejectRegistration,
    verifySelection,
    rejectSelection,
    loading,
  } = useSchoolStudent();
  const { user } = useAuthStore();

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage, search, status });
  };

  const statusFilter = [
    {
      value: "",
      label: "Semua",
      onSelect: () => {
        setStatus("");
        setSearchParams({ page: 1, search, status: "" });
      },
    },
    {
      value: "verify",
      label: "Menunggu Verifikasi",
      onSelect: () => {
        setStatus("verify");
        setSearchParams({ page: 1, search, status: "verify" });
      },
    },
    {
      value: "data_received_awaiting_selection",
      label: "Data Diterima, Menunggu Seleksi",
      onSelect: () => {
        setStatus("data_received_awaiting_selection");
        setSearchParams({
          page: 1,
          search,
          status: "data_received_awaiting_selection",
        });
      },
    },
    {
      value: "passed_selection",
      label: "Lulus Seleksi",
      onSelect: () => {
        setStatus("passed_selection");
        setSearchParams({ page: 1, search, status: "passed_selection" });
      },
    },
    {
      value: "failed_selection",
      label: "Gagal Seleksi",
      onSelect: () => {
        setStatus("failed_selection");
        setSearchParams({ page: 1, search, status: "failed_selection" });
      },
    },
    {
      value: "rejected_data_does_not_match",
      label: "Ditolak (Data Tidak Sesuai)",
      onSelect: () => {
        setStatus("rejected_data_does_not_match");
        setSearchParams({
          page: 1,
          search,
          status: "rejected_data_does_not_match",
        });
      },
    },
  ];

  const handleVerify = async (schoolStudentId) => {
    confirmToast({
      message: "Apakah Anda yakin?",
      onConfirm: async () => {
        await verifyRegistration(schoolStudentId);
        await fetchStudents(page, search, status, user?.school_id);
      },
      onCancel: () => {
        console.log("cancel");
      },
    });
  };

  const handleReject = async (schoolStudentId, note) => {
    await rejectRegistration(schoolStudentId, note);
    await fetchStudents(page, search, status, user?.school_id);
  };

  const handleVerifySelection = async (schoolStudentId, destinationClass) => {
    confirmToast({
      message: "Apakah Anda yakin?",
      onConfirm: async () => {
        await verifySelection(schoolStudentId, destinationClass);
        await fetchStudents(page, search, status, user?.school_id);
      },
      onCancel: () => {
        console.log("cancel");
      },
    });
  };

  const handleRejectSelection = async (schoolStudentId, note) => {
    await rejectSelection(schoolStudentId, note);
    await fetchStudents(page, search, status, user?.school_id);
  };

  const handleCreateStudent = async (data) => {
    await registerStudent(user?.school_id, data);
    await fetchStudents(page, search, status, user?.school_id);
  };

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await fetchStudents(page, search, status, user?.school_id);
    }, 500); // debounce 500ms

    return () => clearTimeout(timeout);
  }, [fetchStudents, page, search, status, user?.school_id]);

  return (
    <DashboardLayout>
      <LoadingOverlay isLoading={loading} />
      <h1 className="text-2xl font-bold">Daftar Siswa</h1>
      <div className="flex items-center justify-between gap-4">
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSearchParams({ search: e.target.value, page: 1 });
          }}
          placeholder="Cari nama siswa/no. registrasi/nisn..."
          className="my-4 w-full"
        />
        <Dropdown
          theme={{
            bg: "bg-blue-100 dark:bg-[#1f2d3a]",
            hover: "hover:bg-blue-200 dark:hover:bg-white/10",
            text: "text-gray-600 dark:text-white",
          }}
          trigger={
            <button className="flex items-center gap-2 bg-blue-200 hover:bg-blue-300 dark:bg-gray-600 dark:hover:bg-white/10 p-2 rounded-md">
              <Filter size={16} />
            </button>
          }
          items={statusFilter}
        />
        <CreateStudentDialog onSubmit={(data) => handleCreateStudent(data)} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="dark:text-white">No</TableHead>
            <TableHead className="dark:text-white">No. Registrasi</TableHead>
            <TableHead className="dark:text-white">Nama Siswa</TableHead>
            <TableHead className="dark:text-white">NISN</TableHead>
            <TableHead className="dark:text-white">Gelombang</TableHead>
            <TableHead className="dark:text-white">Status</TableHead>
            <TableHead className="dark:text-white">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students?.data?.map((schoolStudent, index) => (
            <TableRow key={schoolStudent.id}>
              <TableCell className="dark:text-white">
                {students.from + index}
              </TableCell>
              <TableCell className="dark:text-white">
                {schoolStudent?.registration_number}
              </TableCell>
              <TableCell className="dark:text-white">
                {schoolStudent.student.name?.split(" ").slice(0, 2).join(" ")}
              </TableCell>
              <TableCell className="dark:text-white">
                {schoolStudent.student.nisn}
              </TableCell>
              <TableCell className="dark:text-white">
                {schoolStudent?.wave?.name}
              </TableCell>
              <TableCell className="dark:text-white">
                <SelectionStatusBadge status={schoolStudent?.selection_status} />
              </TableCell>
              <TableCell className="flex gap-2">
                {schoolStudent?.selection_status === "verify" && schoolStudent.student.status === "active" && (
                  <>
                    <Button
                      className="bg-teal-500 text-white hover:bg-teal-400"
                      onClick={() => handleVerify(schoolStudent.id)}
                    >
                      <CheckCircle size={16} />
                    </Button>
                    <RejectDialog
                      onConfirm={(note) => handleReject(schoolStudent.id, note)}
                      triggerLabel={<Ban className="w-4 h-4" />}
                    />
                  </>
                )}
                {schoolStudent?.selection_status ===
                  "rejected_data_does_not_match" && (
                  <Button
                    className="bg-teal-500 text-white hover:bg-teal-400"
                    onClick={() => handleVerify(schoolStudent.id)}
                  >
                    <CheckCircle size={16} />
                  </Button>
                )}
                {schoolStudent?.selection_status ===
                  "data_received_awaiting_selection" && (
                  <>
                    <VerifySelectionDialog
                      triggerLabel={
                        <Button className="bg-teal-500 text-white hover:bg-teal-400">
                          <CheckCircle size={16} />
                        </Button>
                      }
                      onConfirm={(destinationClass) =>
                        handleVerifySelection(schoolStudent.id, destinationClass)
                      }
                    />
                    <RejectDialog
                      onConfirm={(note) =>
                        handleRejectSelection(schoolStudent.id, note)
                      }
                      triggerLabel={<Ban className="w-4 h-4" />}
                    />
                  </>
                )}
                {schoolStudent?.student.status === "inactive" && (
                  <Link
                    className="bg-sky-500 text-white hover:bg-sky-600 px-4 py-2 rounded-md"
                    to={`/school/student/${schoolStudent.student.id}/edit`}
                  >
                    <Pencil size={16} />
                  </Link>
                )}
                <Link
                  className="bg-sky-500 text-white hover:bg-sky-600 px-4 py-2 rounded-md"
                  to={`/school/student/${schoolStudent.student.id}/show`}
                >
                  <Eye size={16} />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        className="bg-sky-200 dark:bg-sky-900 hover:bg-sky-300 dark:hover:bg-sky-700"
        pagination={students}
        onPageChange={handlePageChange}
      />
    </DashboardLayout>
  );
};

export default List;
