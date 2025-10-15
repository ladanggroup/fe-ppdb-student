// src/pages/school/auth/RegisterSchool.jsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, Link } from "react-router";
import ErrorLabel from "@/components/ErrorLabel";
import PasswordField from "@/components/PasswordField";
import useSchoolStore from "@/store/useSchoolStore";
import { showError, showSuccess } from "@/components/ui/toastSonner";

const RegisterSchool = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    npsn: "",
    nip: "",
    school_name: "",
    roles: "kepala_sekolah",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { registerSchool } = useSchoolStore();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    const response = await registerSchool(form);
    if (response.status === "success") {
      showSuccess(response.message || "Registrasi berhasil!");
      navigate("/school/login", { replace: true });
    } else {
      showError(response.message || "Registrasi gagal.");
      setErrors(response.errors || {});
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-white">
      <Card className="w-full max-w-5xl shadow-md rounded-xl border dark:border-gray-700 dark:bg-gray-800">
        <CardHeader className="flex flex-col">
          <img
            src="/src/assets/logo ppdb.png"
            alt="Logo PPDB"
            className="w-24 rounded-full mb-2"
          />
          <CardTitle className="text-center text-2xl font-semibold text-gray-900 dark:text-white">
            Daftar Akun Sekolah
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama Penanggung Jawab */}
              <div>
                <Label className="mb-2 block text-left" htmlFor="name">
                  Nama
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nama Penanggung Jawab"
                  required
                />
                {errors.name && <ErrorLabel message={errors.name[0]} />}
              </div>

              {/* Email */}
              <div>
                <Label className="mb-2 block text-left" htmlFor="email">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Penanggung Jawab"
                  required
                />
                {errors.email && <ErrorLabel message={errors.email[0]} />}
              </div>

              {/* Password */}
              <PasswordField
                label="Password"
                id="password"
                name="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors?.password && errors.password[0]}
                placeholder="Password Penanggung Jawab"
                required
              />

              {/* Konfirmasi Password */}
              <PasswordField
                label="Konfirmasi Password"
                id="password_confirmation"
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={(e) =>
                  setForm({ ...form, password_confirmation: e.target.value })
                }
                error={
                  errors?.password_confirmation &&
                  errors.password_confirmation[0]
                }
                placeholder="Konfirmasi Password Penanggung Jawab"
                required
              />

              {/* Nama Sekolah */}
              <div>
                <Label className="mb-2 block text-left" htmlFor="school_name">
                  Nama Sekolah
                </Label>
                <Input
                  id="school_name"
                  name="school_name"
                  value={form.school_name}
                  onChange={handleChange}
                  placeholder="Nama Sekolah"
                  required
                />
                {errors.school_name && (
                  <ErrorLabel message={errors.school_name[0]} />
                )}
              </div>

              {/* NPSN */}
              <div>
                <Label className="mb-2 block text-left" htmlFor="npsn">
                  NPSN
                </Label>
                <Input
                  id="npsn"
                  name="npsn"
                  value={form.npsn}
                  onChange={handleChange}
                  placeholder="NPSN Sekolah"
                  required
                />
                {errors.npsn && <ErrorLabel message={errors.npsn[0]} />}
              </div>

              {/* Role */}
              <div>
                <Label className="mb-2 block text-left" htmlFor="roles">
                  Peran
                </Label>
                <select
                  id="roles"
                  name="roles"
                  value={form.roles}
                  onChange={handleChange}
                  placeholder="Peran"
                  className="w-full border rounded-md py-1.5 px-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="admin_sekolah">
                    Admin / Operator Sekolah
                  </option>
                  <option value="kepala_sekolah">Kepala Sekolah</option>
                </select>
                {errors.roles && <ErrorLabel message={errors.roles[0]} />}
              </div>

              {/* NIP */}
              <div>
                <Label className="mb-2 block text-left" htmlFor="nip">
                  NIP
                </Label>
                <Input
                  id="nip"
                  name="nip"
                  value={form.nip}
                  onChange={handleChange}
                  placeholder="NIP Penanggung Jawab"
                  required
                />
                {errors.nip && <ErrorLabel message={errors.nip[0]} />}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mendaftarkan..." : "Daftar"}
            </Button>

            <div className="mt-4 text-center dark:text-gray-300">
              Sudah punya akun?{" "}
              <Link
                to="/school/login"
                className="text-orange-600 hover:underline"
              >
                Masuk
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterSchool;
