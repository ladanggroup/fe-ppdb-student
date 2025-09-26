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
  {
    path: "/about",
    element: lazy(() => import("@/components/landingPage/About")),
  },
  {
    path: "/features",
    element: lazy(() => import("@/components/landingPage/Feature")),
  },
  {
    path: "/pricing",
    element: lazy(() => import("@/components/landingPage/Price")),
  },
  {
    path: "/announcement",
    element: lazy(() => import("@/components/landingPage/Announcement")),
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
      {
        path: "student",
        children: [
          {
            index: true,
            element: lazy(() => import("@/pages/school/Student/List")),
          },
          {
            path: ":id/show",
            element: lazy(() => import("@/pages/school/Student/Show")),
          },
          {
            path: ":id/edit",
            element: lazy(() => import("@/pages/school/Student/Edit")),
          },
        ],
      },
      {
        path: "bank",
        element: lazy(() => import("@/pages/school/Bank/List")),
      },
      {
        path: "wave",
        element: lazy(() => import("@/pages/school/Wave/List")),
      },
      {
        path: "document-requirement",
        element: lazy(() => import("@/pages/school/DocumentRequirement/List")),
      },
      {
        path: "subscription",
        children: [
          {
            index: true,
            element: lazy(() => import("@/pages/school/Subscription/List")),
          },
          {
            path: "create",
            element: lazy(() => import("@/pages/school/Subscription/Create")),
          },
          {
            path: ":id/show",
            element: lazy(() => import("@/pages/school/Subscription/Show")),
          },
        ]
      },
      {
        path: "user",
        children: [
          {
            index: true,
            element: lazy(() => import("@/pages/school/User/List")),
          },
          {
            path: ":id/edit",
            element: lazy(() => import("@/pages/school/User/Edit")),
          },
        ]
      }
    ],
  },

  // Student Routes
  {
    path: "/student",
    element: lazy(() => import("@/middleware/AuthGuardStudent")),
    children: [
      {
        path: "dashboard",
        element: lazy(() => import("@/pages/student/Home/Dashboard")),
      },
      {
        path: "complete-registration",
        element: lazy(() =>
          import("@/pages/student/auth/CompleteRegistration")
        ),
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
      {
        path: "setting",
        element: lazy(() => import("@/pages/admin/Setting")),
      },
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
      {
        path: "bank",
        element: lazy(() => import("@/pages/admin/Bank/List")),
      },
      {
        path: "subscription",
        children: [
          {
            index: true,
            element: lazy(() => import("@/pages/admin/Subscription/List")),
          },
          {
            path: ":id/verify",
            element: lazy(() =>
              import("@/pages/admin/Subscription/Verification")
            ),
          },
        ],
      },
      {
        path: "user",
        children: [
          {
            index: true,
            element: lazy(() => import("@/pages/admin/User/List")),
          },
        ],
      },
    ],
  },

  /* auth */
  {
    path: "/login/admin",
    element: lazy(() => import("@/pages/admin/auth/Login")),
  },
  {
    path: "/admin/email/verify/:id/:hash",
    element: lazy(() => import("@/pages/admin/auth/VerifyEmail")),
  },
  {
    path: "/admin/resend-email",
    element: lazy(() => import("@/pages/admin/auth/ResendEmail")),
  },
  // student
  {
    path: "/login/student",
    element: lazy(() => import("@/pages/student/auth/Login")),
  },
  {
    path: "/register/student",
    element: lazy(() => import("@/pages/student/auth/Register")),
  },
  // school
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
