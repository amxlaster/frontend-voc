// frontend/src/super-admin/quize/QuizHome.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import PageHeader from "../../components/PageHeader";

import "./QuizHome.css"

export default function QuizHome() {
  const nav = useNavigate();

  const [date, setDate] = useState("");
  const [level, setLevel] = useState("");

  const goNext = () => {
    if (!date) return alert("Select a date");
    if (!level) return alert("Select level");

    // ⭐ FIXED ROUTE
    nav(`/super-admin/quiz/${date}/${level}`);
  };

  return (
    <Layout>
      <PageHeader title="Create / Manage Quiz Questions" />

      <div className="card" style={{ padding: 20, maxWidth: 400 }}>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label style={{ marginTop: 12 }}>Select Level:</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="">Select</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advance">Advance</option>
        </select>

        <button
          className="btn-primary"
          style={{ marginTop: 20 }}
          onClick={goNext}
        >
          Continue
        </button>
      </div>
    </Layout>
  );
}
