import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/school/DashboardLayout";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import UserModal from "@/components/school/UserModal";
import Pagination from "@/components/Pagination";
import useSchoolStore from "@/store/useSchoolStore";
import useAuthStore from "@/store/authStore";
import { useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

const List = () => {
  const { userSchool, fetchSchoolUser, deleteUserSchool, loading } =
    useSchoolStore();
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [openModal, setOpenModal] = useState(false);
  const [update, setUpdate] = useState(false);

  const page = searchParams.get("page") || 1;
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    nip: "",
    roles: "admin_sekolah",
    status: "",
  });

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      email: "",
      nip: "",
      roles: "admin_sekolah",
      status: "active",
    });
  };

  const handleAdd = () => {
    setUpdate(false);
    resetForm();
    setOpenModal(true);
  };

  const handleEdit = (user) => {
    setUpdate(true);
    setForm({
      id: user.id,
      name: user.name,
      email: user.email,
      nip: user.nip,
      roles: user.roles,
      status: user.status,
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (user?.school_id) {
        fetchSchoolUser(user.school_id, page, search);
        setSearchParams({ page, search });
      }
    }, 500); // delay 500ms

    return () => clearTimeout(timeout);
  }, [search, page, user?.school_id, fetchSchoolUser, setSearchParams]);

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus pengguna ini?")) {
      await deleteUserSchool(id);
      fetchSchoolUser(user.school_id, page, search);
    }
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage, search });
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">Pengguna Sekolah</h1>
        <div className="flex items-center gap-2 mb-2">
          <Input
            type="text"
            placeholder="Cari nama, email, atau NIP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="items-center flex-1"
          />
          <Button
            className="bg-sky-500 hover:bg-sky-600 text-white flex items-center"
            onClick={handleAdd}
          >
            <Plus className="w-4 h-4 mr-2" /> Tambah Pengguna
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
          </div>
        ) : userSchool?.data?.length === 0 ? (
          <p className="text-gray-600 dark:text-white">Belum ada pengguna.</p>
        ) : (
          <>
            <Table className="bg-sky-100 dark:bg-gray-800 mt-4 rounded-xl">
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>NIP</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userSchool?.data?.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>{userSchool.from + index}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.nip}</TableCell>
                    <TableCell>
                      <span className="capitalize">
                        {user.roles.replace("_", " ")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">
                        {user.status === "active" ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(user)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Pagination
              pagination={userSchool}
              onPageChange={handlePageChange}
              className="bg-sky-200 dark:bg-sky-900 hover:bg-sky-300 dark:hover:bg-sky-700"
            />
          </>
        )}

        {/* Modal Tambah/Edit */}
        <UserModal
          open={openModal}
          onClose={handleCloseModal}
          setForm={setForm}
          form={form}
          update={update}
          // user={selectedUser}
          schoolId={user?.school_id}
          page={page}
        />
      </div>
    </DashboardLayout>
  );
};

export default List;
