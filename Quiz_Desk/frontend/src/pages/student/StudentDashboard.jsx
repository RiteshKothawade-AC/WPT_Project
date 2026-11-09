
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import API_URL from '../../services/api';

function StudentDashboard() {

    const [availableExams, setAvailableExams] = useState([]);
    const [results, setResults] = useState([]);
    const [studentName, setStudentName] = useState('Student');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadDashboard() {
            try {
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user') || '{}');

                if (user.full_name) {
                    setStudentName(user.full_name);
                }

                const [examResponse, resultResponse] = await Promise.all([
                    fetch(`${API_URL}/exams`),
                    fetch(`${API_URL}/exams/student/my-results`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                ]);

                if (!examResponse.ok || !resultResponse.ok) {
                    throw new Error('Could not load dashboard information');
                }

                const examData = await examResponse.json();
                const resultData = await resultResponse.json();

                setAvailableExams(examData);
                setResults(resultData.results || []);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, []);

    const completedExams = results.length;

    const averageScore = completedExams > 0
        ? results.reduce(
            (total, result) => total + Number(result.percentage || 0), 0
        ) / completedExams
        : 0;

    function formatDate(date) {
        if (!date) return '-';

        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    if (loading) {
        return <div className="student-main"><h2>Loading dashboard...</h2></div>;
    }

    if (error) {
        return <div className="student-main"><h2>{error}</h2></div>;
    }

    return (
        <div className="student-main">

            <div className="dashboard-header">
                <h1>Student Dashboard</h1>
                <p>Welcome back, {studentName}!</p>
            </div>

            {/* Summary Cards */}
            <div className="dashboard-cards">

                <div className="dashboard-card">
                    <h3>Available Exams</h3>
                    <h1>{availableExams.length}</h1>
                </div>

                <div className="dashboard-card">
                    <h3>Completed Exams</h3>
                    <h1>{completedExams}</h1>
                </div>

                <div className="dashboard-card">
                    <h3>Average Score</h3>
                    <h1>{averageScore.toFixed(2)}%</h1>
                </div>

            </div>

            {/* Recent Activity */}
            <div className="recent-activity">

                <h2>Recent Exam Activity</h2>

                <table>
                    <thead>
                        <tr>
                            <th>Exam Name</th>
                            <th>Date</th>
                            <th>Score</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {results.length > 0 ? (
                            results.slice(0, 3).map((result) => (
                                <tr key={result.result_id}>
                                    <td>{result.title}</td>
                                    <td>{formatDate(result.submitted_at)}</td>
                                    <td>{result.percentage}%</td>
                                    <td>{result.result_status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No completed exams yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>

        </div>
    );
}

export default StudentDashboard;
