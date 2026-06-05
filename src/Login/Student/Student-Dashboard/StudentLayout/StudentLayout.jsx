import React from "react";
import { Outlet } from "react-router-dom";

import StudentSidebar from "../StudentSidebar/StudentSidebar";
import StudentTopbar from "../StudentTopbar/StudentTopbar";

import "./StudentLayout.css";

export default function StudentLayout() {
  return (
    <div className="student-layout">

      <StudentSidebar />

      {/* OVERLAY FOR MOBILE */}
      <div
        className="sidebar-overlay"
        onClick={() => document.body.classList.remove("sidebar-open")}
      />

      <div className="student-main">
        <StudentTopbar />

        <div className="student-content">
          {/* ✅ child pages render here */}
          <Outlet />
        </div>
      </div>

    </div>
  );
}
