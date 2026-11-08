
import { useState, useEffect } from 'react';
import './ExamHistory.css';
import API_URL from '../../services/api';

function ExamHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchHistory() {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(
          `${API_URL}/exams/student/exam-history`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Could not load exam history');
        }

        setHistory(data.results || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  function formatDate(date) {
    if (!date) return 'Not submitted';

    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  if (loading) {
    return <h2>Loading exam history...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="exam-history">

      <h1>Exam History</h1>

      <p className="history-description">
        View your previous examination attempts.
      </p>

      <div className="history-table">

        <h2>Previous Exams</h2>

        <table>
          <thead>
            <tr>
              <th>Exam Name</th>
              <th>Exam Date</th>
              <th>Duration</th>
              <th>Total Marks</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {history.length > 0 ? (
              history.map((item) => (
                <tr key={item.attempt_id}>
                  <td>{item.exam_title}</td>
                  <td>{formatDate(item.submitted_at || item.started_at)}</td>
                  <td>{item.duration_minutes} Minutes</td>
                  <td>{item.total_marks}</td>
                  <td>{item.attempt_status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">
                  You have not attempted any exams yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>

    </div>
  );
}

export default ExamHistory;
