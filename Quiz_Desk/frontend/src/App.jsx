import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
import './App.css';

function App() {

  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/student-dashboard"
          element={<StudentDashboard />}
        />
        <Route
          path="/available-exams"
          element={<AvailableExams />}
        />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="/my-results" element={<MyResults />} />
        <Route
          path="/exam-history"
          element={<ExamHistory />}
        />
        <Route path="/student-profile" element={<Profile />} />
        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />
        <Route
          path="/manage-exams"
          element={<ManageExams />}
        />
        <Route
          path="/manage-questions"
          element={<ManageQuestions />}
        />
        <Route path="/manage-students" element={<ManageStudents />} />
        <Route path="/view-results" element={<ViewResults />} />
      </Routes>

      <Footer />

    </BrowserRouter>
  );
}

export default App;