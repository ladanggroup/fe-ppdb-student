import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import useSchoolStore from "@/store/useSchoolStore";
import { showError, showSuccess } from "../ui/toastSonner";

const UserModal = ({ open, onClose, setForm, form, update, schoolId, page }) => {
  const { createUserSchool, updateUserSchool, fetchSchoolUser } =
    useSchoolStore();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      if (update) {
        await updateUserSchool(form.id, form);
      } else {
        await createUserSchool({ ...form, school_id: schoolId });
      }
      fetchSchoolUser(schoolId, page);
      onClose();
      showSuccess("Data berhasil disimpan");
    } catch (err) {
      if (err.response?.status === 422) {
        // Ambil pesan dari backend (bisa array atau string)
        const errors = err.response.data.errors;
        if (errors) {
          // contoh ambil pesan pertama
          const firstError = Object.values(errors)[0][0];
          showError(firstError);
        } else {
          showError(err.response.data.message || "Validasi gagal");
        }
      } else {
        showError(err.response?.data?.message || "Terjadi kesalahan");
      }
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-center border-b pb-4">
            {update ? "Edit Pengguna" : "Tambah Pengguna"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="nip">NIP</Label>
            <Input
              id="nip"
              name="nip"
              value={form.nip}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="roles">Role</Label>
            <Select
              value={form.roles}
              onValueChange={(val) =>
                setForm((prev) => ({ ...prev, roles: val }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Peran" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem className="hover:bg-sky-100" value="admin_sekolah">
                  Admin Sekolah
                </SelectItem>
                <SelectItem className="hover:bg-sky-100" value="kepala_sekolah">
                  Kepala Sekolah
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {update && (
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(val) =>
                  setForm((prev) => ({ ...prev, status: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem className="hover:bg-sky-100" value="active">
                    Aktif
                  </SelectItem>
                  <SelectItem className="hover:bg-sky-100" value="inactive">
                    Tidak Aktif
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="destructive" onClick={onClose}>
            Batal
          </Button>
          <Button
            onClick={handleSave}
            className="bg-sky-500 hover:bg-sky-600 text-white"
          >
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
