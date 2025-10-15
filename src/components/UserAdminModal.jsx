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
import useAdminStore from "@/store/useAdminStore";
import { showError, showSuccess } from "@/components/ui/toastSonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const UserAdminModal = ({ open, onClose, setForm, form, update, page }) => {
  const { createAdmin, updateAdmin, fetchAdmins } = useAdminStore();

  const handleChange = (nameOrEvent, value) => {
    if (typeof nameOrEvent === "string") {
      // untuk Select (name, value)
      setForm((prev) => ({ ...prev, [nameOrEvent]: value }));
    } else {
      // untuk input biasa (event)
      const { name, value } = nameOrEvent.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      if (update) {
        await updateAdmin(form.id, form);
      } else {
        await createAdmin(form);
      }
      fetchAdmins(page, "");
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
              placeholder="Masukkan Nama"
              required
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
              placeholder="Masukkan Email"
              required
            />
          </div>
          <div>
            <Label htmlFor="Roles">Roles</Label>
            <Select
              name="roles"
              value={form?.roles || ""}
              onValueChange={(value) => handleChange("roles", value)}
              required
            >
              <SelectTrigger className="bg-white text-gray-900">
                <SelectValue placeholder="Pilih Roles" />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-900">
                <SelectItem className="hover:bg-teal-100" value="admin">
                  Admin
                </SelectItem>
                <SelectItem className="hover:bg-teal-100" value="finance">
                  Keuangan
                </SelectItem>
                <SelectItem className="hover:bg-teal-100" value="super_admin">
                  Super Admin
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
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

export default UserAdminModal;
