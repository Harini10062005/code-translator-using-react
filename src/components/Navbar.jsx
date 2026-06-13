import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  const links = [
    { label: "Home",       path: "/" },
    { label: "Translator", path: "/translator" },
    { label: "About",      path: "/about" },
  ];

  return (
    <nav className="nav">
      <Link to="/" className="nav-brand">
        <div className="nav-icon">⇄</div>
        CodeBridge
      </Link>

      <div className="nav-links">
        {links.map(l => (
          <Link
            key={l.path}
            to={l.path}
            className={`nav-link ${pathname === l.path ? "active" : ""}`}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div className="nav-actions">
        <Link to="/login"  className="btn-ghost">Login</Link>
        <Link to="/signup" className="btn-primary">Sign Up</Link>
      </div>
    </nav>
  );
}