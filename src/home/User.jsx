// src/home/User.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./User.css";
import Logo from "../assets/logo.png";
import AdminImg from "../assets/admin.jpg";
import StudentImg from "../assets/student.jpg";
import { useNavigate } from "react-router-dom";

export default function User() {
  const navigate = useNavigate();

  return (
    <div className="user-wrap">
      {/* SAME TOPBAR AS HOME PAGE */}
      <div className="topbar">
        <div className="container d-flex align-items-center ps-lg-1 ps-md-4 ps-2">
          <img
  src={Logo}
  alt="SwanZaa"
  className="logo"
  style={{ cursor: "pointer" }}
  onClick={() => navigate("/")}
/>

        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="user-content">
        <div className="container">
          <div className="row justify-content-center gy-4 gx-md-5 user-cards">

            {/* Admin card */}
            <article className="col-10 col-sm-6 col-md-5 col-lg-4 d-flex justify-content-center">
              <div className="user-card-inner">
                <div className="user-card-media">
                  <img src={AdminImg} alt="Admin" />
                </div>
                <button
                  className="user-card-foot"
                  onClick={() => navigate("/admin-login")}
                >
                  Admin Login
                </button>
              </div>
            </article>

            {/* Student card */}
            <article className="col-10 col-sm-6 col-md-5 col-lg-4 d-flex justify-content-center">
              <div className="user-card-inner">
                <div className="user-card-media">
                  <img src={StudentImg} alt="Student" />
                </div>
                <button
                  className="user-card-foot"
                  onClick={() => navigate("/student-login")}
                >
                  Student Login
                </button>
              </div>
            </article>

          </div>
        </div>
      </main>
    </div>
  );
}
