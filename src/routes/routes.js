import { lazy, useState } from "react";
import authGuard from "@/middleware/AuthGuard";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const Login = lazy(() => import("@/pages/school/auth/Login"));
const SchoolDashboard = lazy(() => import("@/pages/school/Dashboard"));
// const [guardStudent, setGuardStudent] = useState(
//   authGuard({
//     allowedAbilities: ["siswa"],
//   })
// );
// const guardStudent = authGuard({
//   allowedAbilities: ["siswa"],
// });
// const Register = lazy(() => import('@/pages/Register'));

const routes = [
  {
    path: "/",
    element: LandingPage,
    // children: [
    //   {
    //     path: "/login/sekolah",
    //     element: Login,
    //   },
    // ],
  },

  // School Routes
  {
    path: "/school",
    element: authGuard(["admin_sekolah", "kepala_sekolah"]),
    children: [
      {
        path: "dashboard",
        element: SchoolDashboard,
      },
    ],
  },

  // Student Routes
  {
    path: "/student",
    element: authGuard(["siswa"]),
    children: [
      {
        path: "dashboard",
        element: lazy(() => import("@/pages/student/Dashboard")),
      },
    ],
  },
  {
    path: "/unauthorized",
    element: lazy(() => import("@/pages/Unauthorized")),
  },

  /* auth */
  // {
  //   path: "/login/admin",
  //   element: lazy(() => import("@/pages/admin/auth/Login")),
  // },
  {
    path: "/login/student",
    element: lazy(() => import('@/pages/student/auth/Login')),
  },
  {
    path: "/login/school",
    element: lazy(() => import("@/pages/school/auth/Login")),
  },
  //   {
  //     path: '/register',
  //     element: <Register />,
  //   },
];

export default routes;
