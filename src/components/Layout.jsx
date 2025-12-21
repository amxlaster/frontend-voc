// src/components/Layout.jsx
import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dash-layout">

      {/* Hamburger ONLY when sidebar closed */}
      {!sidebarOpen && (
        <button
          className="hamburger"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="dash-main-area">
        <Topbar />
        <div className="dash-content">{children}</div>
      </div>
    </div>
  );
}
