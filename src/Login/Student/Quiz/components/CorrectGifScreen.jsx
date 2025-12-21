import bravoGif from "../../../../assets/bravo.gif";
import "./CorrectGifScreen.css";

export default function CorrectGifScreen() {
  return (
    <div className="correct-overlay fade-in">
      <img src={bravoGif} />
    </div>
  );
}
