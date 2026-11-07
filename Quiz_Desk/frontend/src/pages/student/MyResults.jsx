
import './MyResults.css';

function MyResults() {
  return (
    <div className="my-results">

      <h1>My Results</h1>

      <p className="results-description">
        Check your examination performance here.
      </p>

      <div className="result-summary">

        <div className="result-card">
          <h3>Exams Completed</h3>
          <h2>8</h2>
        </div>

        <div className="result-card">
          <h3>Average Score</h3>
          <h2>85%</h2>
        </div>

        <div className="result-card">
          <h3>Highest Score</h3>
          <h2>95%</h2>
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

            <tr>
              <td>HTML Basics</td>
              <td>05 Nov 2026</td>
              <td>50</td>
              <td>45</td>
              <td>90%</td>
              <td>Pass</td>
            </tr>

            <tr>
              <td>CSS Fundamentals</td>
              <td>03 Nov 2026</td>
              <td>50</td>
              <td>40</td>
              <td>80%</td>
              <td>Pass</td>
            </tr>

            <tr>
              <td>JavaScript Basics</td>
              <td>01 Nov 2026</td>
              <td>100</td>
              <td>85</td>
              <td>85%</td>
              <td>Pass</td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default MyResults;
