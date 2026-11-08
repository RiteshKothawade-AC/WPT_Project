
import { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../services/api';

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');

  const navigate = useNavigate();

  async function handleLogin(e) {

    e.preventDefault();

    try {

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {

        // Check whether selected role matches account role
        if (data.user.role !== role.toLowerCase()) {
          alert('Selected role does not match your account');
          return;
        }

        // Store login token
        localStorage.setItem('token', data.token);

        // Store user information
        localStorage.setItem('user', JSON.stringify(data.user));

        alert('Login successful!');

        if (data.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/student-dashboard');
        }

      } else {

        alert(data.message);

      }

    } catch (error) {

      alert('Cannot connect to server. Please try again.');

      console.log(error);

    }

  }

  return (
    <div className="login-page">

      <div className="login-box">

        <h1>QuizDesk</h1>

        <h2>Welcome Back!</h2>

        <p>Sign in to continue</p>

        <form onSubmit={handleLogin}>

          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Login As</label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option>Student</option>
            <option>Admin</option>
          </select>

          <button type="submit">
            Login
          </button>

        </form>

        <p className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>

      </div>

    </div>
  );
}

export default Login;
