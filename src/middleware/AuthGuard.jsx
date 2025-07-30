// src/middleware/authGuard.jsx
// import { useEffect } from "react";
// import { Navigate, Outlet, useLocation } from "react-router";
// import useAuthStore from "@/store/authStore";

// const AuthGuard = ({
//   allowedAbilities = [],
// }) => {
//   const { isAuthenticated, abilities, restoreAuth } = useAuthStore.getState();
//   const location = useLocation();

//   useEffect(() => {
//     // Restore token dan auth jika refresh
//     if (!isAuthenticated) {
//       restoreAuth();
//     }
//   }, [isAuthenticated, restoreAuth]);

//   if (!isAuthenticated) {
//     return <Navigate to="/" state={{ from: location }} replace />;
//   }

//   // Jika abilities tidak cocok
//   const allowed = allowedAbilities.includes(abilities);

//   if (!allowed) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return <Outlet />;
// };

// export default AuthGuard;

import { Navigate, Outlet, useLocation } from "react-router";
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";

export default function AuthGuard(allowedAbilities = []) {
  return function GuardComponent() {
    const location = useLocation();
    const { isAuthenticated, abilities, restoreAuth } = useAuthStore();

    useEffect(() => {
      if (!isAuthenticated) {
        restoreAuth();
      }
    }, [isAuthenticated, restoreAuth]);

    if (!isAuthenticated) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }

    const allowed = allowedAbilities.includes(abilities);
    if (!allowed) {
      return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
  };
}
