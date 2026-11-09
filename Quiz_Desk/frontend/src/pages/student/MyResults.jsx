
import { useState, useEffect } from 'react';
import './MyResults.css';
import API_URL from '../../services/api';

function MyResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Store multiple exam answers
  const [selectedResults, setSelectedResults] = useState({});

  // Fetch student results
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
          throw new Error(
            data.message || 'Could not load results'
          );
        }

        setResults(
          Array.isArray(data) ? data : data.results || []
        );

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, []);

  // Calculate summary
  const totalExams = results.length;

  const averageScore = totalExams > 0
    ? results.reduce(
        (total, result) =>
          total + Number(result.percentage || 0),
        0
      ) / totalExams
    : 0;

  const highestScore = totalExams > 0
    ? Math.max(
        ...results.map(result =>
          Number(result.percentage || 0)
        )
      )
    : 0;

  // Format date
  function formatDate(date) {
    if (!date) return '-';

    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  // View or hide answers
  async function handleViewAnswers(resultId) {

    // Hide only the selected exam
    if (selectedResults[resultId]?.open) {
      setSelectedResults(prev => ({
        ...prev,
        [resultId]: {
          ...prev[resultId],
          open: false
        }
      }));

      return;
    }

    // Open selected exam
    setSelectedResults(prev => ({
      ...prev,
      [resultId]: {
        open: true,
        loading: true,
        error: '',
        answers: []
      }
    }));

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${API_URL}/exams/student/my-results/${resultId}/review`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Could not load answer review'
        );
      }

      setSelectedResults(prev => ({
        ...prev,
        [resultId]: {
          open: true,
          loading: false,
          error: '',
          answers: data.answers || []
        }
      }));

    } catch (error) {
      setSelectedResults(prev => ({
        ...prev,
        [resultId]: {
          open: true,
          loading: false,
          error: error.message,
          answers: []
        }
      }));
    }
  }

  // Loading screen
  if (loading) {
    return <h2>Loading results...</h2>;
  }

  // Error screen
  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="my-results">

      <h1>My Results</h1>

      <p className="results-description">
        Check your examination performance here.
      </p>

      {/* Result Summary */}
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

      {/* Examination Results */}
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
              <th>Answers</th>
            </tr>
          </thead>

          <tbody>

            {results.length > 0 ? (

              results.map((result) => (

                <tr key={result.result_id}>

                  <td>
                    {result.exam_title ||
                      result.title ||
                      result.exam_name}
                  </td>

                  <td>
                    {formatDate(
                      result.submitted_at ||
                      result.evaluated_at
                    )}
                  </td>

                  <td>{result.total_marks}</td>

                  <td>{result.obtained_marks}</td>

                  <td>{result.percentage}%</td>

                  <td>{result.result_status}</td>

                  <td>

                    <button
                      type="button"
                      onClick={() =>
                        handleViewAnswers(result.result_id)
                      }
                    >
                      {selectedResults[result.result_id]?.open
                        ? 'Hide Answers'
                        : 'View Answers'}
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>
                <td colSpan="7">
                  You have not completed any exams yet.
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* Multiple Answer Reviews */}
      {results.map((result) => {

        const review = selectedResults[result.result_id];

        if (!review?.open) {
          return null;
        }

        return (

          <div
            className="answer-review"
            key={result.result_id}
          >

            <h2>
              {result.exam_title ||
                result.title ||
                result.exam_name}
              {' - Answer Review'}
            </h2>

            {review.loading && (
              <p>Loading answers...</p>
            )}

            {review.error && (
              <p>{review.error}</p>
            )}

            {!review.loading &&
              !review.error &&

              review.answers.map((answer, index) => (

                <div
                  className={`review-question ${answer.answer_status}`}
                  key={answer.question_id}
                >

                  <h3>
                    Q{index + 1}. {answer.question_text}
                  </h3>

                  <p>
                    <strong>Your Answer:</strong>{' '}
                    {answer.selected_answer || 'Not Attempted'}
                  </p>

                  <p>
                    <strong>Correct Answer:</strong>{' '}
                    {answer.correct_answer || 'Not available'}
                  </p>

                  <p>
                    <strong>Marks:</strong> {answer.marks}
                  </p>

                  <p>
                    <strong>Status:</strong>{' '}

                    {answer.answer_status === 'correct'
                      ? 'Correct Answer'
                      : answer.answer_status === 'wrong'
                      ? 'Wrong Answer'
                      : 'Not Attempted'}

                  </p>

                </div>

              ))

            }

          </div>

        );

      })}

    </div>
  );
}

export default MyResults;
