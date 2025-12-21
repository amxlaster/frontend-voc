// frontend/src/super-admin/students/EditStudent.jsx
import { useEffect, useState } from "react";
import API from "../../lib/api";
import { useNavigate, useParams } from "react-router-dom";
import "./EditStudent.css";
import PageHeader from "../../components/PageHeader";
import Layout from "../../components/Layout";

export default function EditStudent() {
  const { id } = useParams();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    className: "",
    password: ""
  });

  useEffect(() => {
    API.get(`/students/${id}`)
      .then((res) => {
        const s = res.data.student;
        setForm({
          name: s.name,
          email: s.email,
          phone: s.phone,
          dob: s.dob,
          gender: s.gender,
          className: s.className,
          password: ""
        });
      })
      .catch(() => {
        alert("Student not found");
        
        // ⭐ FIXED redirect
        nav("/super-admin/student");
      })
      .finally(() => setLoading(false));
  }, [id, nav]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      phone: form.phone,
      dob: form.dob,
      gender: form.gender,
      className: form.className
    };

    if (form.password) payload.password = form.password;

    try {
      await API.put(`/students/${id}`, payload);
      alert("Updated");

      // ⭐ FIXED redirect
      nav("/super-admin/student");

    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading…</div>;

  return (
    <Layout>
      <PageHeader title="Edit Student" />

      <div className="sa-edit-student-card">
        <form onSubmit={submit} className="sa-edit-student-form-grid">

          <label>
            <span>Name</span>
            <input 
              value={form.name}
              onChange={(e) => setForm(s => ({ ...s, name: e.target.value }))} 
            />
          </label>

          <label>
            <span>Email (read-only)</span>
            <input value={form.email} readOnly />
          </label>

          <label>
            <span>Phone</span>
            <input 
              value={form.phone}
              onChange={(e) => setForm(s => ({ ...s, phone: e.target.value }))} 
            />
          </label>

          <label>
            <span>Date of Birth</span>
            <input 
              type="date"
              value={form.dob}
              onChange={(e) => setForm(s => ({ ...s, dob: e.target.value }))} 
            />
          </label>

          <label>
            <span>Gender</span>
            <select 
              value={form.gender}
              onChange={(e) => setForm(s => ({ ...s, gender: e.target.value }))} 
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>

          <label>
            <span>Class</span>
            <input 
              value={form.className}
              onChange={(e) => setForm(s => ({ ...s, className: e.target.value }))} 
            />
          </label>

          <label>
            <span>New Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm(s => ({ ...s, password: e.target.value }))}
              placeholder="Leave empty to keep current"
            />
          </label>

          <div className="sa-edit-student-actions">
            <button disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>

            <button 
              type="button" 
              onClick={() => nav("/super-admin/student")} 
              disabled={saving}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </Layout>
  );
}
