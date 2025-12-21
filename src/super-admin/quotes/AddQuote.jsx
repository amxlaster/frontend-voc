// frontend/src/super-admin/quotes/AddQuote.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../lib/api";
import Layout from "../../components/Layout";
import PageHeader from "../../components/PageHeader";
import "./AddQuote.css"

export default function AddQuote() {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    await API.post("/quotes", { text, author });

    // ⭐ FIXED ROUTE
    nav("/super-admin/quotes");
  };

  return (
    <Layout>
      <PageHeader title="Add Quote" />

      <form className="quotes-form" onSubmit={submit}>
        <label>Quote Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />

        <label>Author</label>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <button className="btn-primary">Save</button>
      </form>
    </Layout>
  );
}
