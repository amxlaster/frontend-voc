import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../lib/api";
import Layout from "../../components/Layout";
import PageHeader from "../../components/PageHeader";
import "./EditQuestion.css"

export default function EditQuestion() {
  const { date, level, id } = useParams();
  const nav = useNavigate();

  const [q, setQ] = useState("");
  const [options, setOptions] = useState([]);
  const [correct, setCorrect] = useState(0);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    API.get(`/quiz/${date}/${level}`).then((res) => {
      const found = res.data.questions.find((x) => x._id === id);
      setQ(found.question);
      setOptions(found.options);
      setCorrect(found.correctIndex);
      setPreview(found.imageUrl);
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("question", q);
    form.append("correctIndex", correct);
    form.append("options", JSON.stringify(options));
    if (image) form.append("image", image);

    await API.put(`/quiz/${id}`, form);
    nav(`/super-admin/quiz/${date}/${level}`);
  };

  return (
    <Layout>
      <PageHeader title="Edit Question" />
      <form onSubmit={submit}>
        <input value={q} onChange={(e) => setQ(e.target.value)} />

        {options.map((op, i) => (
          <input
            key={i}
            value={op}
            onChange={(e) => {
              const c = [...options];
              c[i] = e.target.value;
              setOptions(c);
            }}
          />
        ))}

        <select value={correct} onChange={(e) => setCorrect(e.target.value)}>
          <option value={0}>Option 1</option>
          <option value={1}>Option 2</option>
          <option value={2}>Option 3</option>
          <option value={3}>Option 4</option>
        </select>

        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        {preview && <img src={preview} width={120} />}

        <button>Update</button>
      </form>
    </Layout>
  );
}
