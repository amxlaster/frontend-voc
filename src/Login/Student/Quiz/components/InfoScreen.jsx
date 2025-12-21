import "./InfoScreen.css";

export default function InfoScreen({ image, onNext }) {
  return (
    <div className="info-wrapper fade-in">
      <div className="info-card">
        <div className="info-card-img">
        <img src={image} className="info-img" />
        </div>

        <button className="info-next-btn" onClick={onNext}>
          Next →
        </button>
      </div>
    </div>
  );
}
