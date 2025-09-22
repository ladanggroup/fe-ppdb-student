import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import useAuthStore from "@/store/authStore";

export default function CreateStudentDialog({ onSubmit }) {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    student_name: "",
    email: "",
    nisn: "",
    registration_type: "new",
    school_id: user?.school_id || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setForm({ student_name: "", email: "", nisn: "", registration_type: "new" });
  }

  const handleSubmit = async () => {
    if (!form.student_name || !form.email || !form.nisn) return;
    setLoading(true);
    await onSubmit(form); // lempar data ke parent
    setLoading(false);
    setOpen(false);
    reset();
  };

  const handleCancel = () => {
    if(open) {
      setOpen(false);
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
    if (!isOpen) {
      handleCancel(); // otomatis close & reset form
    } else {
      setOpen(true); // buka modal
    }
  }}>
      <DialogTrigger asChild>
        <Button className="bg-sky-500 text-white hover:bg-sky-400">
          <UserPlus size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="border-b pb-4">Buat Akun Siswa</DialogTitle>
          <DialogDescription>
            Isi data siswa untuk membuat akun sementara. Password akan dikirim
            ke email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label>Nama</Label>
            <Input
              value={form.student_name}
              onChange={(e) => handleChange("student_name", e.target.value)}
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="contoh@mail.com"
              required
            />
          </div>
          <div>
            <Label>NISN</Label>
            <Input
              type="number"
              value={form.nisn}
              onChange={(e) => handleChange("nisn", e.target.value)}
              placeholder="Masukkan NISN"
              required
            />
          </div>
          <div>
            <SelectGroup>
              <SelectLabel>Jenis Pendaftaran</SelectLabel>
              <Select
                value={form.registration_type}
                onValueChange={(val) => handleChange("registration_type", val)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis pendaftaran" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem className="hover:bg-sky-200" value="new">
                    Siswa Baru
                  </SelectItem>
                  <SelectItem className="hover:bg-sky-200" value="transfer">
                    Siswa Pindahan
                  </SelectItem>
                </SelectContent>
              </Select>
            </SelectGroup>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button onClick={handleCancel}>Batal</Button>
          <Button
            className="bg-sky-500 text-white hover:bg-sky-400"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
