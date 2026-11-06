import './Navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <div className="navbar">

            <h2 className="logo">QuizDesk</h2>

            <nav className="nav-links">
                <a href="/">Home</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
            </nav>

            <Link to="/login" className="login-btn">
                Login
            </Link>

        </div>
    );
}

export default Navbar;