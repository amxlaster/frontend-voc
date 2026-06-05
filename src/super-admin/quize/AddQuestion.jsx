import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../lib/api";
import Layout from "../../components/Layout";
import PageHeader from "../../components/PageHeader";

import "./AddQuestion.css"
export default function AddQuestion() {
  const { date, level } = useParams();
  const nav = useNavigate();

  const [q, setQ] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const submit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("date", date);
    form.append("level", level);
    form.append("question", q);
    form.append("correctIndex", correct);
    form.append("options", JSON.stringify(options));

    if (image) form.append("image", image);

    await API.post("/quiz", form);
    nav(`/super-admin/quiz/${date}/${level}`);
  };

  return (
    <Layout>
      <PageHeader title="Add Question" />
      <form className="card" style={{ padding: 20 }} onSubmit={submit}>
        <input
  value={q}
  onChange={(e) => setQ(e.target.value)}
  placeholder="Question"
  required
/>

{options.map((op, i) => (
  <input
    key={i}
    value={op}
    placeholder={`Option ${i + 1}`}
    onChange={(e) => {
      const c = [...options];
      c[i] = e.target.value;
      setOptions(c);
    }}
    required
  />
))}


        <select value={correct} onChange={(e) => setCorrect(e.target.value)}>
          <option value={0}>Option 1</option>
          <option value={1}>Option 2</option>
          <option value={2}>Option 3</option>
          <option value={3}>Option 4</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setImage(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
          }}
        />

        {preview && <img src={preview} width={120} />}
        <button>Save</button>
      </form>
    </Layout>
  );
}
