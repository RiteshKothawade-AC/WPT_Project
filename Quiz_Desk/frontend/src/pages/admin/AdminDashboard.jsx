
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
    return (
        <div className="admin-dashboard">

            {/* Sidebar */}
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

                    <li>
                        <Link to="/login">Logout</Link>
                    </li>
                </ul>
                <button>Logout</button>

            </div>

            {/* Main Content */}
            <div className="admin-main">

                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <p>Welcome back, Admin!</p>
                </div>

                {/* Summary Cards */}
                <div className="admin-cards">

                    <div className="admin-card">
                        <h3>Total Students</h3>
                        <h1>120</h1>
                    </div>

                    <div className="admin-card">
                        <h3>Total Exams</h3>
                        <h1>15</h1>
                    </div>

                    <div className="admin-card">
                        <h3>Total Questions</h3>
                        <h1>250</h1>
                    </div>

                </div>

                {/* Recent Exams */}
                <div className="admin-activity">

                    <h2>Recent Examinations</h2>

                    <table>

                        <thead>
                            <tr>
                                <th>Exam Name</th>
                                <th>Questions</th>
                                <th>Duration</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>

                            <tr>
                                <td>HTML Basics</td>
                                <td>25</td>
                                <td>30 Minutes</td>
                                <td>Active</td>
                            </tr>

                            <tr>
                                <td>CSS Fundamentals</td>
                                <td>25</td>
                                <td>45 Minutes</td>
                                <td>Active</td>
                            </tr>

                            <tr>
                                <td>JavaScript Basics</td>
                                <td>50</td>
                                <td>60 Minutes</td>
                                <td>Inactive</td>
                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;
