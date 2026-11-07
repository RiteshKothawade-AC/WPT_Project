
import './AvailableExams.css';
import { Link } from 'react-router-dom';
function AvailableExams() {
    return (
        <div className="available-exams">

            <h1>Available Exams</h1>

            <p className="exam-description">
                Choose an exam and test your knowledge.
            </p>

            <div className="exam-list">

                <div className="exam-card">
                    <h2>HTML Basics</h2>
                    <p>Subject: Web Development</p>
                    <p>Duration: 30 Minutes</p>
                    <p>Total Marks: 50</p>
                    <p>Questions: 25</p>
                    <Link to="/exam" className="start-exam-btn">
                        Start Exam
                    </Link>        </div>

                <div className="exam-card">
                    <h2>CSS Fundamentals</h2>
                    <p>Subject: Web Development</p>
                    <p>Duration: 45 Minutes</p>
                    <p>Total Marks: 50</p>
                    <p>Questions: 25</p>
                    <Link to="/exam" className="start-exam-btn">
                        Start Exam
                    </Link>                </div>

                <div className="exam-card">
                    <h2>JavaScript Basics</h2>
                    <p>Subject: Programming</p>
                    <p>Duration: 60 Minutes</p>
                    <p>Total Marks: 100</p>
                    <p>Questions: 50</p>
                    <Link to="/exam" className="start-exam-btn">
                        Start Exam
                    </Link>                </div>

            </div>

        </div>
    );
}

export default AvailableExams;
