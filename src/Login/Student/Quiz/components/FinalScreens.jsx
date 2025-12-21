import { useNavigate } from "react-router-dom";
import "./FinalScreens.css";
import boy from "../../../../assets/boy.gif";

export default function FinalScreens({ diamonds }) {
  const nav = useNavigate();

  return (
    <div className="final-wrapper fade-in">

      <div className="levelup-box">
        <h1>🚀 Level Up! You’ve Mastered the Basics.</h1>
        <img src={boy} className="final-boy" />
      </div>

      <div className="kudos-box">
        <h1>Kudos🎉</h1>
        <p className="diamond">💎{diamonds}</p>
      </div>

      <button
        className="final-btn"
        onClick={() => nav("/quiz-levels")}
      >
        Back to Levels →
      </button>

    </div>
  );
}
