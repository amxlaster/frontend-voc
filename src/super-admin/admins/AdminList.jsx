// frontend/src/super-admin/admins/AdminList.jsx
import { useEffect, useMemo, useState } from "react";
import API from "../../lib/api";
import { Link } from "react-router-dom";
import "./AdminList.css";
import PageHeader from "../../components/PageHeader";
import Layout from "../../components/Layout";

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/admins");
      setAdmins(res.data?.admins || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load admins.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return admins;
    return admins.filter(
      (a) =>
        (a.name || "").toLowerCase().includes(term) ||
        (a.email || "").toLowerCase().includes(term) ||
        (a.phone || "").includes(term)
    );
  }, [admins, q]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  useEffect(() => {
    if (page > pages) setPage(pages);
  }, [pages]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this admin?")) return;
    try {
      await API.delete(`/admins/${id}`);
      setAdmins((s) => s.filter((u) => u._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <Layout>
      <div className="sa-admin-root sa-admin-list-page">

        <PageHeader
          title="Admins"
          extra={
            // ⭐ FIXED create button
            <Link
              to="/super-admin/admin/create"
              className="sa-admin-btn sa-admin-primary list-btn"
            >
              + Create Admin
            </Link>
          }
        />

        <div className="sa-admin-header">
          <p className="sa-admin-muted">Create, update and remove admin accounts</p>

          <div className="sa-admin-actions">
            <input
              className="sa-admin-search"
              placeholder="Search by name, email or phone"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="sa-admin-body">

          {loading ? (
            <div className="sa-admin-empty">Loading admins…</div>
          ) : error ? (
            <div className="sa-admin-empty">
              <strong>{error}</strong>
              <div style={{ marginTop: 12 }}>
                <button className="sa-admin-btn sa-admin-primary" onClick={load}>
                  Retry
                </button>
              </div>
            </div>
          ) : admins.length === 0 ? (
            <div className="sa-admin-empty">
              No admins found.
              <div style={{ marginTop: 12 }}>
                {/* ⭐ FIXED no admins create button */}
                <Link to="/super-admin/admin/create" className="sa-admin-btn sa-admin-primary">
                  Create Admin
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="sa-admin-grid-cards">
                {pageItems.map((a) => (
                  <div className="sa-admin-mini-card" key={a._id}>
                    <div className="sa-admin-mini-left">
                      <div className="sa-admin-avatar">
                        {(a.name || a.email || "A").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="sa-admin-name">{a.name}</div>
                        <div className="sa-admin-muted sa-admin-small">{a.email}</div>
                        <div className="sa-admin-muted sa-admin-small">📞 {a.phone}</div>
                      </div>
                    </div>

                    <div className="sa-admin-mini-actions">
                      {/* ⭐ FIXED EDIT ROUTE */}
                      <Link
                        to={`/super-admin/admin/edit/${a._id}`}
                        className="sa-admin-link"
                      >
                        Edit
                      </Link>

                      <button
                        className="sa-admin-link sa-admin-danger"
                        onClick={() => handleDelete(a._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="sa-admin-pager">
                <div className="sa-admin-muted">
                  Showing {start + 1} - {Math.min(start + perPage, total)} of {total}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="sa-admin-btn sa-admin-outline"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </button>

                  <span>
                    Page {page} / {pages}
                  </span>

                  <button
                    className="sa-admin-btn sa-admin-outline"
                    disabled={page === pages}
                    onClick={() => setPage((p) => Math.min(p + 1, pages))}
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
