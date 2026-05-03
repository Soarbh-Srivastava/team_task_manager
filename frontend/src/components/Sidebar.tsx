import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">Team Task</div>
      <nav className="sidebar__nav">
        <NavLink
          className={({ isActive }) =>
            `sidebar__link${isActive ? " sidebar__link--active" : ""}`
          }
          to="/dashboard"
        >
          Dashboard
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `sidebar__link${isActive ? " sidebar__link--active" : ""}`
          }
          to="/teams"
        >
          Teams
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `sidebar__link${isActive ? " sidebar__link--active" : ""}`
          }
          to="/projects"
        >
          Projects
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `sidebar__link${isActive ? " sidebar__link--active" : ""}`
          }
          to="/tasks"
        >
          Tasks
        </NavLink>
      </nav>
    </aside>
  );
}
