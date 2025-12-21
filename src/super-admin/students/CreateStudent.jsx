// frontend/src/super-admin/students/CreateStudent.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../lib/api";
import "./CreateStudent.css";
import PageHeader from "../../components/PageHeader";
import Layout from "../../components/Layout";

export default function CreateStudent() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    className: "",
    password: ""
  });

  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const update = (k, v) => setForm(s => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password)
      return alert("Email and password required");

    if (form.password.length < 6)
      return alert("Password must be at least 6 characters");

    setBusy(true);
    try {
      await API.post("/students", form);
      alert("Student created successfully");

      // ⭐ FIXED REDIRECT
      nav("/super-admin/student");
      
    } catch (err) {
      alert(err?.response?.data?.message || "Create failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Layout>
      <div className="sa-create-student-root sa-create-student-centered">
        <div className="sa-create-student-card sa-create-student-compact">

          <PageHeader title="Create Student" />

          <div className="sa-create-student-body">
            <form
              className="sa-create-student-form-grid sa-create-student-form-1"
              onSubmit={submit}
              autoComplete="off"
            >

              <label className="sa-create-student-form-group">
                <span>Name</span>
                <input
                  value={form.name}
                  onChange={e => update("name", e.target.value)}
                  placeholder="Full name"
                />
              </label>

              <label className="sa-create-student-form-group">
                <span>Email</span>
                <input
                  value={form.email}
                  onChange={e => update("email", e.target.value)}
                  type="email"
                  placeholder="student@example.com"
                  required
                />
              </label>

              <label className="sa-create-student-form-group">
                <span>Phone</span>
                <input
                  value={form.phone}
                  onChange={e => update("phone", e.target.value)}
                  placeholder="9876543210"
                />
              </label>

              <label className="sa-create-student-form-group">
                <span>Date of Birth</span>
                <input
                  type="date"
                  value={form.dob}
                  onChange={e => update("dob", e.target.value)}
                />
              </label>

              <label className="sa-create-student-form-group">
                <span>Gender</span>
                <select
                  value={form.gender}
                  onChange={e => update("gender", e.target.value)}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="sa-create-student-form-group">
                <span>Class</span>
                <input
                  value={form.className}
                  onChange={e => update("className", e.target.value)}
                  placeholder="Enter class"
                />
              </label>

              <label className="sa-create-student-form-group">
                <span>Password</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => update("password", e.target.value)}
                  placeholder="Min 6 characters"
                  required
                />
              </label>

              <div className="sa-create-student-actions">
                <button
                  className="sa-create-student-btn sa-create-student-primary"
                  type="submit"
                  disabled={busy}
                >
                  {busy ? "Creating..." : "Create Student"}
                </button>

                <button
                  type="button"
                  className="sa-create-student-btn sa-create-student-outline"
                  onClick={() => nav("/super-admin/student")}   // ⭐ FIXED
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
