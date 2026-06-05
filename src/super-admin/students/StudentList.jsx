// frontend/src/super-admin/students/StudentList.jsx
import { useEffect, useMemo, useState } from "react";
import API from "../../lib/api";
import { Link } from "react-router-dom";
import "./StudentList.css";
import PageHeader from "../../components/PageHeader";
import Layout from "../../components/Layout";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/students");
      setStudents(res.data?.students || []);
    } catch {
      setError("Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return students;
    return students.filter(
      (s) =>
        (s.name || "").toLowerCase().includes(t) ||
        (s.email || "").toLowerCase().includes(t) ||
        (s.phone || "").includes(t)
    );
  }, [students, q]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  useEffect(() => {
    if (page > pages) setPage(pages);
  }, [pages]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this student?")) return;
    try {
      setDeleting(id);
      await API.delete(`/students/${id}`);
      setStudents((s) => s.filter((u) => u._id !== id));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Layout>
      <div className="sa-student-root sa-student-page">
        <PageHeader
          title="Students"
          extra={
            <Link
              to="/super-admin/student/create"
              className="sa-student-btn sa-student-primary"
            >
              + Create Student
            </Link>
          }
        />

        <div className="sa-student-header">
          <p className="sa-student-muted">
            Manage students (search, edit, delete)
          </p>

          <div className="sa-student-actions">
            <input
              className="sa-student-search"
              placeholder="Search by name, email or phone"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="sa-student-body">
          {loading ? (
            <div className="sa-student-empty">Loading students…</div>
          ) : error ? (
            <div className="sa-student-empty">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="sa-student-empty">No students found.</div>
          ) : (
            <>
              {/* ===== DESKTOP / TABLET TABLE ===== */}
              <div className="sa-student-table-wrap">
                <table className="sa-student-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Class</th>
                      <th style={{ width: 160 }}>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pageItems.map((s) => (
                      <tr key={s._id}>
                        <td>{s.name || "—"}</td>
                        <td>{s.email}</td>
                        <td>{s.phone}</td>
                        <td>{s.className}</td>
                        <td>
                          <Link
                            to={`/super-admin/student/edit/${s._id}`}
                            className="sa-student-link"
                          >
                            Edit
                          </Link>
                          <button
                            className="sa-student-link sa-student-danger"
                            disabled={deleting === s._id}
                            onClick={() => handleDelete(s._id)}
                          >
                            {deleting === s._id ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ===== MOBILE CARDS ===== */}
              <div className="sa-student-cards">
                {pageItems.map((s) => (
                  <div className="sa-student-card" key={s._id}>
                    <div><b>Name:</b> {s.name || "—"}</div>
                    <div><b>Email:</b> {s.email}</div>
                    <div><b>Phone:</b> {s.phone}</div>
                    <div><b>Class:</b> {s.className}</div>

                    <div className="sa-student-card-actions">
                      <Link
                        to={`/super-admin/student/edit/${s._id}`}
                        className="sa-student-link"
                      >
                        Edit
                      </Link>
                      <button
                        className="sa-student-link sa-student-danger"
                        onClick={() => handleDelete(s._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ===== PAGINATION ===== */}
              <div className="sa-student-pager">
                <div className="sa-student-muted">
                  Showing {start + 1} -{" "}
                  {Math.min(start + perPage, total)} of {total}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="sa-student-btn sa-student-outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Prev
                  </button>

                  <span className="sa-student-pager-num">
                    Page {page} / {pages}
                  </span>

                  <button
                    className="sa-student-btn sa-student-outline"
                    onClick={() => setPage((p) => Math.min(p + 1, pages))}
                    disabled={page === pages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
