import React from "react";
import { Outlet } from "react-router-dom";

import AdminTopbar from "../AdminTopbar/AdminTopbar";
import AdminSidebar from "../AdminSidebar/AdminSidebar";

import "./AdminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">

      <AdminSidebar />

      <div
        className="sidebar-overlay"
        onClick={() => document.body.classList.remove("sidebar-open")}
      ></div>

      <div className="admin-main">
        <AdminTopbar />

        <div className="admin-content">
          <Outlet />
        </div>
      </div>

    </div>
  );
}
