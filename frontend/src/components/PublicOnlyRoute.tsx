import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function PublicOnlyRoute() {
  const token = useAuthStore((snapshot) => snapshot.token);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
