import { useState } from 'react';
import './Login.css';

import { Link } from 'react-router-dom';

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');

  function handleLogin(e) {

    e.preventDefault();

    alert("Email: " + email);

    alert("Role: " + role);

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
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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