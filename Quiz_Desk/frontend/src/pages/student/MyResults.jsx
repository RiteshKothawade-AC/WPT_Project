import { useState, useEffect } from 'react';
import './MyResults.css';
import API_URL from '../../services/api';

function MyResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchResults() {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(
          `${API_URL}/exams/student/my-results`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Could not load results');
        }

        setResults(Array.isArray(data) ? data : data.results || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, []);

  const totalExams = results.length;

  const averageScore = totalExams > 0
    ? results.reduce((total, result) => total + Number(result.percentage || 0), 0) / totalExams
    : 0;

  const highestScore = totalExams > 0
    ? Math.max(...results.map(result => Number(result.percentage || 0)))
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
    return <h2>Loading results...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="my-results">

      <h1>My Results</h1>

      <p className="results-description">
        Check your examination performance here.
      </p>

      <div className="result-summary">

        <div className="result-card">
          <h3>Exams Completed</h3>
          <h2>{totalExams}</h2>
        </div>

        <div className="result-card">
          <h3>Average Score</h3>
          <h2>{averageScore.toFixed(2)}%</h2>
        </div>

        <div className="result-card">
          <h3>Highest Score</h3>
          <h2>{highestScore.toFixed(2)}%</h2>
        </div>

      </div>

      <div className="results-table">

        <h2>Examination Results</h2>

        <table>

          <thead>
            <tr>
              <th>Exam Name</th>
              <th>Date</th>
              <th>Total Marks</th>
              <th>Obtained Marks</th>
              <th>Percentage</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {results.length > 0 ? (
              results.map((result) => (
                <tr key={result.result_id}>
                  <td>
                    {result.exam_title || result.title || result.exam_name}
                  </td>
                  <td>
                    {formatDate(result.submitted_at || result.evaluated_at)}
                  </td>
                  <td>{result.total_marks}</td>
                  <td>{result.obtained_marks}</td>
                  <td>{result.percentage}%</td>
                  <td>{result.result_status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">You have not completed any exams yet.</td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default MyResults;