
import { useState } from 'react';
import './ManageQuestions.css';

function ManageQuestions() {

  const [questions, setQuestions] = useState([
    {
      id: 1,
      exam: 'HTML Basics',
      question: 'What does HTML stand for?',
      optionA: 'Hyper Text Markup Language',
      optionB: 'High Text Machine Language',
      optionC: 'Hyper Transfer Markup Language',
      optionD: 'Home Tool Markup Language',
      correctAnswer: 'A'
    },
    {
      id: 2,
      exam: 'HTML Basics',
      question: 'Which tag is used for a paragraph?',
      optionA: '<h1>',
      optionB: '<p>',
      optionC: '<div>',
      optionD: '<img>',
      correctAnswer: 'B'
    }
  ]);

  const [exam, setExam] = useState('HTML Basics');
  const [question, setQuestion] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('A');

  const [editId, setEditId] = useState(null);

  function clearForm() {
    setExam('HTML Basics');
    setQuestion('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectAnswer('A');
    setEditId(null);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (editId === null) {

      const newQuestion = {
        id: Date.now(),
        exam,
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer
      };

      setQuestions([...questions, newQuestion]);

      alert('Question added successfully!');

    } else {

      const updatedQuestions = questions.map((item) => {
        if (item.id === editId) {
          return {
            ...item,
            exam,
            question,
            optionA,
            optionB,
            optionC,
            optionD,
            correctAnswer
          };
        }

        return item;
      });

      setQuestions(updatedQuestions);

      alert('Question updated successfully!');
    }

    clearForm();
  }

  function handleEdit(item) {
    setExam(item.exam);
    setQuestion(item.question);
    setOptionA(item.optionA);
    setOptionB(item.optionB);
    setOptionC(item.optionC);
    setOptionD(item.optionD);
    setCorrectAnswer(item.correctAnswer);
    setEditId(item.id);
  }

  function handleDelete(id) {
    const updatedQuestions = questions.filter(
      (item) => item.id !== id
    );

    setQuestions(updatedQuestions);
  }

  return (
    <div className="manage-questions">

      <h1>Manage Questions</h1>

      <p className="question-description">
        Add and manage MCQ questions for examinations.
      </p>

      {/* Question Form */}
      <div className="question-form-box">

        <h2>
          {editId === null ? 'Add New Question' : 'Edit Question'}
        </h2>

        <form onSubmit={handleSubmit}>

          <label>Select Exam</label>
          <select
            value={exam}
            onChange={(e) => setExam(e.target.value)}
          >
            <option value="HTML Basics">HTML Basics</option>
            <option value="CSS Fundamentals">CSS Fundamentals</option>
            <option value="JavaScript Basics">JavaScript Basics</option>
          </select>

          <label>Question</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question"
            required
          />

          <label>Option A</label>
          <input
            type="text"
            value={optionA}
            onChange={(e) => setOptionA(e.target.value)}
            required
          />

          <label>Option B</label>
          <input
            type="text"
            value={optionB}
            onChange={(e) => setOptionB(e.target.value)}
            required
          />

          <label>Option C</label>
          <input
            type="text"
            value={optionC}
            onChange={(e) => setOptionC(e.target.value)}
            required
          />

          <label>Option D</label>
          <input
            type="text"
            value={optionD}
            onChange={(e) => setOptionD(e.target.value)}
            required
          />

          <label>Correct Answer</label>
          <select
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
          >
            <option value="A">Option A</option>
            <option value="B">Option B</option>
            <option value="C">Option C</option>
            <option value="D">Option D</option>
          </select>

          <button type="submit">
            {editId === null ? 'Add Question' : 'Update Question'}
          </button>

          {editId !== null && (
            <button
              type="button"
              className="cancel-question-btn"
              onClick={clearForm}
            >
              Cancel
            </button>
          )}

        </form>

      </div>

      {/* Question List */}
      <div className="question-list-box">

        <h2>All Questions</h2>

        {questions.map((item) => (

          <div className="question-item" key={item.id}>

            <h3>{item.question}</h3>

            <p>Exam: {item.exam}</p>

            <p>A. {item.optionA}</p>
            <p>B. {item.optionB}</p>
            <p>C. {item.optionC}</p>
            <p>D. {item.optionD}</p>

            <p className="correct-answer">
              Correct Answer: {item.correctAnswer}
            </p>

            <button
              className="edit-question-btn"
              onClick={() => handleEdit(item)}
            >
              Edit
            </button>

            <button
              className="delete-question-btn"
              onClick={() => handleDelete(item.id)}
            >
              Delete
            </button>

          </div>

        ))}

        {questions.length === 0 && (
          <p>No questions available.</p>
        )}

      </div>

    </div>
  );
}

export default ManageQuestions;
