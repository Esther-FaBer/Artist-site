import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const NAV_LINKS = [
  { to: "/about", label: "About" },
  { to: "/series", label: "Series" },
  { to: "/studies", label: "Studies" },
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
        Maite Cascón
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

      {/* Sidebar footer — copyright + social media */}
      <footer className="sidebar__footer">
        <p className="sidebar__copyright">
          © {new Date().getFullYear()} Maite Cascón
        </p>
        <div className="sidebar__social">
          <a
            href="https://www.instagram.com/maite_cascon"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="sidebar__social-link"
          >
            {/* Instagram SVG */}
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle
                cx="17.5"
                cy="6.5"
                r="0.5"
                fill="currentColor"
                stroke="none"
              />
            </svg>
          </a>
          <a
            href="mailto: maitecasconstudio@gmail.com"
            aria-label="Send email"
            className="sidebar__social-link"
          >
            {/* Envelope SVG */}
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <polyline points="2,4 12,13 22,4" />
            </svg>
          </a>
        </div>
      </footer>

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
