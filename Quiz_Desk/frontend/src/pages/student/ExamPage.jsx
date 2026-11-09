
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ExamPage.css';
import API_URL from '../../services/api';

function ExamPage() {

    const { attemptId, examId } = useParams();
    const navigate = useNavigate();

    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const token = localStorage.getItem('token');

    // Get exam questions from backend
    useEffect(() => {

        fetch(`${API_URL}/exams/${examId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Could not load exam');
                }
                return response.json();
            })
            .then((data) => {

                setExam(data.exam);
                setTimeLeft(data.exam.duration_minutes * 60);

                const groupedQuestions = [];

                data.questions.forEach((item) => {

                    let question = groupedQuestions.find(
                        (q) => q.question_id === item.question_id
                    );

                    if (!question) {
                        question = {
                            question_id: item.question_id,
                            question_text: item.question_text,
                            marks: item.marks,
                            options: []
                        };

                        groupedQuestions.push(question);
                    }

                    if (item.option_id !== null) {
                        question.options.push({
                            option_id: item.option_id,
                            option_text: item.option_text
                        });
                    }

                });

                setQuestions(groupedQuestions);
                setLoading(false);

            })
            .catch((error) => {
                alert(error.message);
                setLoading(false);
            });

    }, [examId]);

    // Submit exam
    async function handleSubmit(autoSubmit = false) {

        if (submitting) return;

        if (!autoSubmit) {
            const confirmSubmit = window.confirm(
                'Are you sure you want to submit the exam?'
            );

            if (!confirmSubmit) return;
        }

        setSubmitting(true);

        try {

            const response = await fetch(
                `${API_URL}/exams/${attemptId}/submit`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {

                navigate('/my-results');

            } else {

                alert(data.message);
                setSubmitting(false);

            }

        } catch (error) {

            alert('Could not submit exam.');
            console.log(error);
            setSubmitting(false);

        }

    }

    // Countdown timer
    useEffect(() => {

        if (timeLeft === null || submitting || loading) {
            return;
        }

        if (timeLeft <= 0) {
            handleSubmit(true);
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft((previousTime) => previousTime - 1);
        }, 1000);

        return () => clearTimeout(timer);

    }, [timeLeft, submitting, loading]);

    // Save selected answer
    async function handleAnswer(questionId, optionId) {

        setAnswers((previousAnswers) => ({
            ...previousAnswers,
            [questionId]: optionId
        }));

        try {

            const response = await fetch(
                `${API_URL}/exams/${attemptId}/answer`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        question_id: questionId,
                        selected_option_id: optionId
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
            }

        } catch (error) {
            alert('Could not save answer. Please try again.');
            console.log(error);
        }

    }

    // Loading message
    if (loading) {
        return <h2>Loading exam...</h2>;
    }

    if (!exam) {
        return <h2>Exam could not be loaded.</h2>;
    }

    return (

        <div className="exam-page">

            <div className="exam-header">

                <h1>{exam.title} Examination</h1>

                <h3>
                    Time Remaining: {
                        timeLeft !== null
                            ? `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`
                            : 'Loading...'
                    }
                </h3>

                <h3>
                    Total Marks: {exam.total_marks}
                </h3>

            </div>

            {questions.map((question, index) => (

                <div className="question-box" key={question.question_id}>

                    <h3>Question {index + 1}</h3>

                    <p>{question.question_text}</p>

                    {question.options.map((option) => (

                        <label key={option.option_id}>

                            <input
                                type="radio"
                                name={`question-${question.question_id}`}
                                checked={
                                    answers[question.question_id] === option.option_id
                                }
                                onChange={() =>
                                    handleAnswer(
                                        question.question_id,
                                        option.option_id
                                    )
                                }
                            />

                            {option.option_text}

                        </label>

                    ))}

                </div>

            ))}

            <button
                className="submit-exam-btn"
                onClick={() => handleSubmit()}
                disabled={submitting}
            >
                {submitting ? 'Submitting...' : 'Submit Exam'}
            </button>

        </div>

    );

}

export default ExamPage;
