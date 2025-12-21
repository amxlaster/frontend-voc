// frontend/src/super-admin/quotes/EditQuote.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../lib/api";
import Layout from "../../components/Layout";
import PageHeader from "../../components/PageHeader";

export default function EditQuote() {
  const { id } = useParams();
  const nav = useNavigate();

  const [form, setForm] = useState({ text: "", author: "" });

  useEffect(() => {
    const load = async () => {
      try {
        // ⭐ Load quotes normally (YOUR API HAS NO /quotes/:id)
        const res = await API.get("/quotes");
        const q = res.data.quotes.find((x) => x._id === id);

        if (!q) {
          alert("Quote not found");
          return nav("/super-admin/quotes");  // ⭐ FIXED
        }

        setForm({ text: q.text, author: q.author });

      } catch (err) {
        alert("Failed to load quote");
        nav("/super-admin/quotes");  // ⭐ FIXED
      }
    };

    load();
  }, [id, nav]);

  const submit = async (e) => {
    e.preventDefault();

    await API.put(`/quotes/${id}`, form);

    // ⭐ FIXED REDIRECT
    nav("/super-admin/quotes");
  };

  return (
    <Layout>
      <PageHeader title="Edit Quote" />

      <form className="quotes-form" onSubmit={submit}>
        <label>Quote Text</label>
        <textarea
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          required
        />

        <label>Author</label>
        <input
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />

        <button className="btn-primary">Update</button>
      </form>
    </Layout>
  );
}
