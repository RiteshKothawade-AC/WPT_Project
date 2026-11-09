
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

function AdminLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="admin-dashboard">

            {/* Admin Sidebar */}
            <div className="admin-sidebar">

                <h2>QuizDesk</h2>

                <ul>
                    <li>
                        <Link to="/admin-dashboard">Dashboard</Link>
                    </li>

                    <li>
                        <Link to="/manage-exams">Manage Exams</Link>
                    </li>

                    <li>
                        <Link to="/manage-questions">Manage Questions</Link>
                    </li>

                    <li>
                        <Link to="/manage-students">Manage Students</Link>
                    </li>

                    <li>
                        <Link to="/view-results">View Results</Link>
                    </li>
                </ul>

                <button onClick={handleLogout}>Logout</button>

            </div>

            {/* Selected Admin Page */}
            <Outlet />

        </div>
    );
}

export default AdminLayout;
