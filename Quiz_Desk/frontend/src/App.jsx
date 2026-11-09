
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

import AdminLayout from './layouts/AdminLayout';
import StudentLayout from './layouts/StudentLayout';
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

                {/* Student Layout */}
                <Route
                    element={
                        <ProtectedRoute requiredRole="student">
                            <StudentLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        path="/student-dashboard"
                        element={<StudentDashboard />}
                    />

                    <Route
                        path="/student-available-exams"
                        element={<AvailableExams />}
                    />

                    <Route
                        path="/my-results"
                        element={<MyResults />}
                    />

                    <Route
                        path="/exam-history"
                        element={<ExamHistory />}
                    />

                    <Route
                        path="/student-profile"
                        element={<Profile />}
                    />

                </Route>

                {/* Exam Page */}
                <Route
                    path="/exam/:attemptId/:examId"
                    element={
                        <ProtectedRoute requiredRole="student">
                            <ExamPage />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Layout */}
                <Route
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        path="/admin-dashboard"
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="/admin"
                        element={<Navigate to="/admin-dashboard" replace />}
                    />

                    <Route
                        path="/manage-exams"
                        element={<ManageExams />}
                    />

                    <Route
                        path="/manage-questions"
                        element={<ManageQuestions />}
                    />

                    <Route
                        path="/manage-students"
                        element={<ManageStudents />}
                    />

                    <Route
                        path="/view-results"
                        element={<ViewResults />}
                    />

                </Route>

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
