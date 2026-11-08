
import { useState } from 'react';
import './Register.css';
import { Link } from 'react-router-dom';
import API_URL from '../services/api';

function Register() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [course, setCourse] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  async function handleRegister(e) {

    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          full_name: name,
          email: email,
          password: password,
          student_code: studentId,
          course: course
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful!');

        setName('');
        setEmail('');
        setStudentId('');
        setCourse('');
        setPassword('');
        setConfirmPassword('');

      } else {
        alert(data.message);
      }

    } catch (error) {

      alert('Cannot connect to server. Please try again.');

      console.log(error);

    }

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
