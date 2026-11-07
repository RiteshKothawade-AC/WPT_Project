
import './ExamHistory.css';

function ExamHistory() {
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

            <tr>
              <td>HTML Basics</td>
              <td>05 Nov 2026</td>
              <td>25 Minutes</td>
              <td>50</td>
              <td>Completed</td>
            </tr>

            <tr>
              <td>CSS Fundamentals</td>
              <td>03 Nov 2026</td>
              <td>40 Minutes</td>
              <td>50</td>
              <td>Completed</td>
            </tr>

            <tr>
              <td>JavaScript Basics</td>
              <td>01 Nov 2026</td>
              <td>30 Minutes</td>
              <td>100</td>
              <td>Completed</td>
            </tr>

            <tr>
              <td>React Basics</td>
              <td>Not submitted</td>
              <td>10 Minutes</td>
              <td>50</td>
              <td>Incomplete</td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ExamHistory;
