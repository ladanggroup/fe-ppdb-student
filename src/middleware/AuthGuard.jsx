// src/middleware/authGuard.jsx
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import useAuthStore from "@/store/authStore";

const AuthGuard = ({ allowedRoles = ["admin", "school", "student"] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, restoreAuth, user, role } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await restoreAuth();
      } catch (error) {
        console.error("Auth restore error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [restoreAuth]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Memeriksa otentikasi...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Cek kondisi spesifik per-role
  if (role === "admin" && user?.email_verified_at === null) {
    return <Navigate to="/admin/resend-email" replace />;
  }

  if (
    role === "school" &&
    user?.status !== "active" &&
    location.pathname !== "/school/complete-registration"
  ) {
    return <Navigate to="/school/complete-registration" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
