// frontend/src/pages/quiz/beginner/BeginnerPage.jsx
import React, { useEffect, useState } from "react";
import API from "../../../../lib/api";
import QuizTopbar from "../QuizTopbar/QuizTopbar";
import "./BeginnerPage.css";

import QuestionScreen from "../components/QuestionScreen";
import CorrectGifScreen from "../components/CorrectGifScreen";
import InfoScreen from "../components/InfoScreen";
import FinalScreens from "../components/FinalScreens";

export default function BeginnerPage() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [stage, setStage] = useState("loading");
  const [diamonds, setDiamonds] = useState(0);

  const date = new Date().toISOString().split("T")[0];
  const level = "beginner";

  useEffect(() => {
    loadQuiz();
    // eslint-disable-next-line
  }, []);

  async function loadQuiz() {
    try {
      const res = await API.get(`/student-quiz/${date}/${level}`);

      const questionsFromServer = Array.isArray(res?.data?.questions)
        ? res.data.questions
        : [];

      const progress = res?.data?.progress ?? {
        answers: [],
        totalDiamonds: 0,
        completed: false,
      };

      setDiamonds(Number(progress.totalDiamonds ?? 0));

      if (!questionsFromServer.length) {
        setStage("no-quiz");
        return;
      }

      const answeredMap = (progress.answers || []).reduce((m, a) => {
        if (!a) return m;
        m[String(a.questionId)] = {
          attempts: Number(a.attempts || 0),
          earnedDiamonds: Number(a.earnedDiamonds || 0),
          isCorrect: !!a.isCorrect,
        };
        return m;
      }, {});

      const merged = questionsFromServer.map((q) => {
        const qid = String(q._id);
        const done = answeredMap[qid] || {};
        return {
          ...q,
          _id: qid,
          alreadyCorrect: !!done.isCorrect,
          attempts: done.attempts ?? 0,
          earnedDiamonds: done.earnedDiamonds ?? 0,
          isCorrect: !!done.isCorrect,
        };
      });

      setQuestions(merged);

      if (progress.completed) {
        setStage("final");
        return;
      }

      const firstUnanswered = merged.findIndex((q) => !q.alreadyCorrect);
      if (firstUnanswered === -1) {
        setStage("final");
        return;
      }

      setCurrent(firstUnanswered);
      setStage("question");
    } catch (err) {
      console.log("LOAD QUIZ ERROR:", err);
      setStage("no-quiz");
    }
  }

  async function handleAnswer(isCorrect) {
    const q = questions[current];
    if (!q) return;

    console.log("INFO IMAGE URL:", q.imageUrl); // ✅ correct place

    try {
      const res = await API.post("/student-quiz/answer", {
        questionId: q._id,
        date,
        level,
        isCorrect,
      });

      const serverTotal = Number(
        res?.data?.progress?.totalDiamonds ??
          res?.data?.totalDiamonds ??
          res?.data?.total ??
          NaN
      );

      if (!Number.isNaN(serverTotal)) {
        setDiamonds(serverTotal);
      }

      if (res?.data?.progress?.answers) {
        const progressAnswers = res.data.progress.answers;

        setQuestions((prev) => {
          const map = {};
          prev.forEach((q) => (map[q._id] = { ...q }));

          progressAnswers.forEach((pa) => {
            const id = String(pa.questionId);
            if (map[id]) {
              map[id] = {
                ...map[id],
                attempts: Number(pa.attempts || 0),
                earnedDiamonds: Number(pa.earnedDiamonds || 0),
                alreadyCorrect: !!pa.isCorrect,
                isCorrect: !!pa.isCorrect,
              };
            }
          });

          return Object.values(map);
        });
      }

      if (!isCorrect) return;

      // ✅ ALWAYS show info screen first
      setStage("correct");
      setTimeout(() => {
        setStage("info");
      }, 1200);
    } catch (err) {
      console.log("ANSWER ERROR:", err);
    }
  }

  function nextFromInfo() {
    // ✅ FINAL decision only here
    if (current + 1 >= questions.length) {
      setStage("final");
      return;
    }

    setCurrent((n) => n + 1);
    setStage("question");
  }

  // ==========================================
  // RENDER STATES
  // ==========================================

  if (stage === "loading") {
    return (
      <>
        <QuizTopbar title="Beginner Level" diamonds={diamonds} />
        <p style={{ marginTop: 50, textAlign: "center" }}>
          Loading questions...
        </p>
      </>
    );
  }

  if (stage === "no-quiz") {
    return (
      <>
        <QuizTopbar title="Beginner Level" diamonds={diamonds} />
        <div style={{ marginTop: 60, textAlign: "center" }}>
          <h2>No quiz created for today</h2>
        </div>
      </>
    );
  }

  if (stage === "final") {
    return (
      <>
        <QuizTopbar title="Beginner Level" diamonds={diamonds} />
        <FinalScreens diamonds={diamonds} />
      </>
    );
  }

  const q = questions[current];
  if (!q) return null;

  return (
    <div className="quiz-wrapper">
      <QuizTopbar title="Beginner Level" diamonds={diamonds} />

      <div className="quiz-center-box">
        {stage === "question" && (
          <QuestionScreen q={q} handleAnswer={handleAnswer} />
        )}

        {stage === "info" && (
          <InfoScreen image={q.imageUrl} onNext={nextFromInfo} />
        )}
      </div>

      {stage === "correct" && <CorrectGifScreen />}
    </div>
  );
}
