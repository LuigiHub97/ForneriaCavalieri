import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ProfileEditModal } from "./ProfileEditModal";

function initials(name?: string | null, email?: string): string {
  const source = name?.trim() || email || "";
  const parts = source.split(/[\s@]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-brand-mark">
          <img src="/LogoCav.jpg" alt="Forneria Cavalieri" className="navbar-brand-logo" />
        </span>
        <span className="navbar-brand-text">{user?.businessName || "Forneria Cavalieri"}</span>
      </div>
      <nav className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          Dashboard
        </NavLink>
        <NavLink to="/pizzas" className={({ isActive }) => (isActive ? "active" : "")}>
          Pizzas
        </NavLink>
        <NavLink to="/ingredients" className={({ isActive }) => (isActive ? "active" : "")}>
          Ingredientes
        </NavLink>
      </nav>
      <div className="navbar-user-menu">
        <button type="button" className="navbar-user-trigger">
          <span className="navbar-avatar">{initials(user?.name, user?.email)}</span>
          <span className="navbar-user-name">{user?.name || user?.email}</span>
        </button>
        <div className="navbar-user-dropdown">
          <button type="button" onClick={() => setShowProfileEdit(true)}>
            Editar perfil
          </button>
          <button type="button" className="navbar-user-dropdown-danger" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>

      {showProfileEdit && <ProfileEditModal onClose={() => setShowProfileEdit(false)} />}
    </header>
  );
}
