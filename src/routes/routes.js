import { lazy } from "react";

const routes = [
  {
    path: "/",
    element: lazy(() => import("@/pages/landingPage/Home")),
  },
  {
    path: ":slug/announcement",
    element: lazy(() => import("@/pages/landingPage/Announcement")),
  },
  {
    path: ":slug",
    element: lazy(() => import("@/pages/student/Dashboard/School")),
  },

  // Student Routes
  {
    path: "/student",
    element: lazy(() => import("@/middleware/AuthGuard")),
    children: [
      {
        path: ":slug/complete-registration",
        element: lazy(() =>
          import("@/pages/student/auth/CompleteRegister")
        ),
      },
      {
        path: "selection",
        element: lazy(() => import("@/pages/student/Dashboard/StudentSelection")),
      },
      {
        path: "profile",
        element: lazy(() => import("@/pages/student/Profile")),
      },
      {
        path: "change-password",
        element: lazy(() => import("@/pages/student/ChangePassword")),
      },
    ],
  },

  /* auth */
  {
    path: "/student/:slug/login",
    element: lazy(() => import("@/pages/student/auth/Login")),
  },
  {
    path: "/student/:slug/register",
    element: lazy(() => import("@/pages/student/auth/Register")),
  },
    {
    path: "/student/login",
    element: lazy(() => import("@/pages/student/auth/Login")),
  },
  {
    path: "/unauthorized",
    element: lazy(() => import("@/pages/Unauthorized")),
  },
];

export default routes;
