import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../features/auth/AuthForm";

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div className="card">
      <h2 className="auth-card__title">Create your account</h2>
      <p className="auth-card__subtitle">
        Start tracking teams, projects, and delivery without leaving the flow.
      </p>
      <AuthForm
        mode="signup"
        onSuccess={() => navigate("/dashboard", { replace: true })}
      />
      <p className="auth-switch">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
