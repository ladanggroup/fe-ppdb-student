import { useState } from "react";
import useAuthStore from "@/store/authStore";
import { Link, useNavigate } from "react-router";
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
import { useEffect } from "react";
import PasswordField from "@/components/PasswordField";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginSchool, errors, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

// Tambahkan useEffect untuk mengecek isAuthenticated
useEffect(() => {
  if (isAuthenticated) {
    navigate("/school/dashboard", { replace: true });
  }
}, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await loginSchool({ email, password });
    setIsLoading(false);
  };


  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      <div className="flex h-screen items-center px-4">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle>Portal Sekolah</CardTitle>
            <CardDescription>Masuk untuk melanjutkan</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="mb-6">
                <Label
                  htmlFor="email"
                  className="block text-left mb-2 required"
                >
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errors?.email && <ErrorLabel message={errors?.email[0]} />}
              </div>
              <PasswordField
                label="Password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors?.password && errors?.password[0]}
                required
              />
              <div className="flex items-center justify-between">
                <Link to="/school/auth/forgot-password">Lupa Password?</Link>
                <Button type="submit">Masuk</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Login;
