// src/middleware/authGuard.jsx
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import useAuthStore from "@/store/authStore";

const AuthGuard = ({
  allowedAbilities = ["admin", "kepala_sekolah", "admin_sekolah"],
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const {
    isAuthenticated,
    abilities,
    restoreAuth,
    user, // Gunakan user langsung dari store
    meSchool,
  } = useAuthStore.getState();
  const location = useLocation();

  // Periksa apakah user adalah admin
  const isAdmin = Array.isArray(abilities)
    ? abilities.includes("admin")
    : abilities === "admin";

  useEffect(() => {
    const checkAuthAndUser = async () => {
      try {
        // Restore auth jika belum authenticated
        if (!isAuthenticated) {
          await restoreAuth();
        }

        if (!isAdmin && !user?.school) {
          await meSchool();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndUser();
  }, [isAuthenticated, restoreAuth, abilities, meSchool, user, isAdmin]);

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

  // Jika abilities tidak cocok
  let allowed = false;

  if (Array.isArray(abilities)) {
    allowed = abilities.some((ab) => allowedAbilities.includes(ab));
  } else {
    allowed = allowedAbilities.includes(abilities);
  }

  if (!allowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Periksa status sekolah untuk non-admin
  if (!isAdmin && user?.status !== "active") {
    return <Navigate to="/complete-registration/school" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
