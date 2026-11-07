
import './ViewResults.css';

function ViewResults() {
  const results = [
    {
      id: 1,
      name: 'Rahul Patil',
      studentId: 'STU101',
      exam: 'HTML Basics',
      totalMarks: 20,
      obtainedMarks: 18,
      percentage: 90,
      status: 'Pass'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      studentId: 'STU102',
      exam: 'CSS Fundamentals',
      totalMarks: 20,
      obtainedMarks: 16,
      percentage: 80,
      status: 'Pass'
    },
    {
      id: 3,
      name: 'Amit Joshi',
      studentId: 'STU103',
      exam: 'JavaScript Basics',
      totalMarks: 20,
      obtainedMarks: 7,
      percentage: 35,
      status: 'Fail'
    },
    {
      id: 4,
      name: 'Sneha More',
      studentId: 'STU104',
      exam: 'HTML Basics',
      totalMarks: 20,
      obtainedMarks: 19,
      percentage: 95,
      status: 'Pass'
    }
  ];

  return (
    <div className="view-results">
      <h1>Student Results</h1>
      <p>View the examination results of all students.</p>

      <div className="result-summary">
        <div className="result-card">
          <h3>Total Attempts</h3>
          <h2>{results.length}</h2>
        </div>

        <div className="result-card">
          <h3>Passed</h3>
          <h2>
            {results.filter((result) => result.status === 'Pass').length}
          </h2>
        </div>

        <div className="result-card">
          <h3>Failed</h3>
          <h2>
            {results.filter((result) => result.status === 'Fail').length}
          </h2>
        </div>
      </div>

      <div className="result-table-box">
        <h2>All Exam Results</h2>

        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Exam</th>
              <th>Total Marks</th>
              <th>Obtained Marks</th>
              <th>Percentage</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {results.map((result) => (
              <tr key={result.id}>
                <td>{result.name}</td>
                <td>{result.studentId}</td>
                <td>{result.exam}</td>
                <td>{result.totalMarks}</td>
                <td>{result.obtainedMarks}</td>
                <td>{result.percentage}%</td>
                <td>
                  <span
                    className={
                      result.status === 'Pass'
                        ? 'pass-status'
                        : 'fail-status'
                    }
                  >
                    {result.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewResults;
