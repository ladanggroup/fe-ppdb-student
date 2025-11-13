import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, Link } from "react-router";
import ErrorLabel from "@/components/ErrorLabel";
import PasswordField from "@/components/PasswordField";
import useStudentStore from "@/store/useStudentStore";
import { useParams } from "react-router";

const RegisterStudent = () => {
  const { slug } = useParams();
  localStorage.setItem("slug", slug);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    nisn: "",
    registration_type: "new",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register } = useStudentStore();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    try {
      const response = await register(form);
      if (response) {
        navigate("/student/" + slug + "/login", { replace: true });
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors(err.response?.data?.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-white">
      <Card className="w-full max-w-5xl shadow-md rounded-xl border">
        <CardHeader className="flex flex-col">
          <img
            src="/src/assets/logo ppdb.png"
            alt="Logo PPDB"
            className="w-24 rounded-full mb-2"
          />
          <CardTitle className="text-center text-2xl font-semibold">
            Daftar Akun Siswa
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
                  placeholder="Nama Lengkap"
                  required
                />
                {errors?.name && <ErrorLabel message={errors?.name[0]} />}
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
                  placeholder="Masukkan Email"
                  required
                />
                {errors?.email && <ErrorLabel message={errors?.email[0]} />}
              </div>

              {/* Password */}
              <PasswordField
                label="Password"
                id="password"
                value={form.password}
                name="password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors?.password && errors.password[0]}
                required
                className="bg-blue-50"
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
                className="bg-blue-50"
                placeholder="Konfirmasi password"
                required
              />

              {/* NISN */}
              <div>
                <Label className="mb-2 block text-left" htmlFor="nisn">
                  NISN
                </Label>
                <Input
                  id="nisn"
                  name="nisn"
                  value={form.nisn}
                  onChange={handleChange}
                  placeholder="Masukkan NISN"
                  required
                />
                {errors?.nisn && <ErrorLabel message={errors?.nisn[0]} />}
              </div>

              {/* Tipe Pendaftaran */}
              <div>
                <Label
                  className="mb-2 block text-left"
                  htmlFor="registration_type"
                >
                  Tipe Pendaftaran
                </Label>
                <select
                  id="registration_type"
                  name="registration_type"
                  value={form.registration_type}
                  onChange={handleChange}
                  className="w-full border rounded-md py-1 px-3 h-9 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="new">Siswa Baru</option>
                  <option value="transfer">Siswa Pindahan</option>
                </select>
                {errors?.registration_type && (
                  <ErrorLabel message={errors?.registration_type[0]} />
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mendaftarkan..." : "Daftar"}
            </Button>
            <div className="mt-4 text-center">
              Sudah punya akun?{" "}
              <Link
                to={"/student/" + slug + "/login"}
                className="text-blue-600 hover:underline"
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

export default RegisterStudent;
