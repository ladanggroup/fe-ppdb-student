import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import useDocumentRequirementStore from "@/store/useDocumentRequirementStore";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/layouts/school/DashboardLayout";
import useAuthStore from "@/store/authStore";
import { showSuccess } from "@/components/ui/toastSonner";
import { confirmToast } from "@/components/ui/confirmToast";
import Pagination from "@/components/Pagination";

export default function List() {
  const {
    documentRequirements,
    fetchDocumentRequirements,
    createDocumentRequirement,
    updateDocumentRequirement,
    destroyDocumentRequirement,
    loading,
  } = useDocumentRequirementStore();
  const { user } = useAuthStore((state) => state);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ doc_name: "", description: "", is_required: false, school_id: user?.school_id });
  const [editId, setEditId] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;

  useEffect(() => {
    fetchDocumentRequirements(page, user?.school_id);
  }, [fetchDocumentRequirements, page, user?.school_id]);

  const resetForm = () => {
    setFormData({ doc_name: "", description: "", is_required: false, school_id: user?.school_id });
    setEditId(null);
  };

  const handleSubmit = async () => {
    let success;
    if (editId) {
      success = await updateDocumentRequirement(editId, formData);
    } else {
      success = await createDocumentRequirement(formData);
    }
    if (success) {
      fetchDocumentRequirements(page, user?.school_id);
      showSuccess(editId ? "Dokumen syarat berhasil diperbarui" : "Dokumen syarat berhasil ditambahkan");
      setOpen(false);
      setFormData({ doc_name: "", description: "", is_required: false, school_id: user?.school_id });
      setEditId(null);
    }
  };

  // handle form input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  const handleEdit = (req) => {
    setFormData({ doc_name: req.name, description: req.description, is_required: req.is_required, school_id: user?.school_id });
    setEditId(req.id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    confirmToast({
      message: "Yakin ingin menghapus?",
      onConfirm: async () => {
        await destroyDocumentRequirement(id);
        fetchDocumentRequirements(page, user?.school_id);
      },
    })
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Dokumen syarat pendaftaran</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" onClick={resetForm}>+ Tambah</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-center border-b border-gray-800 pb-2 mb-6">
                  {editId ? "Edit Requirement" : "Tambah Requirement"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="block mb-2" htmlFor="doc_name">
                    Nama
                  </Label>
                  <Input
                    id="doc_name"
                    name="doc_name"
                    type="text"
                    value={formData.doc_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label className="block mb-2" htmlFor="description">
                    Keterangan<span className="text-gray-400">(Opsional)</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    rows={4}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    id="is_required"
                    type="checkbox"
                    name="is_required"
                    checked={formData.is_required}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onChange={handleChange}
                  />
                  <Label htmlFor="is_required">Wajib diunggah?</Label>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button variant="destructive" onClick={() => setOpen(false)}>
                  Batal
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Simpan"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>status</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documentRequirements.data?.length > 0 ? (
              documentRequirements.data.map((req, idx) => (
                <TableRow key={req.id}>
                  <TableCell>{documentRequirements.from + idx}</TableCell>
                  <TableCell>{req.name}</TableCell>
                  <TableCell>{req.is_required ? "Wajib" : "Opsional"}</TableCell>
                  <TableCell>{req.description}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="secondary" onClick={() => handleEdit(req)}>
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(req.id)}
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Belum ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <Pagination
          pagination={documentRequirements}
        className="mt-4 text-black bg-sky-200 dark:bg-sky-900 hover:bg-sky-300 dark:hover:bg-sky-700 border border-slate-300 dark:border-white/10 dark:text-white"
        onPageChange={handlePageChange}
        />
      </div>
    </DashboardLayout>
  );
}
