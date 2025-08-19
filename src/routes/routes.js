import { lazy } from "react";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const dashboardSchool = lazy(() => import("@/pages/school/Dashboard"));

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
    element: lazy(() => import("@/middleware/AuthGuard")),
    children: [
      {
        path: "dashboard",
        element: dashboardSchool,
      },
      {
        path: "setting",
        element: lazy(() => import("@/pages/school/Setting")),
      },
    ],
  },

  // Student Routes
  {
    path: "/student",
    element: lazy(() => import("@/middleware/AuthGuardStudent")),
    children: [
      {
        path: "dashboard",
        element: lazy(() => import("@/pages/student/Dashboard")),
      },
    ],
  },

  //admin routes
  {
    path: "/admin",
    element: lazy(() => import("@/middleware/AuthGuard")),
    children: [
      {
        path: "dashboard",
        element: lazy(() => import("@/pages/admin/Dashboard")),
      },
      // {
      //   path: "setting",
      //   element: lazy(() => import("@/pages/admin/Setting")),
      // },
      {
        path: "product",
        children: [
          {
            index: true,
            element: lazy(() => import("@/pages/admin/Product/List")),
          },
          {
            path: "create",
            element: lazy(() => import("@/pages/admin/Product/Create")),
          },
          {
            path: ":id/edit",
            element: lazy(() => import("@/pages/admin/Product/Edit")),
          },
        ],
      },
      // {
      //   path: "product/create",
      //   element: lazy(() => import("@/pages/admin/Product/Create")),
      // },
    ],
  },

  /* auth */
  {
    path: "/login/admin",
    element: lazy(() => import("@/pages/admin/auth/Login")),
  },
  {
    path: "/login/student",
    element: lazy(() => import("@/pages/student/auth/Login")),
  },
  {
    path: "/login/school",
    element: lazy(() => import("@/pages/school/auth/Login")),
  },
  {
    path: "/register/school",
    element: lazy(() => import("@/pages/school/auth/Register")),
  },
  {
    path: "/complete-registration/school",
    element: lazy(() => import("@/pages/school/auth/CompleteRegistration")),
  },

  {
    path: "/unauthorized",
    element: lazy(() => import("@/pages/Unauthorized")),
  },
];

export default routes;
