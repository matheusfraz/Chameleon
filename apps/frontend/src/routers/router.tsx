import { createBrowserRouter, Navigate } from "react-router"
import { AuthLayout } from "@/layouts/AuthLayout"
import { AppLayout } from "@/layouts/AppLayout"
import { LoginPage } from "@/pages/LoginPage"
import { StudioPage } from "@/pages/StudioPage"

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  {
    element: <AuthLayout />,
    children: [{ path: "/login", element: <LoginPage /> }],
  },
  {
    element: <AppLayout />,
    children: [{ path: "/studio", element: <StudioPage /> }],
  },
  { path: "*", element: <Navigate to="/" replace /> },
])