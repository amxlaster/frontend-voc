// src/student/StudentLogin.jsx (path as you already have)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../lib/api";
import "./StudentLogin.css";
import Logo from "../../assets/login-logo.png";
import LeftBg from "../../assets/login-background.png";

export default function StudentLogin() {
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // used as email for login
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const reset = () => {
    setEmail("");
    setUsername("");
    setPassword("");
    setConfirm("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ----------------------------------
      // STUDENT LOGIN
      // ----------------------------------
      if (mode === "login") {
        const res = await API.post("/students/login", {
          email: username, // username field is actually email
          password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("student", JSON.stringify(res.data.student));

        // small visual time for animation (optional)
        setTimeout(() => {
          setLoading(false);
          navigate("/student/dashboard");
        }, 400);
      }
      // ----------------------------------
      // STUDENT REGISTER
      // ----------------------------------
      else {
        if (password !== confirm) {
          alert("Passwords do not match");
          setLoading(false);
          return;
        }

        await API.post("/students", {
          name: username,
          email,
          phone: "N/A",
          dob: "N/A",
          gender: "N/A",
          className: "N/A",
          password,
        });

        alert("Registered successfully! Please login.");
        setMode("login");
        reset();
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error occurred");
      setLoading(false);
    }
  };

  return (
    <div className={`sl-root ${loading ? "sl-root-loading" : ""}`}>
      <aside
        className="sl-left"
        style={{
          backgroundImage: `url(${LeftBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
  className="sl-left-inner"
  onClick={() => navigate("/")}
  style={{ cursor: "pointer" }}
>
  <img src={Logo} alt="SwanZaa" className="sl-logo" />
</div>

      </aside>

      <main className={`sl-right ${loading ? "sl-right-loading" : ""}`}>
        <div className="sl-card">
          <h2 className="sl-title">
            {mode === "login" ? "Student Login" : "Student Registration"}
          </h2>

          {/* MODE SWITCH TABS */}
          {/* <div className="sl-tabrow">
            <button
              type="button"
              className={`sl-tab ${mode === "register" ? "active" : ""}`}
              onClick={() => {
                setMode("register");
                reset();
              }}
            >
              Sign Up
            </button>

            <button
              type="button"
              className={`sl-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => {
                setMode("login");
                reset();
              }}
            >
              Login
            </button>
          </div> */}

          {/* FORM */}
          <form className="sl-form" onSubmit={submit} autoComplete="off">
            {/* REGISTER EMAIL FIELD */}
            {mode === "register" && (
              <label className="sl-field">
                <span className="sl-label">Email</span>
                <input
                  className="sl-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </label>
            )}

            {/* USERNAME FIELD → USED AS EMAIL FOR LOGIN */}
            <label className="sl-field">
              <span className="sl-label">
                {mode === "login" ? "Email" : "Username"}
              </span>
              <input
                className="sl-input"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={
                  mode === "login" ? "student@gmail.com" : "Choose a username"
                }
              />
            </label>

            {/* PASSWORD */}
            <label className="sl-field sl-pass-field">
              <span className="sl-label">Password</span>
              <input
                className="sl-input"
                type={showPw ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="sl-eye-btn"
              >
                {showPw ? "👁️" : "🙈"}

              </button>
            </label>

            {/* CONFIRM PASSWORD (REGISTER ONLY) */}
            {mode === "register" && (
              <label className="sl-field sl-pass-field">
                <span className="sl-label">Confirm Password</span>
                <input
                  className="sl-input"
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="sl-eye-btn"
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </label>
            )}

            {/* SUBMIT BUTTON WITH LOADING ANIMATION */}
            <button
              className={`sl-submit ${loading ? "sl-submit-loading" : ""}`}
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <>
                  <span className="sl-spinner" />
                  <span className="sl-submit-text">
                    {mode === "login" ? "Logging in..." : "Registering..."}
                  </span>
                </>
              ) : mode === "login" ? (
                "Login"
              ) : (
                "Register"
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
