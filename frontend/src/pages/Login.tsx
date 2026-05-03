import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../features/auth/AuthForm";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo =
    (location.state as { from?: string } | null)?.from ?? "/dashboard";

  return (
    <div className="card">
      <h2 className="auth-card__title">Sign in</h2>
      <p className="auth-card__subtitle">
        Access your workspace and keep track of everything in one place.
      </p>
      <AuthForm
        mode="login"
        onSuccess={() => navigate(redirectTo, { replace: true })}
      />
      <p className="auth-switch">
        Need an account? <Link to="/signup">Create one</Link>
      </p>
    </div>
  );
}
