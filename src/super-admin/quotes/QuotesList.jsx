// frontend/src/super-admin/quotes/QuotesList.jsx
import { useEffect, useMemo, useState } from "react";
import API from "../../lib/api";
import { Link } from "react-router-dom";
import "./QuotesList.css";
import PageHeader from "../../components/PageHeader";
import Layout from "../../components/Layout";

export default function QuotesList() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get("/quotes");
      setQuotes(res.data.quotes || []);
    } catch (err) {
      setError("Failed to load quotes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return quotes;
    return quotes.filter(
      (r) =>
        r.text.toLowerCase().includes(t) ||
        (r.author || "").toLowerCase().includes(t)
    );
  }, [quotes, q]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  const remove = async (id) => {
    if (!confirm("Delete this quote?")) return;
    try {
      await API.delete(`/quotes/${id}`);
      setQuotes((s) => s.filter((q) => q._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <Layout>
      <div className="quotes-root">
        
        <PageHeader
          title="Quotes"
          extra={
            // ⭐ FIXED ROUTE
            <Link to="/super-admin/quotes/add" className="quotes-btn primary">
              + Add Quote
            </Link>
          }
        />

        <div className="quotes-top">
          <input
            className="quotes-search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search quotes..."
          />
        </div>

        {loading ? (
          <div className="quotes-empty">Loading...</div>
        ) : error ? (
          <div className="quotes-empty">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="quotes-empty">No quotes found.</div>
        ) : (
          <>
            <div className="quotes-table-wrap">
              <table className="quotes-table">
                <thead>
                  <tr>
                    <th>Quote</th>
                    <th>Author</th>
                    <th style={{ width: 150 }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {pageItems.map((r) => (
                    <tr key={r._id}>
                      <td>{r.text}</td>
                      <td>{r.author || "—"}</td>

                      <td>
                        {/* ⭐ FIXED EDIT ROUTE */}
                        <Link
                          to={`/super-admin/quotes/edit/${r._id}`}
                          className="quotes-link"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => remove(r._id)}
                          className="quotes-link danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

            <div className="quotes-pager">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                Prev
              </button>

              <span>
                Page {page} / {pages}
              </span>

              <button
                disabled={page === pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>

          </>
        )}

      </div>
    </Layout>
  );
}
