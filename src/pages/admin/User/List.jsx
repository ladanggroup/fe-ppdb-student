import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/admin/DashboardLayout";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Pagination from "@/components/Pagination";
import useAdminStore from "@/store/useAdminStore";
import useAuthStore from "@/store/authStore";
import { useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import UserAdminModal from "@/components/UserAdminModal";

const List = () => {
  const { admins, fetchAdmins, deleteAdmin, loading } = useAdminStore();
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
  });

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      email: "",
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
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (user) {
        fetchAdmins(page, search);
        setSearchParams({ page, search });
      }
    }, 500); // delay 500ms

    return () => clearTimeout(timeout);
  }, [search, user, fetchAdmins, page, setSearchParams]);

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus pengguna ini?")) {
      await deleteAdmin(id);
      fetchAdmins(page, search);
    }
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage, search });
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">Daftar Pengguna</h1>
        <div className="flex items-center gap-2 mb-2">
          <Input
            type="text"
            placeholder="Cari nama atau email ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="items-center flex-1"
          />
          <Button
            className="bg-teal-500 hover:bg-teal-600 text-white flex items-center"
            onClick={handleAdd}
          >
            <Plus className="w-4 h-4 mr-2" /> Tambah Pengguna
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
          </div>
        ) : admins?.data?.length === 0 ? (
          <p className="text-gray-600 dark:text-white">Belum ada pengguna.</p>
        ) : (
          <>
            <Table className="bg-teal-100 dark:bg-gray-800 mt-4 rounded-xl">
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins?.data?.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>{admins.from + index}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="flex items-center justify-center gap-2">
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
              pagination={admins}
              onPageChange={handlePageChange}
              className="bg-teal-200 dark:bg-teal-900 hover:bg-teal-300 dark:hover:bg-teal-700"
            />
          </>
        )}

        {/* Modal Tambah/Edit */}
        <UserAdminModal
          open={openModal}
          onClose={handleCloseModal}
          setForm={setForm}
          form={form}
          update={update}
          page={page}
        />
      </div>
    </DashboardLayout>
  );
};

export default List;
