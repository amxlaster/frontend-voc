// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

/* PUBLIC PAGES */
import Home from "./home/home.jsx";
import User from "./home/User.jsx";
import AdminLogin from "./Login/Admin/AdminLogin.jsx";
import StudentLogin from "./Login/Student/StudentLogin.jsx";

/* ADMIN */
import AdminLayout from "./Login/Admin/Admin-Dashboard/AdminLayout/AdminLayout.jsx";
import AdminDashboard from "./Login/Admin/Admin-Dashboard/Dashboard/Dashboard.jsx";
import StudentList from "./Login/Admin/Admin-Dashboard/students/StudentList.jsx";
import StudentDetails from "./Login/Admin/Admin-Dashboard/students/StudentDetails";
import AdminLeaderboard from "./Login/Admin/Admin-Dashboard/Leaderboard/Leaderboard.jsx";
import StudentLeaderboard from "./Login/Admin/Admin-Dashboard/Leaderboard/StudentLeaderboard.jsx";
import AdminCharts from "./Login/Admin/Admin-Dashboard/charts/AdminCharts.jsx";
import AdminChangePassword from "./Login/Admin/Admin-ChangePassword/AdminChangePassword";

/* STUDENT */
import StudentLayout from "./Login/Student/Student-Dashboard/StudentLayout/StudentLayout.jsx";
import StudentChangePassword from "./Login/Student/Student-Dashboard/ChangePassword/StudentChangePassword";
import Dashboard from "./Login/Student/Student-Dashboard/Dashboard/Dashboard";
import WOTD from "./Login/Student/Student-Dashboard/WOTD/WOTD";
import StartQuiz from "./Login/Student/Student-Dashboard/StartQuiz/StartQuiz";
import Leaderboard from "./Login/Student/Student-Dashboard/Leaderboard/Leaderboard";
import Reward from "./Login/Student/Student-Dashboard/Reward/Reward";

/* QUIZ FULLSCREEN */
import QuizLevels from "./Login/Student/Quiz/QuizLevels/QuizLevels.jsx";
import BeginnerPage from "./Login/Student/Quiz/Beginner/BeginnerPage.jsx";
import IntermediatePage from "./Login/Student/Quiz/Intermediate/IntermediatePage.jsx";
import AdvancedPage from "./Login/Student/Quiz/Advanced/AdvancedPage.jsx";

/* SUPER ADMIN */
import SuperAdminApp from "./super-admin/App.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<User />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/student-login" element={<StudentLogin />} />

        {/* ADMIN DASHBOARD */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="student" element={<StudentList />} />
          <Route path="student/:id" element={<StudentDetails />} />
          <Route path="leaderboard" element={<AdminLeaderboard />} />
          <Route path="leaderboard/student/:id" element={<StudentLeaderboard />} />
          <Route path="charts" element={<AdminCharts />} />
          <Route path="change-password" element={<AdminChangePassword />} />
        </Route>

        {/* STUDENT DASHBOARD */}
        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="wotd" element={<WOTD />} />
          <Route path="start-quiz" element={<StartQuiz />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="reward" element={<Reward />} />
          <Route path="change-password" element={<StudentChangePassword />} />
        </Route>

        {/* QUIZ FULLSCREEN */}
        <Route path="/quiz-levels" element={<QuizLevels />} />
        <Route path="/quiz/beginner" element={<BeginnerPage />} />
        <Route path="/quiz/intermediate" element={<IntermediatePage />} />
        <Route path="/quiz/advanced" element={<AdvancedPage />} />

        {/* SUPER ADMIN */}
        <Route path="/super-admin/*" element={<SuperAdminApp />} />

      </Routes>
    </BrowserRouter>
  );
}
