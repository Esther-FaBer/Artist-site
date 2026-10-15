import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";

const NAV_LINKS = [
  { label: "Paintings", to: "/paintings" },
  { label: "Studies", to: "/studies" },
  { label: "Exhibitions", to: "/exhibitions" },
  { label: "Texts", to: "/texts" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  function closeMenu() {
    setMobileOpen(false);
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Artist name — serif italic, links back to the landing page */}
        <NavLink to="/" className="artist-name" onClick={closeMenu}>
          Artist Name
        </NavLink>

        {/* Desktop navigation — hidden on mobile */}
        <nav className="desktop-nav" aria-label="Main navigation">
          <ul className="nav-list">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? "nav-link nav-link--active" : "nav-link"
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile toggle button — hidden on desktop */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile dropdown — only renders when open */}
      {mobileOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? "nav-link nav-link--active" : "nav-link"
                  }
                  onClick={closeMenu}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

export default Header;
