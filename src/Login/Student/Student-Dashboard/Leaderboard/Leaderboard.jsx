// frontend/src/pages/Leaderboard/Leaderboard.jsx
import React, { useEffect, useState } from "react";
import API from "../../../../lib/api";
import "./Leaderboard.css";

export default function Leaderboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [top3, setTop3] = useState([]);
  const [pageList, setPageList] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    // initial load with focus so current student is on the page
    loadPage({ focus: true, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadPage({ focus = false, page = 1 } = {}) {
    setLoading(true);
    setError(null);
    try {
      // request leaderboard; focus=true makes server return the page containing the logged-in student
      const q = `?perPage=${perPage}&page=${page}${focus ? "&focus=true" : ""}`;
      const res = await API.get(`/leaderboard${q}`);
      const data = res.data || {};
      setTop3(Array.isArray(data.top3) ? data.top3 : []);
      setPageList(Array.isArray(data.pageList) ? data.pageList : []);
      setPage(data.page || page);
      setTotalCount(Number(data.totalCount || 0));
      setUserRank(data.userRank ?? null);
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
      setError("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

  const handlePrev = () => {
    if (page <= 1) return;
    loadPage({ page: page - 1 });
  };
  const handleNext = () => {
    if (page >= totalPages) return;
    loadPage({ page: page + 1 });
  };

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h1>See Where You Are :)</h1>
      </div>

      {loading && <div className="leaderboard-loading">Loading leaderboard...</div>}
      {error && <div className="leaderboard-error">{error}</div>}

      {!loading && (
        <>
          <div className="leaderboard-topcards">
            {[0, 1, 2].map((i) => {
              const item = top3[i];
              const place = i + 1;
              const medalClass = place === 1 ? "gold" : place === 2 ? "silver" : "bronze";
              return (
                <div key={i} className={`topcard ${medalClass}`}>
                  <div className="topcard-medal">
                    <span className="medal-icon">{place}</span>
                  </div>
                  <div className="topcard-content">
                    <div className="topcard-name">{item ? item.name : "—"}</div>
                    <div className="topcard-score">{item ? item.score : 0}</div>
                    {item && item.rank && <div className="topcard-rank">Rank {item.rank}</div>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="leaderboard-list-wrapper">
            <div className="leaderboard-list-header">
              <div>Username</div>
              <div>Rank</div>
              <div>Score</div>
            </div>

            <div className="leaderboard-list">
              {pageList.map((u, idx) => (
                <div
                  key={u.studentId || idx}
                  className={`leaderboard-row ${u.isYou ? "leader-you" : ""}`}
                >
                  <div className="col-username">
                    <div className="user-pill">
                      <div className="avatar-fallback">{(u.name || "U").charAt(0).toUpperCase()}</div>
                      <span className="username-text">{u.name}</span>
                    </div>
                  </div>
                  <div className="col-rank">{u.rank}</div>
                  <div className="col-score">{u.score}</div>
                </div>
              ))}
            </div>

            <div className="leaderboard-pager">
              <div className="pager-info">
                Showing page {page} of {totalPages} — total {totalCount} students
                {userRank ? ` — Your rank: ${userRank}` : ""}
              </div>

              <div className="pager-controls">
                <button onClick={handlePrev} disabled={page <= 1}>Prev</button>
                <button onClick={handleNext} disabled={page >= totalPages}>Next</button>
                <button onClick={() => loadPage({ focus: true })}>Go to My Rank</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
