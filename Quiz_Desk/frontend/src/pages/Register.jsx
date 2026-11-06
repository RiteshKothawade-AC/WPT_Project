import { useState } from 'react';
import './Register.css';
import { Link } from 'react-router-dom';

function Register() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [course, setCourse] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleRegister(e) {

    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    alert('Registration form submitted successfully');

  }

  return (
    <div className="register-page">

      <div className="register-box">

        <h1>QuizDesk</h1>

        <h2>Create Account</h2>

        <p>Register as a student</p>

        <form onSubmit={handleRegister}>

          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Student ID</label>
          <input
            type="text"
            placeholder="Enter your student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />

          <label>Course</label>
          <input
            type="text"
            placeholder="Enter your course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">
            Register
          </button>

        </form>

        <p className="register-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>

    </div>
  );
}

export default Register;