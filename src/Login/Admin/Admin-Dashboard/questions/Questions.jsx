import React, { useEffect, useState } from "react";
import API from "../../../../lib/api";
import "./Questions.css";

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [dateFilterType, setDateFilterType] = useState("all"); // all | today | specific | range
  const [singleDate, setSingleDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Lightbox modal state
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    // Reset page to 1 when filters change
    setPage(1);
  }, [dateFilterType, singleDate, startDate, endDate, sortBy]);

  useEffect(() => {
    fetchQuestions();
  }, [page, dateFilterType, singleDate, startDate, endDate, sortBy]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page,
        limit: 10,
        search,
        sortBy,
      };

      if (dateFilterType === "today") {
        const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local time
        params.date = todayStr;
      } else if (dateFilterType === "specific" && singleDate) {
        params.date = singleDate;
      } else if (dateFilterType === "range" && startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const res = await API.get("/quiz/admin/questions", { params });
      if (res.data.success) {
        setQuestions(res.data.questions || []);
        setTotal(res.data.total || 0);
        setPages(res.data.pages || 1);
      } else {
        setError("Failed to fetch questions");
      }
    } catch (err) {
      console.error("Fetch questions error:", err);
      setError(err.response?.data?.message || "Server error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchQuestions();
  };

  const getOptionLetter = (index) => {
    return ["A", "B", "C", "D"][index] || "";
  };

  const formatLevel = (level) => {
    if (!level) return "—";
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  return (
    <div className="aq-container py-4">
      {/* Title */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1 text-gray-800 fw-bold">❓ Quiz Question Bank</h1>
          <p className="text-muted mb-0">Review and query quiz questions uploaded by Super Admin</p>
        </div>
        <span className="badge bg-secondary px-3 py-2 fs-6 shadow-sm align-self-start align-self-sm-center" style={{ borderRadius: "20px" }}>
          Total Questions: {total}
        </span>
      </div>

      {/* Filter Card */}
      <div className="card shadow-sm border-0 mb-4 p-3 p-md-4 aq-filter-card" style={{ borderRadius: "15px" }}>
        <form onSubmit={handleSearchSubmit} className="aq-filter-form">
          
          {/* Search Input */}
          <div className="aq-filter-item-search">
            <label className="form-label fw-bold text-dark">Search Questions</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search by text, quiz title, date..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ borderRadius: "10px 0 0 10px" }}
              />
              <button className="btn btn-primary text-white" type="submit" style={{ borderRadius: "0 10px 10px 0" }}>
                Search
              </button>
            </div>
          </div>

          {/* Date Filter Selection */}
          <div className="aq-filter-item-sm">
            <label className="form-label fw-bold text-dark">Date Filter</label>
            <select
              className="form-select"
              value={dateFilterType}
              onChange={(e) => setDateFilterType(e.target.value)}
              style={{ borderRadius: "10px" }}
            >
              <option value="all">All Dates</option>
              <option value="today">Today's Questions</option>
              <option value="specific">Specific Date</option>
              <option value="range">Date Range</option>
            </select>
          </div>

          {/* Conditional Date Picker Inputs */}
          {dateFilterType === "specific" && (
            <div className="aq-filter-item-sm">
              <label className="form-label fw-bold text-dark">Choose Date</label>
              <input
                type="date"
                className="form-control"
                value={singleDate}
                onChange={(e) => setSingleDate(e.target.value)}
                style={{ borderRadius: "10px" }}
              />
            </div>
          )}

          {dateFilterType === "range" && (
            <>
              <div className="aq-filter-item-sm">
                <label className="form-label fw-bold text-dark">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ borderRadius: "10px" }}
                />
              </div>
              <div className="aq-filter-item-sm">
                <label className="form-label fw-bold text-dark">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ borderRadius: "10px" }}
                />
              </div>
            </>
          )}

          {/* Sorting */}
          <div className="aq-filter-item-sm">
            <label className="form-label fw-bold text-dark">Sort By</label>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ borderRadius: "10px" }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

        </form>
      </div>

      {/* Questions Data */}
      {error && <div className="alert alert-danger shadow-sm" style={{ borderRadius: "10px" }}>⚠️ {error}</div>}

      <div className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: "15px" }}>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Retrieving questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-5 bg-white">
            <h4 className="text-muted">No Questions Found</h4>
            <p className="text-muted mb-0">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View (lg screens and up) */}
            <div className="aq-table-wrap d-none d-lg-block">
              <table className="table table-hover align-middle mb-0 aq-table">
                <thead>
                  <tr>
                    <th style={{ width: "80px" }}>Quiz Level</th>
                    <th style={{ width: "200px" }}>Question Text</th>
                    <th style={{ width: "90px" }}>Image</th>
                    <th style={{ width: "250px" }}>Options (A, B, C, D)</th>
                    <th style={{ width: "130px" }}>Correct Answer</th>
          
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {questions.map((q) => (
                    <tr key={q._id}>
                      <td>
                        <span className={`badge ${
                          q.level === "beginner" 
                            ? "bg-success" 
                            : q.level === "intermediate" 
                            ? "bg-warning text-dark" 
                            : "bg-danger"
                        }`} style={{ borderRadius: "5px" }}>
                          {formatLevel(q.level)}
                        </span>
                      </td>
                      <td className="fw-semibold text-dark aq-qtext">{q.question}</td>
                      <td>
                        {q.imageUrl ? (
                          <div 
                            className="aq-img-thumb-container" 
                            onClick={() => setPreviewImage(q.imageUrl)}
                            title="Click to preview high quality image"
                          >
                            <img src={q.imageUrl} alt="Quiz Question" className="aq-img-thumb img-thumbnail" />
                          </div>
                        ) : (
                          <span className="text-muted small">No Image</span>
                        )}
                      </td>
                      <td>
                        <div className="aq-options-grid">
                          <div className="small mb-1">
                            <strong>A:</strong> {q.options[0] || "—"}
                          </div>
                          <div className="small mb-1">
                            <strong>B:</strong> {q.options[1] || "—"}
                          </div>
                          <div className="small mb-1">
                            <strong>C:</strong> {q.options[2] || "—"}
                          </div>
                          <div className="small mb-1">
                            <strong>D:</strong> {q.options[3] || "—"}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-primary text-white p-2" style={{ borderRadius: "5px" }}>
                          Option {getOptionLetter(q.correctIndex)}: {q.options[q.correctIndex] || "—"}
                        </span>
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View (md screens and below) */}
            <div className="aq-cards-list d-block d-lg-none">
              {questions.map((q) => (
                <div key={q._id} className="aq-question-card">
                  <div className="aq-card-header">
                    <span className={`badge ${
                      q.level === "beginner" 
                        ? "bg-success" 
                        : q.level === "intermediate" 
                        ? "bg-warning text-dark" 
                        : "bg-danger"
                    }`} style={{ borderRadius: "5px" }}>
                      {formatLevel(q.level)}
                    </span>
                    <div className="aq-card-date-info">
                      <span>{q.date}</span>
                      <span style={{ fontSize: "10px" }}>
                        ({new Date(q.createdAt).toLocaleDateString()})
                      </span>
                    </div>
                  </div>
                  
                  <div className="aq-card-body">
                    <p className="aq-card-qtext">{q.question}</p>
                    
                    {q.imageUrl && (
                      <div 
                        className="aq-card-img-container" 
                        onClick={() => setPreviewImage(q.imageUrl)}
                        title="Click to preview high quality image"
                      >
                        <img src={q.imageUrl} alt="Question" />
                        <span className="aq-card-img-overlay">🔍 Click to zoom</span>
                      </div>
                    )}
                    
                    <div className="aq-card-options">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = optIdx === q.correctIndex;
                        return (
                          <div key={optIdx} className={`aq-card-option-item ${isCorrect ? "correct" : ""}`}>
                            <strong>{getOptionLetter(optIdx)}:</strong> {opt || "—"}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="aq-card-footer">
                    <div className="aq-card-correct-badge">
                      🎯 Correct Answer: Option {getOptionLetter(q.correctIndex)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        {/* Pagination Footer */}
        {!loading && questions.length > 0 && (
          <div className="card-footer bg-light border-0 d-flex align-items-center justify-content-between p-3 flex-wrap gap-2">
            <span className="text-muted small">
              Page <strong>{page}</strong> of <strong>{pages}</strong> (Showing 10 questions per page)
            </span>
            
            <nav aria-label="Page navigation">
              <ul className="pagination pagination-sm mb-0 align-items-center" style={{ gap: "4px" }}>
                
                {/* Previous */}
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setPage(p => Math.max(1, p - 1))}>
                    Previous
                  </button>
                </li>

                {/* Page numbers */}
                {(() => {
                  const maxVisible = 5;
                  let startPage = Math.max(1, page - 2);
                  let endPage = Math.min(pages, startPage + maxVisible - 1);
                  
                  if (endPage - startPage < maxVisible - 1) {
                    startPage = Math.max(1, endPage - maxVisible + 1);
                  }
                  
                  const pageNums = [];
                  for (let i = startPage; i <= endPage; i++) {
                    pageNums.push(i);
                  }
                  
                  return pageNums.map((currP) => (
                    <li key={currP} className={`page-item ${page === currP ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setPage(currP)}>
                        {currP}
                      </button>
                    </li>
                  ));
                })()}

                {/* Next */}
                <li className={`page-item ${page === pages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setPage(p => Math.min(pages, p + 1))}>
                    Next
                  </button>
                </li>

              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Image Lightbox Modal */}
      {previewImage && (
        <div
          className="modal show d-block aq-lightbox"
          tabIndex="-1"
          onClick={() => setPreviewImage(null)}
          style={{ backgroundColor: "rgba(0,0,0,0.85)", zIndex: 1100 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-xl aq-lightbox-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 bg-transparent">
              <div className="modal-body p-0 text-center position-relative">
                
                {/* Close Button */}
                <button
                  type="button"
                  className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                  style={{ zIndex: 1200, fontSize: "20px" }}
                  onClick={() => setPreviewImage(null)}
                ></button>
                
                <img
                  src={previewImage}
                  alt="High Quality Preview"
                  className="aq-lightbox-img"
                  style={{
                    maxWidth: "95vw",
                    maxHeight: "85vh",
                    objectFit: "contain",
                    borderRadius: "8px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
