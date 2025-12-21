import { useState, useEffect } from "react";
import "./QuestionScreen.css";
import ouchGif from "../../../../assets/ouch.gif";
import bravoGif from "../../../../assets/bravo.gif";

export default function QuestionScreen({ q, handleAnswer }) {
  const [selected, setSelected] = useState(null);
  const [wrongGif, setWrongGif] = useState(false);
  const [correctGif, setCorrectGif] = useState(false);

  useEffect(() => {
    if (q.alreadyCorrect) {
      setSelected(q.correctIndex);
    }
  }, [q]);

  function choose(i) {
    if (selected !== null) return;
    if (q.alreadyCorrect) return;

    setSelected(i);
    const isCorrect = i === q.correctIndex;

    if (!isCorrect) {
      setTimeout(() => {
        setWrongGif(true);
        setTimeout(() => {
          setWrongGif(false);
          setSelected(null);
        }, 2000);
      }, 300);

      handleAnswer(false, q._id);
      return;
    }

    setTimeout(() => setCorrectGif(true), 300);
    handleAnswer(true, q._id);
  }

  return (
    <>
      {/* WRONG GIF */}
      {wrongGif && (
        <div className="gif-overlay">
          <img src={ouchGif} alt="Wrong" />
        </div>
      )}

      {/* CORRECT GIF */}
      {correctGif && (
        <div className="gif-overlay">
          <img src={bravoGif} alt="Correct" />
        </div>
      )}

      {/* ⬇️ ONLY THIS CARD WRAPS CONTENT — NO FULLSCREEN CONTAINER */}
      <div className="qs-card">
        <h2 className="qs-title">{q.question}</h2>

        {q.options.map((op, i) => (
          <button
            key={i}
            disabled={q.alreadyCorrect}
            className={
              selected === i
                ? i === q.correctIndex
                  ? "qs-opt green"
                  : "qs-opt red"
                : "qs-opt"
            }
            onClick={() => choose(i)}
          >
            {op}
          </button>
        ))}
      </div>
    </>
  );
}
