import './Navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <div className="navbar">

            <h2 className="logo">QuizDesk</h2>

            <nav className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
            </nav>
            <Link to="/login" className="login-btn">
                Login
            </Link>

        </div>
    );
}

export default Navbar;