import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../../../../assets/logo.png";
import "./AdminSidebar.css";

export default function AdminSidebar() {
  const navigate = useNavigate();

  // 🔒 Prevent Browser Back Button After Logout
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");

    // Remove previous page from history
    navigate("/admin-login", { replace: true });

    // Extra protection to block back navigation
    setTimeout(() => {
      window.onpopstate = () => {
        navigate("/admin-login", { replace: true });
      };
    }, 100);
  };

  const closeSidebar = () => {
    document.body.classList.remove("sidebar-open");
  };

  return (
    <div className="admin-sidebar">

      <div
  className="sidebar-logo"
  onClick={() => {
    closeSidebar();
    navigate("/admin/dashboard");
  }}
  style={{ cursor: "pointer" }}
>
  <img src={Logo} alt="logo" className="logo-img" />
</div>


      <nav className="sidebar-menu">

        <NavLink 
          to="/admin/dashboard" 
          className="sidebar-link"
          onClick={closeSidebar}
        >📊 Dashboard</NavLink>

        <NavLink 
          to="/admin/student" 
          className="sidebar-link"
          onClick={closeSidebar}
        >👨‍🎓 Students</NavLink>

        <NavLink 
          to="/admin/leaderboard" 
          className="sidebar-link"
          onClick={closeSidebar}
        >🏆 Leaderboard</NavLink>

      </nav>
      <NavLink 
        to="/admin/charts" 
        className="sidebar-link"
        onClick={closeSidebar}
      >
      📈 Charts
      </NavLink>
      <NavLink
        to="/admin/change-password"
        className="sidebar-link"
        onClick={closeSidebar}
      >
      🔐 Change Password
      </NavLink>



      <button className="logout-btn" onClick={logout}>
        Log Out
      </button>

    </div>
  );
}
