import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showError, showSuccess } from "@/components/ui/toastSonner";
import DashboardLayout from "@/layouts/school/DashboardLayout";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useWaveStore from "@/store/useWaveStore";
import useAuthStore from "@/store/authStore";
import formatIdr from "@/utils/formatIdr";
import Pagination from "@/components/Pagination";

const Wave = () => {
  const { waves, fetchWaves, createWave, updateWave, deleteWave, loading } =
    useWaveStore();
  const { user } = useAuthStore();
  const schoolId = user?.school?.id;
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const [open, setOpen] = useState(false); // kontrol dialog
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    start_date: "",
    end_date: "",
    quota: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (schoolId) {
        await fetchWaves(schoolId, page);
      }
    };
    fetchData();
  }, [fetchWaves, schoolId, page]);

  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      start_date: "",
      end_date: "",
      quota: "",
      description: "",
      price: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await updateWave(formData.id, formData);
        showSuccess("Gelombang berhasil diperbarui");
      } else {
        await createWave({ ...formData, school_id: schoolId });
        showSuccess("Gelombang berhasil ditambahkan");
      }
      setOpen(false);
      resetForm();
      fetchWaves(schoolId, page);
    } catch (error) {
      showError("Gagal menyimpan gelombang");
      console.error(error);
    }
  };

  const handleEdit = (wave) => {
    setFormData({
      id: wave.id,
      name: wave.name,
      start_date: wave.start_date,
      end_date: wave.end_date,
      quota: wave.quota,
      description: wave.description,
      price: wave.price,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus gelombang ini?")) {
      return;
    }
    try {
      await deleteWave(id);
      showSuccess("Gelombang berhasil dihapus");
      fetchWaves(schoolId, page);
    } catch (error) {
      showError("Gagal menghapus gelombang");
      console.error(error);
    }
  };
  console.log(waves);

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Daftar Gelombang</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" onClick={resetForm}>
                <Plus className="justify-self-center" />
                Tambah Gelombang
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-sky-100 dark:bg-[#1f2d3a] border border-sky-300 dark:border-white/10">
              <DialogHeader>
                <DialogTitle className="text-center border-b pb-4">
                  {formData.id ? "Edit Gelombang" : "Tambah Gelombang"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label className="block text-left mb-2">Nama Gelombang</Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Masukkan nama gelombang"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="block text-left mb-2">
                      Tanggal Mulai
                    </Label>
                    <Input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      placeholder="Masukkan tanggal mulai gelombang"
                      required
                    />
                  </div>
                  <div>
                    <Label className="block text-left mb-2">
                      Tanggal Selesai
                    </Label>
                    <Input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      placeholder="Masukkan tanggal selesai gelombang"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label className="block text-left mb-2">Kuota</Label>
                  <Input
                    type="number"
                    name="quota"
                    value={formData.quota}
                    onChange={handleChange}
                    placeholder="Masukkan kuota gelombang"
                    required
                  />
                </div>
                <div>
                  <Label className="block text-left mb-2">Harga</Label>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Masukkan harga gelombang"
                    required
                  />
                  <span className="block mt-1 text-sm text-gray-500 dark:text-gray-600">
                    {formData.price ? formatIdr(formData.price) : "Rp 0"}
                  </span>
                  <p className="text-sm text-red-500">
                    *Harga yang tercantum hanya harga pendaftaran
                  </p>
                </div>
                <div>
                  <Label className="block text-left mb-2">Deskripsi</Label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="bg-white"
                    rows={4}
                    placeholder="Masukkan deskripsi gelombang dan syarat-syarat pendaftaran"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button type="submit" variant="secondary">
                    {formData.id ? "Update" : "Simpan"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 text-gray-600 dark:text-white">
            {waves?.data?.map((wave) => (
              <div
                key={wave.id}
                className="rounded-lg p-4 bg-sky-100 dark:bg-[#1f2d3a] border border-sky-300 dark:border-white/10 shadow-sm"
              >
                <h2 className="text-lg font-semibold">{wave.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {wave.start_date} - {wave.end_date}
                </p>
                <p className="text-sm mt-2">Quota: {wave.quota}</p>
                <p className="text-sm">Harga: {formatIdr(wave.price)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {wave.description}
                </p>
                <div className="flex space-x-2 mt-3 justify-end">
                  <Button
                    variant="secondary"
                    className="flex items-center px-5 py-3"
                    onClick={() => handleEdit(wave)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex items-center px-5 py-3"
                    onClick={() => handleDelete(wave.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Pagination className="bg-sky-200 dark:bg-sky-900 hover:bg-sky-300 dark:hover:bg-sky-700" pagination={waves} onPageChange={handlePageChange} />
    </DashboardLayout>
  );
};

export default Wave;
