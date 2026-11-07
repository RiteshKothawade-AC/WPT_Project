import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';

import Register from './pages/Register';

import About from './pages/About';
import Contact from './pages/Contact';

import StudentDashboard from './pages/student/StudentDashboard';

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
      </Routes>

      <Footer />

    </BrowserRouter>
  );
}

export default App;