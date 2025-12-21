// frontend/src/admin/students/StudentList.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../../../../lib/api";
import "./StudentList.css";

export default function StudentList() {
  const navigate = useNavigate(); 
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      setError("");
      setLoading(true);
      const res = await API.get("/students");
      setStudents(res.data.students || []);
    } catch (err) {
      console.error("Failed to load students:", err);
      setError("Failed to load students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }

  const total = students.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const pageItems = useMemo(
    () => students.slice(start, start + perPage),
    [students, start]
  );

  useEffect(() => {
    if (page > pages) setPage(pages);
  }, [pages, page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      setDeleting(id);
      await API.delete(`/students/${id}`);
      setStudents((s) => s.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete student.");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <div className="studentlist-root"><div className="studentlist-loading">Loading students…</div></div>;
  if (error) return <div className="studentlist-root"><div className="studentlist-error">{error}</div></div>;

  return (
    <div className="studentlist-root">
      <div className="studentlist-card">
        <div className="studentlist-header">
          <h3>Students</h3>
        </div>

        <div className="studentlist-wrap">
          <div className="studentlist-list-mobile">
  {pageItems.map((s) => (
    <div key={s._id} className="student-mobile-card">

      <div className="student-mobile-line">
        Name: <span className="student-mobile-value">{s.name || "—"}</span>
      </div>

      <div className="student-mobile-line">
        Email: <span className="student-mobile-value">{s.email || "—"}</span>
      </div>

      <div className="student-mobile-line">
        Phone: <span className="student-mobile-value">{s.phone || "—"}</span>
      </div>

      <div className="student-mobile-line">
        Class: <span className="student-mobile-value">{s.className || "—"}</span>
      </div>

      <div className="student-mobile-actions">
        <button
          className="student-mobile-btn student-mobile-view"
          onClick={() => navigate(`/admin/student/${s._id}`)}
        >
          View
        </button>

        <button
          className="student-mobile-btn student-mobile-delete"
          onClick={() => handleDelete(s._id)}
        >
          Delete
        </button>
      </div>

    </div>
  ))}
</div>

          <table className="studentlist-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Class</th>
              </tr>
            </thead>

            <tbody>
              {pageItems.map((s) => (
                <tr key={s._id}>
                  <td>
                    <Link to={`/admin/student/${s._id}`} className="student-name-link">
                      {s.name || "—"}
                    </Link>
                  </td>
                  <td className="mono">{s.email || "—"}</td>
                  <td className="mono">{s.phone || "—"}</td>
                  <td>{s.className || "—"}</td>
                </tr>
              ))}

              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: 24, textAlign: "center" }}>
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="studentlist-footer">
          <div className="studentlist-meta">
            Showing {total === 0 ? 0 : start + 1} - {Math.min(start + perPage, total)} of {total}
          </div>

          <div className="studentlist-pager">
            <button
              className="pager-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </button>

            <div className="pager-info">Page {page} / {pages}</div>

            <button
              className="pager-btn"
              onClick={() => setPage((p) => Math.min(p + 1, pages))}
              disabled={page === pages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
