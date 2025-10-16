import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Edit, Trash2, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import useWaveStore from "@/store/useWaveStore";
import useAuthStore from "@/store/authStore";
import useDocumentRequirementStore from "@/store/useDocumentRequirementStore";
import formatIdr from "@/utils/formatIdr";
import Pagination from "@/components/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Wave = () => {
  const { waves, fetchWaves, createWave, updateWave, deleteWave, loading } =
    useWaveStore();
  const { documentRequirements, fetchDocumentRequirements } =
    useDocumentRequirementStore();
  const { user } = useAuthStore();
  const schoolId = user?.school?.id;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = searchParams.get("page") || 1;

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    start_date: "",
    end_date: "",
    quota: "",
    description: "",
    price: "",
    status: "open",
  });
  const [selectedDocs, setSelectedDocs] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      if (schoolId) {
        await fetchWaves(schoolId, page);
        await fetchDocumentRequirements(1, schoolId);
      }
    };
    loadData();
  }, [fetchWaves, fetchDocumentRequirements, schoolId, page]);

  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      start_date: "",
      end_date: "",
      quota: "",
      description: "",
      price: "",
      status: "open",
    });
    setSelectedDocs([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        school_id: schoolId,
        document_requirements: selectedDocs,
      };

      if (formData.id) {
        await updateWave(formData.id, payload);
        showSuccess("Gelombang berhasil diperbarui");
      } else {
        await createWave(payload);
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
      status: wave.status || "open",
    });
    setSelectedDocs(
      wave.wave_document_requirements?.map(
        (item) => item.document_requirement_id
      ) || []
    );
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus gelombang ini?"))
      return;
    try {
      await deleteWave(id);
      showSuccess("Gelombang berhasil dihapus");
      fetchWaves(schoolId, page);
    } catch (error) {
      showError("Gagal menghapus gelombang");
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Gelombang Pendaftaran
            </h1>
            <p className="text-gray-500 text-sm">
              Kelola daftar gelombang dan persyaratannya
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white shadow-sm"
                onClick={resetForm}
              >
                <Plus className="w-4 h-4" />
                Tambah Gelombang
              </Button>
            </DialogTrigger>

            {/* Form Dialog */}
            <DialogContent className="max-w-lg w-full max-h-[95vh] overflow-y-auto bg-white dark:bg-[#1f2d3a] border border-sky-300 dark:border-white/10 rounded-xl p-6">
              <DialogHeader>
                <DialogTitle className="text-center text-lg font-semibold border-b dark:text-white pb-4">
                  {formData.id ? "Edit Gelombang" : "Tambah Gelombang"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label className="block dark:text-white mb-2">
                    Nama Gelombang
                  </Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: Gelombang 1"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="block dark:text-white mb-2">
                      Tanggal Mulai
                    </Label>
                    <Input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label className="block dark:text-white mb-2">
                      Tanggal Selesai
                    </Label>
                    <Input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="block dark:text-white mb-2">Kuota</Label>
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
                    <Label className="block dark:text-white mb-2">Harga</Label>
                    <Input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Masukkan harga pendaftaran"
                      required
                    />
                    <span className="block mt-1 text-sm text-gray-500">
                      {formData.price ? formatIdr(formData.price) : "Rp 0"}
                    </span>
                    <p className="text-xs text-red-500 italic mt-1">
                      *Harga yang tercantum hanya harga pendaftaran
                    </p>
                  </div>
                </div>

                {formData.id && (
                  <div>
                    <Label className="block dark:text-white mb-2">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem className="hover:bg-sky-100" value="open">
                          Dibuka
                        </SelectItem>
                        <SelectItem className="hover:bg-sky-100" value="closed">
                          Ditutup
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Dokumen Persyaratan */}
                <div>
                  <Label className="block dark:text-white mb-2">
                    Dokumen Persyaratan
                  </Label>
                  <div className="border rounded-md p-3 bg-white max-h-40 overflow-y-auto">
                    {documentRequirements?.data?.length > 0 ? (
                      <div className="grid grid-cols-3 gap-y-2">
                        {documentRequirements.data.map((doc) => (
                          <label
                            key={doc.id}
                            className="flex items-center space-x-2 text-sm cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedDocs.includes(doc.id)}
                              onChange={(e) =>
                                setSelectedDocs((prev) =>
                                  e.target.checked
                                    ? [...prev, doc.id]
                                    : prev.filter((id) => id !== doc.id)
                                )
                              }
                            />
                            <span>{doc.name}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Tidak ada dokumen persyaratan.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="block dark:text-white mb-2">
                    Keterangan (opsional)
                  </Label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="bg-white"
                    placeholder="Tambahkan catatan atau deskripsi gelombang..."
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
                  <Button type="submit" className="bg-sky-600 hover:bg-sky-500">
                    {formData.id ? "Update" : "Simpan"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* List Gelombang */}
        {loading ? (
          <p>Loading...</p>
        ) : waves?.data?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {waves.data.map((wave) => {
              const totalRegistered = wave.school_students?.length || 0;
              const remainingQuota = wave.quota - totalRegistered;
              return (
                <div
                  key={wave.id}
                  className="rounded-xl p-5 bg-sky-200 dark:bg-[#1f2d3a] border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {wave.name}
                    </h2>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        wave.status === "open"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {wave.status === "open" ? "Dibuka" : "Ditutup"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    {new Date(wave.start_date).toLocaleDateString("id-ID")} -{" "}
                    {new Date(wave.end_date).toLocaleDateString("id-ID")}
                  </p>

                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Harga: {formatIdr(wave.price)}
                  </p>
                  <p className="text-sm font-semibold mb-3 text-gray-600 dark:text-gray-300">
                    Kuota: <b>{remainingQuota}</b> / {wave.quota}
                  </p>

                  {wave.wave_document_requirements?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-semibold mb-1">
                        Dokumen Persyaratan:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {wave.wave_document_requirements.map((doc) => (
                          <span
                            key={doc.id}
                            className="text-xs bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-200 px-2 py-1 rounded-md"
                          >
                            {doc.document_requirement?.name || "-"}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-sm font-semibold mb-1">Keterangan:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                    {wave.description || "Tidak ada keterangan."}
                  </p>

                  <div className="flex justify-end gap-2">
                    <Button
                      className="bg-teal-500 text-white hover:bg-teal-400 px-3"
                      onClick={() =>
                        navigate(`/school/wave/${wave.id}/show`, {
                          state: { wave },
                        })
                      }
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      className="px-3"
                      onClick={() => handleEdit(wave)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {wave.school_students?.length === 0 && (
                      <Button
                        variant="destructive"
                        className="px-3"
                        onClick={() => handleDelete(wave.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>Tidak ada gelombang</p>
        )}
      </div>

      <Pagination
        pagination={waves}
        onPageChange={(p) => setSearchParams({ page: p })}
        className="bg-sky-200 dark:bg-sky-900 hover:bg-sky-300 dark:hover:bg-sky-700"
      />
    </DashboardLayout>
  );
};

export default Wave;
