
import { useEffect, useState } from 'react';
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

    return (
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
    );
}

export default AdminDashboard;
