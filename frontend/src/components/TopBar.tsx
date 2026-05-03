import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, useAuthStore } from "../store/authStore";

export default function TopBar() {
  const user = useAuthStore((snapshot) => snapshot.user);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="topbar">
      <input
        className="topbar__search"
        placeholder="Search tasks, projects, teams..."
      />
      <div className="topbar__actions">
        <Link className="topbar__user" to="/login">
          {user ? user.fullName : "Guest"}
        </Link>
        <button
          className="icon-button"
          type="button"
          aria-label="Logout"
          onClick={handleLogout}
        >
          ↩
        </button>
        <div className="avatar" />
      </div>
    </header>
  );
}
