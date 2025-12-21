// frontend/src/super-admin/quize/QuizList.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../../lib/api";
import Layout from "../../components/Layout";
import PageHeader from "../../components/PageHeader";

export default function QuizList() {
  const { date, level } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await API.get(`/quiz/${date}/${level}`);
    setQuestions(res.data.questions);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [date, level]);

  const remove = async (id) => {
    if (!confirm("Delete this question?")) return;
    await API.delete(`/quiz/${id}`);
    load();
  };

  return (
    <Layout>
      <PageHeader
        title={`Questions — ${level.toUpperCase()} (${date})`}
        extra={
          <Link
            to={`/super-admin/quiz/${date}/${level}/add`}
            className="btn-primary"
          >
            + Add Question
          </Link>
        }
      />

      {loading ? (
        <p>Loading...</p>
      ) : questions.length === 0 ? (
        <p>No questions found.</p>
      ) : (
        <div className="sa-admin-grid-cards">
          {questions.map((q) => (
            <div key={q._id} className="sa-admin-mini-card">
              <div>
                <strong>{q.question}</strong>

                <ul>
                  {q.options.map((op, i) => (
                    <li key={i}>
                      {op} {i === q.correctIndex && "✔️"}
                    </li>
                  ))}
                </ul>

                {q.imageUrl && (
                  <img
                    src={q.imageUrl}
                    alt="quiz"
                    style={{ width: 80, marginTop: 8, borderRadius: 4 }}
                  />
                )}
              </div>

              <div className="sa-admin-mini-actions">
                <Link
                  to={`/super-admin/quiz/${date}/${level}/edit/${q._id}`}
                  className="sa-admin-link"
                >
                  Edit
                </Link>

                <button
                  onClick={() => remove(q._id)}
                  className="sa-admin-link sa-admin-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
