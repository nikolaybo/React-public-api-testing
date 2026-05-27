// src/routes/AppRoutes.tsx
import { Navigate, createBrowserRouter, type RouteObject } from "react-router";

import AppLayout from "@/components/layout/AppLayout";

// Guards
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute";

// Pages
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import RegisterPage from "@/pages/RegisterPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import ReportsPage from "@/pages/ReportsPage";

export const routes: RouteObject[] = [
  {
    element: <AppLayout />, // Layout is always rendered
    children: [
      // Protected pages (authenticated)
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <HomePage />,
            handle: { label: "Home", nav: "header" },
          },

          {
            element: <RoleRoute allowedRoles={["ADMIN"]} />,
            children: [
              {
                path: "/dashboard",
                element: <Navigate to="/dashboard/analytics" replace />,
                handle: { label: "Dashboard", nav: "header" },
              },
              {
                path: "/dashboard/analytics",
                element: <AnalyticsPage />,
                handle: {
                  label: "Analytics",
                  nav: "header",
                  parent: "/dashboard",
                },
              },
              {
                path: "/dashboard/reports",
                element: <ReportsPage />,
                handle: {
                  label: "Reports",
                  nav: "header",
                  parent: "/dashboard",
                },
              },
            ],
          },
        ],
      },
      // Public pages (guests)
      {
        element: <PublicRoute />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
            handle: { label: "Login", nav: "header", side: "right" },
          },
          {
            path: "/register",
            element: <RegisterPage />,
            handle: { label: "Register", nav: "header", side: "right" },
          },
          {
            path: "/privacy",
            element: <PrivacyPage />,
            handle: { label: "Privacy policy", nav: "footer" },
          },
          {
            path: "/terms",
            element: <TermsPage />,
            handle: { label: "Terms of service", nav: "footer" },
          },
        ],
      },
    ],
  },

  // 404 fallback
  { path: "*", element: <NotFoundPage /> },
];

export const router = createBrowserRouter(routes);
