import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../../../../assets/logo.png";
import "./StudentSidebar.css";

export default function StudentSidebar() {
  const navigate = useNavigate();

  // 🔒 Prevent Back Button After Logout
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");

    // REMOVE history → user can't go back
    navigate("/student-login", { replace: true });

    // Reset back button handler
    setTimeout(() => {
      window.onpopstate = () => {
        navigate("/student-login", { replace: true });
      };
    }, 100);
  };

  const closeSidebar = () => {
    document.body.classList.remove("sidebar-open");
  };

  return (
    <div className="student-sidebar">

      <div
  className="sidebar-logo"
  onClick={() => {
    closeSidebar();
    navigate("/student/dashboard");
  }}
  style={{ cursor: "pointer" }}
>
  <img src={Logo} alt="logo" className="logo-img" />
</div>


      <nav className="sidebar-menu">
        <NavLink to="/student/dashboard" className="sidebar-link" onClick={closeSidebar}>
          <span className="icon">📊</span> Dashboard
        </NavLink>

        <NavLink to="/student/wotd" className="sidebar-link" onClick={closeSidebar}>
          <span className="icon">📘</span> WOTD
        </NavLink>

        <NavLink to="/student/start-quiz" className="sidebar-link" onClick={closeSidebar}>
          <span className="icon">📝</span> Start Quiz
        </NavLink>

        <NavLink to="/student/leaderboard" className="sidebar-link" onClick={closeSidebar}>
          <span className="icon">🏆</span> Leaderboard
        </NavLink>

        <NavLink to="/student/reward" className="sidebar-link" onClick={closeSidebar}>
          <span className="icon">🎁</span> Reward
        </NavLink>
        <NavLink
          to="/student/change-password"
          className="sidebar-link"
          onClick={closeSidebar}
        >
        🔐 Change Password
        </NavLink>

      </nav>

      <button className="logout-btn" onClick={logout}>
        Log Out
      </button>
    </div>
  );
}
