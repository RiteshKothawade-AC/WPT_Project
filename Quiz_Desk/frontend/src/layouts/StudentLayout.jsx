
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../pages/student/StudentDashboard.css';

function StudentLayout() {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="student-dashboard">

            {/* Student Sidebar */}
            <div className="student-sidebar">

                <h2>QuizDesk</h2>

                <ul>
                    <li>
                        <Link to="/student-dashboard">Dashboard</Link>
                    </li>

                    <li>
                        <Link to="/student-available-exams">Available Exams</Link>
                    </li>

                    <li>
                        <Link to="/my-results">My Results</Link>
                    </li>

                    <li>
                        <Link to="/exam-history">Exam History</Link>
                    </li>

                    <li>
                        <Link to="/student-profile">My Profile</Link>
                    </li>

                    <li>
                        <Link to="/login" onClick={handleLogout}>Logout</Link>
                    </li>
                </ul>

            </div>

            {/* Selected Student Page */}
            <Outlet />

        </div>
    );
}

export default StudentLayout;
