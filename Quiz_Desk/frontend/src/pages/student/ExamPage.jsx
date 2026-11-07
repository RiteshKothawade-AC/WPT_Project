
import { useState } from 'react';
import './ExamPage.css';

function ExamPage() {

  const [answers, setAnswers] = useState({});

  function handleAnswer(questionNumber, selectedOption) {
    setAnswers({
      ...answers,
      [questionNumber]: selectedOption
    });
  }

  function handleSubmit() {
    alert('Your exam has been submitted!');
  }

  return (
    <div className="exam-page">

      <div className="exam-header">
        <h1>HTML Basics Examination</h1>
        <h3>Time: 30 Minutes</h3>
      </div>

      <div className="question-box">

        <h3>Question 1</h3>
        <p>What does HTML stand for?</p>

        <label>
          <input
            type="radio"
            name="question1"
            checked={answers[1] === 'A'}
            onChange={() => handleAnswer(1, 'A')}
          />
          Hyper Text Markup Language
        </label>

        <label>
          <input
            type="radio"
            name="question1"
            checked={answers[1] === 'B'}
            onChange={() => handleAnswer(1, 'B')}
          />
          High Text Machine Language
        </label>

        <label>
          <input
            type="radio"
            name="question1"
            checked={answers[1] === 'C'}
            onChange={() => handleAnswer(1, 'C')}
          />
          Hyper Transfer Markup Language
        </label>

        <label>
          <input
            type="radio"
            name="question1"
            checked={answers[1] === 'D'}
            onChange={() => handleAnswer(1, 'D')}
          />
          Home Tool Markup Language
        </label>

      </div>

      <div className="question-box">

        <h3>Question 2</h3>
        <p>Which HTML tag is used to create a paragraph?</p>

        <label>
          <input
            type="radio"
            name="question2"
            checked={answers[2] === 'A'}
            onChange={() => handleAnswer(2, 'A')}
          />
          &lt;h1&gt;
        </label>

        <label>
          <input
            type="radio"
            name="question2"
            checked={answers[2] === 'B'}
            onChange={() => handleAnswer(2, 'B')}
          />
          &lt;p&gt;
        </label>

        <label>
          <input
            type="radio"
            name="question2"
            checked={answers[2] === 'C'}
            onChange={() => handleAnswer(2, 'C')}
          />
          &lt;div&gt;
        </label>

        <label>
          <input
            type="radio"
            name="question2"
            checked={answers[2] === 'D'}
            onChange={() => handleAnswer(2, 'D')}
          />
          &lt;img&gt;
        </label>

      </div>

      <button
        className="submit-exam-btn"
        onClick={handleSubmit}
      >
        Submit Exam
      </button>

    </div>
  );
}

export default ExamPage;
