import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Typed from "typed.js"; // ✅ REQUIRED
import API from "../../../../lib/api";
import heroImg from "../../../../assets/student-hero.png";
import "./Dashboard.css";

export default function Dashboard() {
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  const typedRef = useRef(null); // ✅ FIXED

  useEffect(() => {
    const saved = localStorage.getItem("student");
    if (saved) setStudent(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!typedRef.current) return;

    const typed = new Typed(typedRef.current, {
      strings: [student?.name || "Student"],
      typeSpeed: 150,
      backSpeed: 40,
      showCursor: false,
      loop: false,
    });

    return () => typed.destroy();
  }, [student]);

  return (
    <div className="dashboard-main">

      <div className="dash-flex">

        {/* LEFT SIDE */}
        <div className="dash-left">

          <h1 className="dash-welcome">
            Welcome{" "}
            <span
              ref={typedRef}
              style={{ color: "#91b2f4ff", fontWeight: "bold" }}
            ></span>
            <span className="dash-emoji"> 👋</span>
          </h1>

          <h2 className="dash-title">
            Upgrade your English,<br />
            upgrade your creative edge
          </h2>

          <p className="dash-tagline">
            Designed for Viscom minds, powered by words
          </p>

          <button 
            className="dash-btn"
            onClick={() => navigate("/student/start-quiz")}
          >
            Start Quiz
          </button>

        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="dash-right">
          <img src={heroImg} alt="Hero" className="dash-hero" />
        </div>

      </div>
    </div>
  );
}
