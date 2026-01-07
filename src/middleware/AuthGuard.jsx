// src/middleware/authGuard.jsx
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import useAuthStore from "@/store/authStore";

const AuthGuard = ({ allowedRoles = ["student"] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, restoreAuth, role } = useAuthStore();
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

  return <Outlet />;
};

export default AuthGuard;
