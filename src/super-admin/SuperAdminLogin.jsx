// frontend/src/super-admin/SuperAdminLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/Arumexa Logo.png";
import "./SuperAdminLogin.css";

export default function SuperAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await axios.post("/api/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMsg("Login successful — redirecting...");

      // ⭐ FIXED REDIRECT
      navigate("/super-admin/dashboard");

    } catch (err) {
      setMsg(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="sa-login-page">
      <div className="sa-login-overlay" />
      <div className="sa-login-card">

        <img src={logo} alt="logo" className="sa-login-logo" />

        <h1 className="sa-login-title">Welcome Super Admin</h1>

        <form className="sa-login-form" onSubmit={handleLogin}>
          <input
            id="email"
            className="sa-login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <input
            id="password"
            className="sa-login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <button className="sa-login-btn" type="submit">Sign In</button>
        </form>

        {msg && <div className="sa-login-msg">{msg}</div>}
      </div>
    </div>
  );
}
