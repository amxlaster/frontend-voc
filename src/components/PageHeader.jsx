// PageHeader.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./PageHeader.css";

export default function PageHeader({ title, showBack = true, showDashboard = true, extra }) {
  const nav = useNavigate();

  return (
    <header className="ph-root" role="banner" aria-label={title || "Page header"}>
      <div className="ph-left">
        {showDashboard && (
          <button
            type="button"
            className="ph-btn ph-dashboard"
            onClick={() => nav("/super-admin/dashboard")}
            title="Go to Dashboard"
          >
            Dashboard
          </button>
        )}
        {title && <h1 className="ph-title">{title}</h1>}
      </div>

      <div className="ph-right">
        {extra}
        {showBack && (
          <button
            type="button"
            className="ph-btn ph-back"
            onClick={() => nav(-1)}
            title="Go back"
          >
            ← Back
          </button>
        )}
      </div>
    </header>
  );
}
