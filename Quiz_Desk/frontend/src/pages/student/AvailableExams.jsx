
import { useState, useEffect } from 'react';
import './AvailableExams.css';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../services/api';

function AvailableExams() {

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        fetch(`${API_URL}/exams`)
            .then((response) => response.json())
            .then((data) => {
                setExams(data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });

    }, []);

    // Start an exam
    async function handleStartExam(examId) {

        const token = localStorage.getItem('token');

        try {

            const response = await fetch(
                `${API_URL}/exams/${examId}/start`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {

                alert('Exam started successfully!');

                navigate(`/exam/${data.attempt_id}/${examId}`);
            } else {

                alert(data.message);

            }

        } catch (error) {

            alert('Cannot connect to server.');

            console.log(error);

        }

    }

    if (loading) {
        return <h2>Loading exams...</h2>;
    }

    return (
        <div className="available-exams">

            <h1>Available Exams</h1>

            <p className="exam-description">
                Choose an exam and test your knowledge.
            </p>

            <div className="exam-list">

                {exams.length === 0 ? (

                    <p>No exams are currently available.</p>

                ) : (

                    exams.map((exam) => (

                        <div className="exam-card" key={exam.exam_id}>

                            <h2>{exam.title}</h2>

                            <p>{exam.description}</p>

                            <p>
                                Duration: {exam.duration_minutes} Minutes
                            </p>

                            <p>
                                Total Marks: {exam.total_marks}
                            </p>

                            <button
                                className="start-exam-btn"
                                onClick={() => handleStartExam(exam.exam_id)}
                            >
                                Start Exam
                            </button>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}

export default AvailableExams;
