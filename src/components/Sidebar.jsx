import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay — click to close */}
      <div
        className={`sidebar-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      />

      <aside className={`dash-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="logo-dot">SA</div>
          <div>
            <div style={{ fontSize: 14 }}>Super Admin</div>
            <div className="muted" style={{ fontSize: 12 }}>Dashboard</div>
          </div>
        </div>

        <nav className="nav-list">
          <Link to="/super-admin/dashboard" className="nav-item" onClick={onClose}>
            🏠 Dashboard
          </Link>
          <Link to="/super-admin/admin" className="nav-item" onClick={onClose}>
            👥 Admins
          </Link>
          <Link to="/super-admin/student" className="nav-item" onClick={onClose}>
            🎓 Students
          </Link>
          <Link to="/super-admin/quotes" className="nav-item" onClick={onClose}>
            📚 Quotes
          </Link>
          <Link to="/super-admin/quiz" className="nav-item" onClick={onClose}>
            📝 Quiz Questions
          </Link>
        </nav>
      </aside>
    </>
  );
}
