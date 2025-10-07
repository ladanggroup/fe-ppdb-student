import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import useAuthStore from "@/store/authStore";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LoadingOverlay from "@/components/LoadingOverlay";
import ErrorLabel from "@/components/ErrorLabel";
import PasswordField from "@/components/PasswordField";
import { showError, showSuccess } from "@/components/ui/toastSonner";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginSchool, errors, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/school/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await loginSchool({ email, password });
    if (response) {
      showSuccess("Login berhasil");
    } else {
      showError(response?.message || "Login gagal");
    }
    setIsLoading(false);
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      <div className="flex h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-lg rounded-xl">
          <CardHeader className="items-center">
            <img
              src="/src/assets/logo ppdb.png"
              alt="Logo PPDB"
              className="w-24 rounded-full mb-2"
            />
            <div className="flex border rounded-full overflow-hidden mb-4 w-full">
              <Link
                to="/login/school"
                className={`w-1/2 py-2 text-center font-semibold text-sm border-r hover:bg-orange-300 ${
                  location.pathname === "/login/school"
                    ? "bg-orange-400 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                Masuk
              </Link>
              <Link
                to="/register/school"
                className={`w-1/2 py-2 text-center font-semibold text-sm hover:bg-orange-300 ${
                  location.pathname === "/register/school"
                    ? "bg-orange-400 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                Daftar
              </Link>
            </div>
            <CardTitle className="text-center">Portal Sekolah</CardTitle>
            <CardDescription className="text-center">
              Masuk untuk melanjutkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="mb-1 block text-left">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan Email"
                  required
                  className="bg-blue-50"
                />
                {errors?.email && <ErrorLabel message={errors.email[0]} />}
              </div>

              <PasswordField
                label="Password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors?.password && errors.password[0]}
                required
                className="bg-blue-50"
              />

              <div className="text-right">
                <Link
                  to="/student/auth/forgot-password"
                  className="text-sm text-[#2F80ED] hover:underline"
                >
                  Lupa Password?
                </Link>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <Button
                  type="submit"
                >
                  Masuk
                </Button>
                <Link
                  to="/"
                  className="w-full text-center bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-md font-semibold"
                >
                  Kembali
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Login;
