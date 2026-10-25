import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const NAV_LINKS = [
  { to: "/etchings", label: "Etchings" },
  { to: "/studies", label: "Studies" },
  { to: "/about", label: "About" },
  { to: "/news", label: "News" },
  { to: "/contact", label: "Contact" },
];

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <aside className={`sidebar${menuOpen ? " sidebar--open" : ""}`}>
      <NavLink to="/" className="sidebar__name" onClick={closeMenu}>
        Maite Cascon
      </NavLink>

      {/* Mobile hamburger */}
      <button
        className="sidebar__hamburger"
        onClick={toggleMenu}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        <span
          className={`sidebar__hamburger-icon${menuOpen ? " sidebar__hamburger-icon--open" : ""}`}
        />
      </button>

      <nav className="sidebar__nav" aria-label="Main navigation">
        {NAV_LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar__link${isActive ? " sidebar__link--active" : ""}`
            }
            onClick={closeMenu}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {menuOpen && (
        <div
          className="sidebar__overlay"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </aside>
  );
}
