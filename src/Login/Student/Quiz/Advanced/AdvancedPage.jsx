import { useEffect, useState } from "react";
import API from "../../../../lib/api";
import QuizTopbar from "../QuizTopbar/QuizTopbar";
import "./AdvancedPage.css";

import QuestionScreen from "../components/QuestionScreen";
import CorrectGifScreen from "../components/CorrectGifScreen";
import InfoScreen from "../components/InfoScreen";
import FinalScreens from "../components/FinalScreens";

export default function AdvancedPage() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [stage, setStage] = useState("loading"); 
  // loading | question | correct | info | final | no-quiz

  const [diamonds, setDiamonds] = useState(0);

  const date = new Date().toISOString().split("T")[0];
  const level = "advance"; // 🔥 IMPORTANT

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

    console.log("INFO IMAGE URL:", q.imageUrl);

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

      // ✅ Always show GIF → INFO first
      setStage("correct");
      setTimeout(() => {
        setStage("info");
      }, 1500);
    } catch (err) {
      console.log("ANSWER ERROR:", err);
    }
  }

  function nextFromInfo() {
    // ✅ Final decision ONLY here
    if (current + 1 >= questions.length) {
      setStage("final");
      return;
    }

    setCurrent((c) => c + 1);
    setStage("question");
  }

  // ==============================
  // RENDER
  // ==============================

  if (stage === "loading") {
    return (
      <>
        <QuizTopbar title="Advanced Level" diamonds={diamonds} />
        <p style={{ textAlign: "center", marginTop: 40 }}>
          Loading questions...
        </p>
      </>
    );
  }

  if (stage === "no-quiz") {
    return (
      <>
        <QuizTopbar title="Advanced Level" diamonds={diamonds} />
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <h3>No quiz created for today</h3>
        </div>
      </>
    );
  }

  if (stage === "final") {
    return (
      <>
        <QuizTopbar title="Advanced Level" diamonds={diamonds} />
        <FinalScreens diamonds={diamonds} />
      </>
    );
  }

  const q = questions[current];
  if (!q) return null;

  return (
    <div className="quiz-wrapper">
      <QuizTopbar title="Advanced Level" diamonds={diamonds} />

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
