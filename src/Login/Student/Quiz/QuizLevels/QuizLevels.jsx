import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizTopbar from "../QuizTopbar/QuizTopbar";
import API from "../../../../lib/api";

import "./QuizLevels.css";

import beginnerImg from "../../../../assets/beginner.jpg";
import interImg from "../../../../assets/Intermeditate.jpg";
import advImg from "../../../../assets/Advanced.jpg";

export default function QuizLevels() {
  const navigate = useNavigate();

  const [completedBeginner, setCompletedBeginner] = useState(false);
  const [completedIntermediate, setCompletedIntermediate] = useState(false);

  const [diamonds, setDiamonds] = useState(0);

  const date = new Date().toISOString().split("T")[0];

  useEffect(() => {
    loadStatus();
  }, []);

  async function loadStatus() {
    try {
      // ---------------------- BEGINNER PROGRESS ----------------------
      const beginnerRes = await API.get(`/student-quiz/${date}/beginner`);
      setCompletedBeginner(beginnerRes.data.progress.completed);
      setDiamonds(beginnerRes.data.progress.totalDiamonds);

      // ---------------------- INTERMEDIATE PROGRESS ----------------------
      try {
        const interRes = await API.get(`/student-quiz/${date}/intermediate`);
        setCompletedIntermediate(interRes.data.progress.completed);
      } catch {
        setCompletedIntermediate(false);
      }
    } catch (err) {
      console.log("LOAD LEVEL STATUS ERROR:", err);
    }
  }

  return (
    <div className="quiz-levels-wrapper">
      <QuizTopbar title="Quiz Levels" diamonds={diamonds} />

      <div className="quiz-level-container">
        {/* -------------------- BEGINNER -------------------- */}
        <div
          className={
            completedBeginner
              ? "level-card level-completed"
              : "level-card level-unlocked"
          }
          onClick={() => {
            if (!completedBeginner) navigate("/quiz/beginner");
          }}
        >
          <img src={beginnerImg} className="level-img" />
          <div className="level-title">Beginner</div>

          {completedBeginner && (
            <div className="badge-completed">Completed Today</div>
          )}
        </div>

        {/* -------------------- INTERMEDIATE -------------------- */}
        <div
          className={
            completedBeginner
              ? completedIntermediate
                ? "level-card level-completed"
                : "level-card level-unlocked"
              : "level-card level-locked"
          }
          onClick={() => {
            if (completedBeginner) navigate("/quiz/intermediate");
          }}
        >
          <img src={interImg} className="level-img" />
          <div className="level-title">Intermediate</div>

          {!completedBeginner && <div className="padlock">🔒</div>}

          {completedBeginner && completedIntermediate && (
            <div className="badge-completed">Completed Today</div>
          )}
        </div>

        {/* -------------------- ADVANCED -------------------- */}
        <div
          className={
            completedIntermediate
              ? "level-card level-unlocked"
              : "level-card level-locked"
          }
          onClick={() => {
            if (completedIntermediate) navigate("/quiz/advanced");
          }}
        >
          <img src={advImg} className="level-img" />
          <div className="level-title">Advanced</div>

          {!completedIntermediate && <div className="padlock">🔒</div>}
        </div>
      </div>
    </div>
  );
}
