// src/pages/admin/Bank/BankList.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Outlet } from "react-router";
import DashboardLayout from "@/layouts/admin/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BankModal from "@/components/AddBankModal";
import useBankStore from "@/store/useBankStore";
import Pagination from "@/components/Pagination";
import LoadingOverlay from "@/components/LoadingOverlay";

const BankList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const {
    fetchListBankAdmin,
    banksAdmin,
    loading,
    error,
    createBankAdmin,
    showBankAdmin,
    updateBankAdmin,
    destroyBankAdmin,
  } = useBankStore();
  const [formData, setFormData] = useState({
    bank_name: "",
    account_number: "",
    account_name: "",
    is_active: true,
  });
  // ambil page dari URL, default 1
  const page = Number(searchParams.get("page")) || 1;
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState(null);

  const reset = () => {
    setFormData({
      bank_name: "",
      account_number: "",
      account_name: "",
      is_active: true,
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage, search });
  };

  const handleDelete = (bankId) => {
    if (window.confirm("Anda yakin ingin menghapus bank ini?")) {
      destroyBankAdmin(bankId);
      fetchListBankAdmin(page, search);
    }
  };

  const handleCreate = async () => {
    await createBankAdmin(formData);
    reset();
    fetchListBankAdmin(page, search);
  };

  const handleUpdate = async (bankId) => {
    await updateBankAdmin(bankId, formData);
    reset();
    fetchListBankAdmin(page, search);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShow = async (bankId) => {
    const data = await showBankAdmin(bankId); // asumsi ini return detail
    if (data) {
      setFormData({
        bank_name: data.name,
        account_number: data.account_number,
        account_name: data.account_name,
        is_active: data.is_active,
      });
    }
  };

  const handleOpen = async (edit = false, bankId = null) => {
    if (edit && bankId) {
      setUpdate(true);
      setSelectedBankId(bankId);
      await handleShow(bankId);
    } else {
      setUpdate(false);
      setSelectedBankId(null);
      reset();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUpdate(false);
    reset();
    fetchListBankAdmin(page, search);
  };

  useEffect(() => {
    fetchListBankAdmin(page, search);
  }, [fetchListBankAdmin, page, search]);

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
          className="bg-teal-500 text-white hover:bg-teal-600 px-4 py-2 rounded-lg"
        >
          Tambah Bank Baru
        </Button>
      </div>

      {loading ? (
        <LoadingOverlay />
      ) : banksAdmin.length === 0 ? (
        <p className="text-gray-500">Tidak ada bank ditemukan.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banksAdmin.data?.map((bank) => (
            <Card
              key={bank.id}
              className="bg-teal-50 dark:bg-[#1f2d3a] border border-slate-300 dark:border-white/10"
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
                  className="bg-teal-500 text-white hover:bg-teal-600"
                  onClick={() => handleOpen(true, bank.id)} // edit
                >
                  Edit
                </Button>
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

      <BankModal
        title={update ? "Edit Data Bank" : "Tambah Data Bank"}
        onSubmit={update ? () => handleUpdate(selectedBankId) : handleCreate}
        handleChange={handleChange}
        formData={formData}
        setFormData={setFormData}
        open={open}
        setOpen={handleClose}
        update={update}
        loading={loading}
      />

      {/* Pagination */}
      <Pagination
        pagination={error ? null : banksAdmin}
        onPageChange={handlePageChange}
      />
      <Outlet />
    </DashboardLayout>
  );
};

export default BankList;
