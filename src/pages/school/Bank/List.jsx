// src/pages/admin/Bank/BankList.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Outlet } from "react-router"; // Import Link dari react-router
import DashboardLayout from "@/layouts/school/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BankModal from "@/components/AddBankModal";
import useBankStore from "@/store/useBankStore";
import useAuthStore from "@/store/authStore";
import Pagination from "@/components/Pagination";
import LoadingOverlay from "@/components/LoadingOverlay";

const List = () => {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const {
    fetchListBanks,
    banks,
    loading,
    error,
    createBank,
    showBank,
    updateBank,
    destroyBank,
  } = useBankStore();
  const [formData, setFormData] = useState({
    bank_name: "",
    account_number: "",
    account_name: "",
    school_id: user?.school_id || null,
    is_active: true,
  });
  // ambil page dari URL, default 1
  const page = Number(searchParams.get("page")) || 1;
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);

  const reset = () => {
    setFormData({
      bank_name: "",
      account_number: "",
      account_name: "",
      is_active: true,
      school_id: user?.school_id || null,
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage, search });
  };

  const handleDelete = (bankId) => {
    if (window.confirm("Anda yakin ingin menghapus bank ini?")) {
      destroyBank(bankId);
      fetchListBanks(page, search);
    }
  };

  const handleCreate = async () => {
    await createBank(formData);
    reset();
    fetchListBanks(page, search, user?.school_id);
  };

  const handleUpdate = async (bankId) => {
    await updateBank(bankId, formData);
    reset();
    fetchListBanks(page, search, user?.school_id);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShow = async (bankId) => {
    const data = await showBank(bankId); // asumsi ini return detail
    if (data) {
      setFormData({
        bank_name: data.name,
        account_number: data.account_number,
        account_name: data.account_name,
        school_id: data.school_id,
        is_active: data.is_active,
      });
    }
  };

  const handleOpen = async (edit = false, bankId = null) => {
    if (edit === true && bankId !== null) {
      setUpdate(true);
      await handleShow(bankId); // ini akan isi formData
      setOpen(true);
    } else if (edit === false && bankId === null) {
      setUpdate(false);
      reset();
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setUpdate(false);
    reset();
    fetchListBanks(page, search, user?.school_id);
  };

  useEffect(() => {
    fetchListBanks(page, search, user?.school_id);
  }, [fetchListBanks, page, search, user?.school_id]);

  return (
    <DashboardLayout>
      {/* overlay loading */}
      {loading && <LoadingOverlay />}

      <div className="flex justify-between items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold">Daftar Bank</h1>
        {/* Search tanpa tombol */}
        <Input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSearchParams({ search: e.target.value, page: 1 });
          }}
          placeholder="Cari produk..."
          className="w-1/2 py-2 px-4 border border-gray-300 rounded-lg"
        />
        <Button
          onClick={() => handleOpen(false, null)}
          className="bg-sky-400 text-white hover:bg-sky-500 px-4 py-2 rounded-lg"
        >
          Tambah Bank Baru
        </Button>
        {update !== true && (
          <BankModal
            title="Tambah Data Bank"
            onSubmit={handleCreate}
            handleChange={handleChange}
            formData={formData}
            open={open}
            setOpen={handleClose}
            loading={loading}
            update={update}
          />
        )}
      </div>

      {loading ? (
        <LoadingOverlay />
      ) : banks.length === 0 ? (
        <p className="text-gray-500">Tidak ada bank ditemukan.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banks?.data?.map((bank) => (
            <Card
              key={bank.id}
              className="bg-sky-100 dark:bg-[#1f2d3a] border border-sky-300 dark:border-white/10"
            >
              <CardContent className="p-4 ">
                <h2 className="font-semibold text-lg">{bank.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Nama Pemilik: {bank.account_name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  No Rekening: {bank.account_number}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Status: {bank.is_active ? "Aktif" : "Tidak Aktif"}
                </p>
              </CardContent>
              <div className="flex justify-end p-4 gap-2">
                {/* Tombol Edit */}
                <Button
                  className="bg-sky-400 text-white hover:bg-sky-500"
                  onClick={() => handleOpen(true, bank.id)} // edit
                >
                  Edit
                </Button>
                {update !== false && (
                  <BankModal
                    title="Edit Data Bank"
                    onSubmit={() => handleUpdate(bank.id)}
                    handleChange={handleChange}
                    formData={formData}
                    setFormData={setFormData}
                    setOpen={handleClose}
                    open={open}
                    update={update}
                    loading={loading}
                    classNameSelectItem="hover:bg-sky-200 dark:hover:bg-gray-300"
                  />
                )}
                {/* Tombol Hapus */}
                <Button
                  onClick={() => handleDelete(bank.id)}
                  className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-lg"
                >
                  Hapus
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        pagination={error ? null : banks}
        className="mt-4 text-black bg-sky-200 dark:bg-sky-900 hover:bg-sky-300 dark:hover:bg-sky-700 border border-slate-300 dark:border-white/10 dark:text-white"
        onPageChange={handlePageChange}
      />
      <Outlet />
    </DashboardLayout>
  );
};

export default List;
