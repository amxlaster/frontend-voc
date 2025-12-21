// src/super-admin/App.jsx
import { Routes, Route } from "react-router-dom";

import SuperAdminLogin from "./SuperAdminLogin";
import Dashboard from "./dashboard/Dashboard";

import AdminList from "./admins/AdminList";
import CreateAdmin from "./admins/CreateAdmin";
import EditAdmin from "./admins/EditAdmin";

import StudentList from "./students/StudentList";
import CreateStudent from "./students/CreateStudent";
import EditStudent from "./students/EditStudent";

import QuotesList from "./quotes/QuotesList";
import AddQuote from "./quotes/AddQuote";
import EditQuote from "./quotes/EditQuote";

import QuizHome from "./quize/QuizHome";
import QuizList from "./quize/QuizList";
import AddQuestion from "./quize/AddQuestion";
import EditQuestion from "./quize/EditQuestion";

import ProtectedRoute from "../components/ProtectedRoute";

export default function SuperAdminApp() {
  return (
    <Routes>

      {/* LOGIN PAGE */}
      <Route path="/" element={<SuperAdminLogin />} />

      {/* DASHBOARD */}
      <Route
        path="dashboard"
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
      />

      {/* ADMIN */}
      <Route path="admin" element={<ProtectedRoute><AdminList /></ProtectedRoute>} />
      <Route path="admin/create" element={<ProtectedRoute><CreateAdmin /></ProtectedRoute>} />
      <Route path="admin/edit/:id" element={<ProtectedRoute><EditAdmin /></ProtectedRoute>} />

      {/* STUDENT */}
      <Route path="student" element={<ProtectedRoute><StudentList /></ProtectedRoute>} />
      <Route path="student/create" element={<ProtectedRoute><CreateStudent /></ProtectedRoute>} />
      <Route path="student/edit/:id" element={<ProtectedRoute><EditStudent /></ProtectedRoute>} />

      {/* QUOTES */}
      <Route path="quotes" element={<ProtectedRoute><QuotesList /></ProtectedRoute>} />
      <Route path="quotes/add" element={<ProtectedRoute><AddQuote /></ProtectedRoute>} />
      <Route path="quotes/edit/:id" element={<ProtectedRoute><EditQuote /></ProtectedRoute>} />

      {/* QUIZ */}
      <Route path="quiz" element={<ProtectedRoute><QuizHome /></ProtectedRoute>} />
      <Route path="quiz/:date/:level" element={<ProtectedRoute><QuizList /></ProtectedRoute>} />
      <Route path="quiz/:date/:level/add" element={<ProtectedRoute><AddQuestion /></ProtectedRoute>} />
      <Route path="quiz/:date/:level/edit/:id" element={<ProtectedRoute><EditQuestion /></ProtectedRoute>} />
      

    </Routes>
  );
}
