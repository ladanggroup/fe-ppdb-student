import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
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
  const { loginAdmin, errors, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await loginAdmin({ email, password });
    if (response) {
      showSuccess("Login berhasil");
    } else {
      showError(errors || "Login gagal");
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
              src="/logo.png" // Ganti dengan logo siswa jika perlu
              alt="Logo PPDB"
              className="h-10 mb-2"
            />
            <CardTitle className="text-center">Portal Admin</CardTitle>
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors?.password && errors.password[0]}
                required
                className="bg-blue-50"
              />

              {/* <div className="text-right">
                <Link
                  to="/student/auth/forgot-password"
                  className="text-sm text-[#2F80ED] hover:underline"
                >
                  Lupa Password?
                </Link>
              </div> */}

              <div className="flex flex-col gap-2 mt-4">
                <Button
                  type="submit"
                >
                  Masuk
                </Button>
                {/* <Link
                  to="/"
                  className="w-full text-center bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-md font-semibold"
                >
                  Kembali
                </Link> */}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Login;
