import React, { useState } from "react";
import "./StudentTopbar.css";
import { useNavigate } from "react-router-dom";
import Logo from "../../../../assets/logo.png";
import defaultUser from "../../../../assets/user.jpg";

export default function StudentTopbar() {
  const navigate = useNavigate();
  const student = JSON.parse(localStorage.getItem("student")) || {};
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  return (
    <div className="student-topbar">

      {/* MOBILE: HAMBURGER + LOGO */}
      <div className="topbar-left">
        <div 
          className="hamburger select-none
"
          onClick={() => document.body.classList.toggle("sidebar-open")}
        >
          ☰
        </div>

        <img src={Logo} alt="logo" className="topbar-logo" />
      </div>

      {/* RIGHT SIDE: NOTIF + PROFILE */}
      <div className="topbar-right">

        {/* PROFILE */}
        <div 
          className="profile-wrapper"
          onMouseEnter={() => setShowProfile(true)}
          onMouseLeave={() => setShowProfile(false)}
        >
          <img 
            src={student?.photo || defaultUser} 
            alt="user" 
            className="profile-img"
          />

          {showProfile && (
            <div className="profile-dropdown">
              <p>{student?.name || "Student User"}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
