
import './StudentDashboard.css';

function StudentDashboard() {
  return (
    <div className="student-dashboard">

      {/* Sidebar */}
      <div className="student-sidebar">

        <h2>QuizDesk</h2>

        <ul>
          <li>Dashboard</li>
          <li>Available Exams</li>
          <li>My Results</li>
          <li>Exam History</li>
          <li>My Profile</li>
        </ul>

        <button>Logout</button>

      </div>

      {/* Main Content */}
      <div className="student-main">

        <div className="dashboard-header">
          <h1>Student Dashboard</h1>
          <p>Welcome back, Student!</p>
        </div>

        {/* Summary Cards */}
        <div className="dashboard-cards">

          <div className="dashboard-card">
            <h3>Available Exams</h3>
            <h1>5</h1>
          </div>

          <div className="dashboard-card">
            <h3>Completed Exams</h3>
            <h1>8</h1>
          </div>

          <div className="dashboard-card">
            <h3>Average Score</h3>
            <h1>85%</h1>
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
              <tr>
                <td>HTML Test</td>
                <td>05 Nov 2026</td>
                <td>90%</td>
                <td>Completed</td>
              </tr>

              <tr>
                <td>CSS Test</td>
                <td>03 Nov 2026</td>
                <td>80%</td>
                <td>Completed</td>
              </tr>

              <tr>
                <td>JavaScript Test</td>
                <td>01 Nov 2026</td>
                <td>85%</td>
                <td>Completed</td>
              </tr>
            </tbody>
          </table>

        </div>

      </div>

    </div>
  );
}

export default StudentDashboard;
