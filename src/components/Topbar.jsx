// frontend/src/components/Topbar.jsx
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    nav("/");
  };

  return (
    <header className="dash-topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        
        <button className="btn primary" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}
