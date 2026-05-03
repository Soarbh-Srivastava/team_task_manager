import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function RequireAuth() {
  const location = useLocation();
  const token = useAuthStore((snapshot) => snapshot.token);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
