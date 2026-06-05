import React from "react";
import { useNavigate } from "react-router-dom";
import "./StartQuiz.css";
import quizImg from "../../../../assets/quiz-hero.png";

export default function StartQuiz() {
  const navigate = useNavigate();

  return (
    <div className="startquiz-wrapper">

      <h1 className="sq-title">Quiz</h1>

      <div className="sq-row">

        {/* LEFT SIDE CONTENT */}
        <div className="sq-left">
          <p className="sq-sub">Your Brain’s Playground</p>

          
        </div>

        {/* RIGHT IMAGE */}
        <div className="sq-right">
          <img src={quizImg} alt="Quiz" className="sq-img" />
          <br></br>
          <button
            className="sq-btn"
            onClick={() => navigate("/quiz-levels")}
          >
            Start Quiz
          </button>
        </div>

      </div>

    </div>
  );
}
