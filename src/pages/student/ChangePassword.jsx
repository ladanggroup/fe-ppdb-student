import { useState } from "react";
import DashboardLayout from "@/layouts/student/DashboardLayout";
import { Button } from "@/components/ui/button";
import { showError, showSuccess } from "@/components/ui/toastSonner";
import useAuthStore from "@/store/authStore";
import useStudentStore from "@/store/useStudentStore";
import PasswordField from "@/components/PasswordField";
import { Link } from "react-router";
import { KeyRound } from "lucide-react";
import { User } from "lucide-react";

export default function ChangePassword() {
  const { user } = useAuthStore();
  const { updatePassword, loading } = useStudentStore();

  const [form, setForm] = useState({
    old_password: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi sederhana di sisi frontend
    const newErrors = {};
    if (!form.old_password)
      newErrors.old_password = "Password lama wajib diisi";
    if (!form.password)
      newErrors.password = "Password baru wajib diisi";
    if (form.password.length < 6)
      newErrors.password = "Password minimal 6 karakter";
    if (form.password !== form.password_confirmation)
      newErrors.password_confirmation = "Konfirmasi password tidak cocok";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await updatePassword(user.id, form);
      showSuccess("Password berhasil diperbarui");
      setForm({
        old_password: "",
        password: "",
        password_confirmation: "",
      });
      setErrors({});
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.old_password ||
        "Gagal memperbarui password";
      showError(msg);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
          <div className="relative group">
            {user.image ? (
              <img
                src={
                  user.image ||
                  "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                }
                alt="avatar"
                className="w-40 h-40 rounded-lg object-cover border"
              />
            ) : (
              <div className="w-40 h-40 rounded-lg border flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500">
                No Image
              </div>
            )}
          </div>

          <div className="mt-6 w-full">
            <nav className="space-y-2">
              <Link
                to={"/student/profile"}
                className="block w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
              >
                <User className="inline mr-2" />
                Informasi Pribadi
              </Link>
              <button className="w-full text-left px-4 py-2 rounded-md bg-orange-100 text-orange-700 font-medium">
                <KeyRound className="inline mr-2" />
                Ubah Password
              </button>
            </nav>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full md:w-3/4 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow p-6"
        >
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            Ubah Password
          </h2>
          <PasswordField
            id="old_password"
            label="Password Lama"
            name="old_password"
            value={form.old_password}
            onChange={handleChange}
            error={errors.old_password}
            placeholder="Masukkan password lama"
            required
          />
          <PasswordField
            id="password"
            label="Password Baru"
            name="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Masukkan password baru"
            required
          />
          <PasswordField
            id="password_confirmation"
            label="Konfirmasi Password Baru"
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            error={errors.password_confirmation}
            placeholder="Konfirmasi password baru"
            required
          />

          <div className="flex justify-end mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
