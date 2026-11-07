
import { useState } from 'react';
import './ManageExams.css';

function ManageExams() {

  const [exams, setExams] = useState([
    {
      id: 1,
      name: 'HTML Basics',
      subject: 'Web Development',
      duration: 30,
      marks: 50
    },
    {
      id: 2,
      name: 'CSS Fundamentals',
      subject: 'Web Development',
      duration: 45,
      marks: 50
    },
    {
      id: 3,
      name: 'JavaScript Basics',
      subject: 'Programming',
      duration: 60,
      marks: 100
    }
  ]);

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState('');
  const [marks, setMarks] = useState('');

  const [editId, setEditId] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();

    if (editId === null) {

      const newExam = {
        id: Date.now(),
        name: name,
        subject: subject,
        duration: Number(duration),
        marks: Number(marks)
      };

      setExams([...exams, newExam]);

      alert('Exam added successfully!');

    } else {

      const updatedExams = exams.map((exam) => {
        if (exam.id === editId) {
          return {
            ...exam,
            name: name,
            subject: subject,
            duration: Number(duration),
            marks: Number(marks)
          };
        }

        return exam;
      });

      setExams(updatedExams);

      alert('Exam updated successfully!');
    }

    clearForm();
  }

  function handleEdit(exam) {
    setName(exam.name);
    setSubject(exam.subject);
    setDuration(exam.duration);
    setMarks(exam.marks);
    setEditId(exam.id);
  }

  function handleDelete(id) {
    const updatedExams = exams.filter(
      (exam) => exam.id !== id
    );

    setExams(updatedExams);
  }

  function clearForm() {
    setName('');
    setSubject('');
    setDuration('');
    setMarks('');
    setEditId(null);
  }

  return (
    <div className="manage-exams">

      <h1>Manage Exams</h1>

      <p className="manage-description">
        Create and manage examinations.
      </p>

      {/* Exam Form */}
      <div className="exam-form-box">

        <h2>
          {editId === null ? 'Add New Exam' : 'Edit Exam'}
        </h2>

        <form onSubmit={handleSubmit}>

          <label>Exam Name</label>
          <input
            type="text"
            placeholder="Enter exam name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Subject</label>
          <input
            type="text"
            placeholder="Enter subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <label>Duration (Minutes)</label>
          <input
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />

          <label>Total Marks</label>
          <input
            type="number"
            min="1"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            required
          />

          <button type="submit">
            {editId === null ? 'Add Exam' : 'Update Exam'}
          </button>

          {editId !== null && (
            <button
              type="button"
              className="cancel-exam-btn"
              onClick={clearForm}
            >
              Cancel
            </button>
          )}

        </form>

      </div>

      {/* Exam List */}
      <div className="exam-list-box">

        <h2>All Examinations</h2>

        <div className="exam-table">

          <table>

            <thead>
              <tr>
                <th>Exam Name</th>
                <th>Subject</th>
                <th>Duration</th>
                <th>Marks</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {exams.map((exam) => (
                <tr key={exam.id}>

                  <td>{exam.name}</td>
                  <td>{exam.subject}</td>
                  <td>{exam.duration} Minutes</td>
                  <td>{exam.marks}</td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(exam)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(exam.id)}
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}

              {exams.length === 0 && (
                <tr>
                  <td colSpan="5">No examinations available.</td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default ManageExams;
