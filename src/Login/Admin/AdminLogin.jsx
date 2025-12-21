import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../lib/api";
import "./AdminLogin.css";
import Logo from "../../assets/login-logo.png";
import LeftBg from "../../assets/login-background.png";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/admins/login", {
        email,
        password,
      });

      // Save admin & token to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      // Delay for nice animation
      setTimeout(() => {
        setLoading(false);
        navigate("/admin/dashboard");   // ⭐ SAME AS OLD VERSION
      }, 400);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className={`al-root ${loading ? "al-root-loading" : ""}`}>
      <aside
        className="al-left"
        style={{
          backgroundImage: `url(${LeftBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="al-left-inner">
          <div
  className="al-brand"
  onClick={() => navigate("/")}
  style={{ cursor: "pointer" }}
>
  <img src={Logo} alt="SwanZaa" className="al-logo" />
</div>

        </div>
      </aside>

      <main className={`al-right ${loading ? "al-right-loading" : ""}`}>
        <div className="al-card">
          <h2 className="al-title">Admin Login</h2>

          <form className="al-form" onSubmit={submit} autoComplete="off">
            
            {/* EMAIL */}
            <label className="al-field">
              <span className="al-label">Email</span>
              <input
                className="al-input"
                type="email"
                value={email}
                placeholder="admin@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            {/* PASSWORD */}
            <label className="al-field al-pass-field">
              <span className="al-label">Password</span>
              <input
                className="al-input"
                type={showPw ? "text" : "password"}
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="al-eye"
                onClick={() => setShowPw(!showPw)}
              >
                {showPw ? "👁️" : "🙈"}
              </button>
            </label>

            {/* SUBMIT */}
            <div className="al-actions">
              <button
                type="submit"
                disabled={loading}
                className={`al-submit ${loading ? "al-submit-loading" : ""}`}
              >
                {loading ? (
                  <>
                    <span className="al-spinner" />
                    <span className="al-submit-text">Signing in...</span>
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
