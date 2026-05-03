import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div className="auth-card">
        <Outlet />
      </div>
    </div>
  );
}
