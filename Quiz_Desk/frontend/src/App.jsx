
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';

import StudentDashboard from './pages/student/StudentDashboard';
import AvailableExams from './pages/student/AvailableExams';
import ExamPage from './pages/student/ExamPage';
import MyResults from './pages/student/MyResults';
import ExamHistory from './pages/student/ExamHistory';
import Profile from './pages/student/Profile';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageExams from './pages/admin/ManageExams';
import ManageQuestions from './pages/admin/ManageQuestions';
import ManageStudents from './pages/admin/ManageStudents';
import ViewResults from './pages/admin/ViewResults';

import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

function Layout() {
  const location = useLocation();

  const isDashboardPage =
    location.pathname.startsWith('/student-') ||
    location.pathname.startsWith('/admin-') ||
    location.pathname.startsWith('/manage-') ||
    location.pathname === '/admin' ||
    location.pathname === '/my-results' ||
    location.pathname === '/exam-history' ||
    location.pathname === '/student-profile' ||
    location.pathname === '/view-results' ||
    location.pathname.startsWith('/exam/');

  return (
    <>
      {!isDashboardPage && <Navbar />}

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Student Pages */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-available-exams"
          element={
            <ProtectedRoute requiredRole="student">
              <AvailableExams />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exam/:attemptId/:examId"
          element={
            <ProtectedRoute requiredRole="student">
              <ExamPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-results"
          element={
            <ProtectedRoute requiredRole="student">
              <MyResults />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exam-history"
          element={
            <ProtectedRoute requiredRole="student">
              <ExamHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-profile"
          element={
            <ProtectedRoute requiredRole="student">
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin Pages */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-exams"
          element={
            <ProtectedRoute requiredRole="admin">
              <ManageExams />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-questions"
          element={
            <ProtectedRoute requiredRole="admin">
              <ManageQuestions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-students"
          element={
            <ProtectedRoute requiredRole="admin">
              <ManageStudents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-results"
          element={
            <ProtectedRoute requiredRole="admin">
              <ViewResults />
            </ProtectedRoute>
          }
        />

        {/* Unknown Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isDashboardPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
