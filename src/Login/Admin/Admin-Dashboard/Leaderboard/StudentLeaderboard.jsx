// frontend/src/admin/leaderboard/StudentLeaderboard.jsx
import React, { useEffect, useState } from "react";
import API from "../../../../lib/api";
import "./StudentLeaderboard.css";

export default function StudentLeaderboard({ studentId, studentName, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!studentId) return;
    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  async function loadSummary() {
    setLoading(true);
    setError(null);
    try {
      // NOTE: backend route is /api/leaderboard/summary/:id
      const res = await API.get(`/leaderboard/summary/${studentId}`);
      setSummary(res.data || null);
    } catch (err) {
      console.error("Failed to load student leaderboard summary:", err);
      // show helpful messages depending on server response
      if (err?.response?.status === 404) {
        setError("Student not found.");
      } else if (err?.response?.status === 401 || err?.response?.status === 403) {
        setError("Unauthorized — please login or check permissions.");
      } else {
        setError("Failed to load student summary.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sl-overlay" onClick={() => onClose?.()}>
      <div className="sl-panel" onClick={(e) => e.stopPropagation()}>
        <div className="sl-top">
          <div>
            <h3>{studentName || "Student details"}</h3>
            <div className="sl-sub">View per-level scores & overall rank</div>
          </div>

          <div>
            <button className="sl-close" onClick={() => onClose?.()}>Close</button>
          </div>
        </div>

        {loading && <div className="sl-loading">Loading summary…</div>}
        {error && (
          <div className="sl-error">
            <div>{error}</div>
            <div style={{ marginTop: 10 }}>
              <button className="sl-btn sl-outline" onClick={loadSummary}>Retry</button>
              <button className="sl-btn" style={{ marginLeft: 8 }} onClick={() => onClose?.()}>Back</button>
            </div>
          </div>
        )}

        {!loading && !error && summary && (
          <>
            <div className="sl-summary-grid">
              <div className="sl-card">
                <div className="sl-card-title">Overall</div>
                <div className="sl-card-value">{summary?.overall ?? 0}</div>
                <div className="sl-card-sub">Rank: {summary?.rank ?? "—"}</div>
              </div>

              <div className="sl-card">
                <div className="sl-card-title">Beginner</div>
                <div className="sl-card-value">{summary?.levels?.beginner ?? 0}</div>
                <div className="sl-card-sub">Diamonds</div>
              </div>

              <div className="sl-card">
                <div className="sl-card-title">Intermediate</div>
                <div className="sl-card-value">{summary?.levels?.intermediate ?? 0}</div>
                <div className="sl-card-sub">Diamonds</div>
              </div>

              <div className="sl-card">
                <div className="sl-card-title">Advanced</div>
                <div className="sl-card-value">{summary?.levels?.advanced ?? 0}</div>
                <div className="sl-card-sub">Diamonds</div>
              </div>
            </div>

            <div className="sl-actions">
              <button className="sl-btn sl-outline" onClick={() => onClose?.()}>Back</button>
              <button
                className="sl-btn sl-primary"
                onClick={() => window.open(`/admin/student/${studentId}`, "_self")}
              >
                Open Student Profile
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
