
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../../services/api';
import './AdminDashboard.css';

function AdminDashboard() {

    const [stats, setStats] = useState({
        total_students: 0,
        total_exams: 0,
        total_questions: 0
    });

    const [recentExams, setRecentExams] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        const fetchDashboard = async () => {

            try {
                const token = localStorage.getItem('token');

                const response = await fetch(
                    `${API_URL}/exams/admin/dashboard/stats`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to load dashboard');
                }

                setStats(data.stats);
                setRecentExams(data.recentExams);

            } catch (error) {
                alert(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();

    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

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
                </ul>

                <button onClick={handleLogout}>Logout</button>

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
                        <h1>{loading ? '...' : stats.total_students}</h1>
                    </div>

                    <div className="admin-card">
                        <h3>Total Exams</h3>
                        <h1>{loading ? '...' : stats.total_exams}</h1>
                    </div>

                    <div className="admin-card">
                        <h3>Total Questions</h3>
                        <h1>{loading ? '...' : stats.total_questions}</h1>
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

                            {loading ? (

                                <tr>
                                    <td colSpan="4">Loading...</td>
                                </tr>

                            ) : recentExams.length > 0 ? (

                                recentExams.map((exam) => (

                                    <tr key={exam.exam_id}>
                                        <td>{exam.title}</td>
                                        <td>{exam.question_count}</td>
                                        <td>{exam.duration_minutes} Minutes</td>
                                        <td>{exam.status}</td>
                                    </tr>

                                ))

                            ) : (

                                <tr>
                                    <td colSpan="4">No exams found</td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;
