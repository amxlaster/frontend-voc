// frontend/src/components/QuizTopbar/QuizTopbar.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";   // ✅ ADD THIS
import "./QuizTopbar.css";
import logo from "../../../../assets/logo.png";
import API from "../../../../lib/api";

export default function QuizTopbar({ title, diamonds }) {
  const [totalDiamonds, setTotalDiamonds] = useState(null);
  const navigate = useNavigate();   // ✅ ADD THIS

  useEffect(() => {
    let mounted = true;
    async function fetchTotal() {
      try {
        const res = await API.get("/student-quiz/total");
        if (mounted && res && typeof res.data?.total !== "undefined") {
          setTotalDiamonds(Number(res.data.total || 0));
        }
      } catch (err) {
        console.error("Failed to fetch total diamonds:", err);
        if (mounted) setTotalDiamonds(null);
      }
    }
    fetchTotal();

    return () => {
      mounted = false;
    };
  }, []);

  const display = totalDiamonds !== null ? totalDiamonds : (diamonds ?? 0);

  return (
    <div className="quiz-topbar">

      {/* LEFT — CLICKABLE LOGO */}
      <div 
        className="qt-left"
        onClick={() => navigate("/student/start-quiz")}   // ✅ CLICK → StartQuiz
        style={{ cursor: "pointer" }}                     // pointer cursor
      >
        <img src={logo} className="qt-logo" alt="Logo" />
      </div>

      {/* TITLE */}
      <div className="qt-center">{title}</div>

      {/* DIAMONDS */}
      <div className="qt-right">
        <span className="qt-gem">💎 {display}</span>
      </div>

    </div>
  );
}
