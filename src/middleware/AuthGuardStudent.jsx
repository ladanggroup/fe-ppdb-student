import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import useAuthStore from "@/store/authStore";

const AuthGuardStudent = ({
  allowedAbilities = ["siswa"],
}) => {
  const { isAuthenticated, abilities, restoreAuth } = useAuthStore.getState();
  const location = useLocation();

  useEffect(() => {
    // Restore token dan auth jika refresh
    if (!isAuthenticated) {
      restoreAuth();
    }
  }, [isAuthenticated, restoreAuth]);

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

  return <Outlet />;
};

export default AuthGuardStudent;