import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/school/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useParams, useNavigate } from "react-router";
import useSchoolStore from "@/store/useSchoolStore";
import useAuthStore from "@/store/authStore";
import { toast } from "sonner";
import PasswordField from "@/components/PasswordField";

const Edit = () => {
  const { id } = useParams(); // ambil id user dari route /users/:id/edit
  const navigate = useNavigate();
  const { showUserSchool, updateUserSchool, updatePassword, loading } =
    useSchoolStore();
  const { user } = useAuthStore();
  const [buttonPassword, setButtonPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nip: "",
    roles: "",
    status: "",
    password: "",
    password_confirmation: "",
  });

  // ambil data user saat mount
  useEffect(() => {
    const getUser = async () => {
      const data = await showUserSchool(id);
      if (data) {
        setFormData({
          name: data.name || "",
          email: data.email || "",
          nip: data.nip || "",
          roles: data.roles || "",
          status: data.status || "",
        });
      }
    };
    if (id) getUser();
  }, [id, showUserSchool]);

  // handle input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      await updateUserSchool(id, formData);
      toast.success("Data pengguna berhasil diperbarui");
      navigate("/school/dashboard"); // redirect ke list
    } catch (err) {
      toast.error("Gagal memperbarui data");
      setErrors(err.response.data.errors);
      console.error(err);
    }
  };

  const handleOpenButtonPassword = () => {
    setButtonPassword(!buttonPassword);
  };

  const handleCloseButtonPassword = () => {
    setButtonPassword(false);
    setFormData({ ...formData, password: "", password_confirmation: "" });
  };

const handleUpdatePassword = async (e) => {
  e.preventDefault();
  setErrors({});

  const res = await updatePassword(user.id, {
    password: formData.password,
    password_confirmation: formData.password_confirmation,
  });

  if (res && res.message) {
    toast.success(res.message); // pesan dari backend
    navigate("/school/dashboard");
  } else {
    toast.error("Gagal memperbarui password");
  }
};

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-xl font-semibold text-left mb-4">Edit Pengguna</h1>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-sky-100 dark:bg-gray-800 p-6 grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl shadow"
          >
            <div className="col-span-2 md:col-span-1">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan email"
                required
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <Label htmlFor="nip">NIP</Label>
              <Input
                id="nip"
                name="nip"
                value={formData.nip}
                onChange={handleChange}
                placeholder="Masukkan NIP"
                required
              />
            </div>
            {user?.roles === "kepala_sekolah" && (
              <>
                <div>
                  <Label htmlFor="roles">Role</Label>
                  <select
                    id="roles"
                    name="roles"
                    value={formData.roles}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 bg-white text-gray-800"
                    required
                  >
                    <option value="admin_sekolah">Admin Sekolah</option>
                    <option value="kepala_sekolah">Kepala Sekolah</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 bg-white text-gray-800"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                  </select>
                </div>
              </>
            )}
            <div className="col-span-2 flex justify-end">
              <Button
                type="submit"
                className="bg-sky-500 hover:bg-sky-600 text-white"
              >
                Simpan Perubahan
              </Button>
            </div>
          </form>
        )}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
          </div>
        ) : (
          buttonPassword !== true && (
            <Button
              onClick={handleOpenButtonPassword}
              className="bg-sky-500 hover:bg-sky-600 text-white mt-4 flex gap-2 w-full justify-center"
            >
              Ubah Password
            </Button>
          )
        )}
        {buttonPassword && (
          <div className="space-y-4 bg-sky-100 dark:bg-gray-800 p-6 grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl mt-4 shadow">
            {/* Password */}
            <PasswordField
              label="Password"
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={errors?.password && errors.password[0]}
              placeholder="Password"
              required
            />

            {/* Konfirmasi Password */}
            <PasswordField
              label="Konfirmasi Password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              placeholder="Konfirmasi Password"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password_confirmation: e.target.value,
                })
              }
              error={
                errors?.password_confirmation && errors.password_confirmation[0]
              }
              required
            />

            {/* tombol password (simpan & batal) di kanan bawah */}
            <div className="col-span-2 flex justify-end gap-3">
              <Button
                type="submit"
                className="bg-sky-500 hover:bg-sky-600 text-white"
                onClick={handleUpdatePassword}
              >
                Simpan Perubahan
              </Button>
              <Button variant="destructive" onClick={handleCloseButtonPassword}>
                Batal
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Edit;
