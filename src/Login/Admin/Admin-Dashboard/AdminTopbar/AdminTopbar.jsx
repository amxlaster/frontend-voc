import React, { useState } from "react";
import "./AdminTopbar.css";
import { useNavigate } from "react-router-dom";
import Logo from "../../../../assets/logo.png";
import defaultUser from "../../../../assets/user.jpg";

export default function AdminTopbar() {
  const navigate = useNavigate();

  // Load admin data
  const admin = JSON.parse(localStorage.getItem("admin")) || {};

  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  return (
    <div className="admin-topbar">

      {/* MOBILE MENU + LOGO */}
      <div className="topbar-left">
        <div
          className="hamburger"
          onClick={() => document.body.classList.toggle("sidebar-open")}
        >
          ☰
        </div>

        <img src={Logo} alt="logo" className="topbar-logo" />
      </div>

      {/* RIGHT SIDE */}
      <div className="topbar-right">

        {/* PROFILE DROPDOWN */}
        <div
          className="profile-wrapper"
          onMouseEnter={() => setShowProfile(true)}
          onMouseLeave={() => setShowProfile(false)}
        >
          <img
            src={admin.photo || defaultUser}
            alt="user"
            className="profile-img"
          />

          {showProfile && (
            <div className="profile-dropdown">
              <p>{admin?.name || "Admin User"}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
