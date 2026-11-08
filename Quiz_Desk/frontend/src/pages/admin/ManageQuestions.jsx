import { useState, useEffect } from 'react';
import API_URL from '../../services/api';
import './ManageQuestions.css';

function ManageQuestions() {

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchExamList();
    fetchQuestions();
  }, []);

  const fetchExamList = async () => {
    try {
      const response = await fetch(`${API_URL}/exams/admin/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setExamList(data);
      } else {
        alert(data.message || 'Error loading exams');
      }

    } catch (error) {
      console.log(error);
      alert('Server error');
    }
  };
  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${API_URL}/exams/admin/questions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        const formattedQuestions = data.map((item) => ({
          id: item.question_id,
          exam: item.exam_title,
          examId: item.exam_id,
          question: item.question_text,
          optionA: item.options[0]?.option_text || '',
          optionB: item.options[1]?.option_text || '',
          optionC: item.options[2]?.option_text || '',
          optionD: item.options[3]?.option_text || '',
          correctAnswer: ['A', 'B', 'C', 'D'][
            item.options.findIndex(option => Number(option.is_correct) === 1)
          ]
        }));

        setQuestions(formattedQuestions);
      } else {
        alert(data.message || 'Error fetching questions');
      }

    } catch (error) {
      console.log(error);
      alert('Server error');
    }
  };

  const [exam, setExam] = useState(''); const [question, setQuestion] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('A');

  const [editId, setEditId] = useState(null);
  const [examList, setExamList] = useState([]);

  function clearForm() {
    setExam('');
    setQuestion('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectAnswer('A');
    setEditId(null);
  }
  async function handleSubmit(e) {
    e.preventDefault();

    const questionData = {
      exam_id: Number(exam),
      question_text: question,
      options: [
        {
          option_text: optionA,
          is_correct: correctAnswer === 'A'
        },
        {
          option_text: optionB,
          is_correct: correctAnswer === 'B'
        },
        {
          option_text: optionC,
          is_correct: correctAnswer === 'C'
        },
        {
          option_text: optionD,
          is_correct: correctAnswer === 'D'
        }
      ]
    };

    try {
      const url = editId === null
        ? `${API_URL}/exams/admin/questions`
        : `${API_URL}/exams/admin/questions/${editId}`;

      const method = editId === null ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(questionData)
      });

      const data = await response.json();

      if (response.ok) {
        alert(editId === null
          ? 'Question added successfully!'
          : 'Question updated successfully!'
        );
        clearForm();
        fetchQuestions();
      } else {
        alert(data.message || 'Unable to add question');
      }

    } catch (error) {
      console.log(error);
      alert('Server error');
    }
  }



  function handleEdit(item) {
    setExam(String(item.examId));
    setQuestion(item.question);
    setOptionA(item.optionA);
    setOptionB(item.optionB);
    setOptionC(item.optionC);
    setOptionD(item.optionD);
    setCorrectAnswer(item.correctAnswer);
    setEditId(item.id);
  }

  async function handleDelete(id) {

    const confirmDelete = window.confirm(
        'Are you sure you want to delete this question?'
    );

    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/exams/admin/questions/${id}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert('Question deleted successfully!');
            fetchQuestions();
        } else {
            alert(data.message || 'Unable to delete question');
        }

    } catch (error) {
        console.log(error);
        alert('Server error');
    }
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
            required
          >
            <option value="">Select Exam</option>

            {examList.map((item) => (
              <option key={item.exam_id} value={item.exam_id}>
                {item.title}
              </option>
            ))}
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
