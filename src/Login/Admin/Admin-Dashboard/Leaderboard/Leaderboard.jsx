import React, { useEffect, useState } from "react";
import API from "../../../../lib/api";
import "./Leaderboard.css";
import StudentLeaderboard from "./StudentLeaderboard";

export default function LeaderboardAdmin() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [combinedList, setCombinedList] = useState([]);
  const [top3, setTop3] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const [query, setQuery] = useState("");

  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedStudentName, setSelectedStudentName] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  // ---------------- LOAD LEADERBOARD ----------------
  async function loadAll() {
    setLoading(true);
    setError(null);

    try {
      const studentsRes = await API.get("/students");
      const students = studentsRes.data?.students || [];

      const lbRes = await API.get(
        `/leaderboard?perPage=${students.length || 1}&page=1`
      );
      const lbData = lbRes.data || {};

      const leaderboardFull = Array.isArray(lbData.pageList)
        ? lbData.pageList
        : Array.isArray(lbData.top3)
        ? lbData.top3
        : [];

      const lbMap = {};
      leaderboardFull.forEach((r) => {
        lbMap[String(r.studentId)] = {
          score: Number(r.score || 0),
          rank: Number(r.rank || null),
        };
      });

      if (Array.isArray(lbData.top3)) {
        lbData.top3.forEach((t) => {
          if (!lbMap[String(t.studentId)]) {
            lbMap[String(t.studentId)] = {
              score: Number(t.score || 0),
              rank: Number(t.rank || null),
            };
          }
        });
      }

      const merged = students.map((s) => {
        const id = String(s._id);
        const found = lbMap[id] || { score: 0, rank: null };
        return {
          studentId: id,
          name: s.name || s.email || "Unknown",
          email: s.email || "",
          className: s.className || "",
          score: found.score,
          rank: found.rank,
        };
      });

      merged.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (a.name || "").localeCompare(b.name || "");
      });

      let currentRank = 0;
      let lastScore = null;

      merged.forEach((item, idx) => {
        if (lastScore === null || item.score !== lastScore) {
          currentRank = idx + 1;
          lastScore = item.score;
        }
        item.rank = item.score > 0 ? currentRank : null;
      });

      const topThree = merged.slice(0, 3).map((m, i) => ({
        studentId: m.studentId,
        name: m.name,
        score: m.score,
        rank: m.rank ?? i + 1,
      }));

      setCombinedList(merged);
      setTop3(topThree);
    } catch (err) {
      setError("Failed to load leaderboard");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // ---------------- DOWNLOAD REPORT ----------------
  const downloadReport = async (type) => {
    try {
      const res = await API.get(
        `/leaderboard/report?type=${type}`,
        { responseType: "blob" } // IMPORTANT
      );

      const blob = new Blob([res.data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leaderboard_${type}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Report download failed. Please login again.");
      console.error(err);
    }
  };

  // ---------------- PAGINATION + SEARCH ----------------
  const total = combinedList.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const pageItems = combinedList.slice(start, start + perPage);

  const filtered = pageItems.filter((u) => {
    const t = query.trim().toLowerCase();
    if (!t) return true;
    return (
      (u.name || "").toLowerCase().includes(t) ||
      (u.email || "").toLowerCase().includes(t) ||
      (u.studentId || "").toLowerCase().includes(t)
    );
  });

  // ---------------- UI ----------------
  return (
    <div className="adm-leaderboard-root">
      <div className="adm-leadercard">

        {/* HEADER */}
        <div className="adm-leader-header">
          <h2>Leaderboard (Admin)</h2>

          {/* DOWNLOAD */}
          <select
            className="adm-report-select"
            onChange={(e) => {
              const type = e.target.value;
              if (!type) return;
              downloadReport(type);
              e.target.value = "";
            }}
          >
            <option value="">Download Report</option>
            <option value="today">Today</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="upto">Upto Today</option>
          </select>

          <div className="adm-leader-controls">
            <input
              className="adm-leader-search"
              placeholder="Search by name, email or id"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
            <button className="adm-btn" onClick={loadAll}>Refresh</button>
          </div>
        </div>

        {loading && <div className="adm-loading">Loading leaderboard…</div>}
        {error && <div className="adm-error">{error}</div>}

        {!loading && !error && (
          <>
            {/* TOP 3 */}
            <div className="adm-topcards">
              {top3.map((item, i) => {
                const cls = i === 0 ? "gold" : i === 1 ? "silver" : "bronze";
                return (
                  <div key={item.studentId} className={`adm-topcard ${cls}`}>
                    <div className="adm-medal">{i + 1}</div>
                    <div className="adm-top-body">
                      <div className="adm-top-name">{item.name}</div>
                      <div className="adm-top-score">{item.score}</div>
                      <div className="adm-top-rank">Rank {item.rank}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* LIST */}
            <div className="adm-list-wrap">
              <div className="adm-list-head">
                <div>Name</div>
                <div></div>
                <div>Rank and Score</div>
                <div style={{ width: 160 }}>Actions</div>
              </div>

              <div className="adm-list-body">
                {filtered.map((u) => (
                  <div key={u.studentId} className="adm-row">
                    <div className="adm-col-name">
                      <div className="adm-pill">
                        <div className="adm-avatar">
                          {(u.name || "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="adm-username">{u.name}</div>
                          <div className="adm-email">{u.email}</div>
                        </div>
                      </div>
                    </div>

                    <div className="adm-rank-score-box">
                      <div>{u.rank ?? "—"}</div>
                      <div>{u.score}</div>
                    </div>

                    <div className="adm-col-actions">
                      <button
                        className="adm-link"
                        onClick={() => {
                          setSelectedStudentId(u.studentId);
                          setSelectedStudentName(u.name);
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="adm-pager">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                  Prev
                </button>
                <span>Page {page} / {pages}</span>
                <button disabled={page === pages} onClick={() => setPage(p => p + 1)}>
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedStudentId && (
        <StudentLeaderboard
          studentId={selectedStudentId}
          studentName={selectedStudentName}
          onClose={() => setSelectedStudentId(null)}
        />
      )}
    </div>
  );
}
