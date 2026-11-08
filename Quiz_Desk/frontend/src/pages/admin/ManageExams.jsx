
import { useState, useEffect } from 'react';
import API_URL from '../../services/api';
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
    const [passingMarks, setPassingMarks] = useState('');
    const [status, setStatus] = useState('draft');

    const [editId, setEditId] = useState(null);
    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const response = await fetch(`${API_URL}/exams/admin/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                const formattedExams = data.map((exam) => ({
                    id: exam.exam_id,
                    name: exam.title,
                    subject: exam.description,
                    duration: exam.duration_minutes,
                    marks: exam.total_marks,
                    passingMarks: exam.passing_marks,
                    status: exam.status
                }));

                setExams(formattedExams);
            }
            else {
                alert(data.message || 'Error fetching exams');
            }
        } catch (error) {
            console.log(error);
            alert('Server error');
        }
    };

    async function handleSubmit(e) {
        e.preventDefault();

        if (Number(passingMarks) > Number(marks)) {
            alert('Passing marks cannot be greater than total marks');
            return;
        }

        const examData = {
            title: name,
            description: subject,
            duration_minutes: Number(duration),
            total_marks: Number(marks),
            passing_marks: Number(passingMarks),
            status: status
        };

        try {
            const url = editId === null
                ? `${API_URL}/exams`
                : `${API_URL}/exams/${editId}`;

            const method = editId === null ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(examData)
            });

            const data = await response.json();

            if (response.ok) {
                alert(editId === null
                    ? 'Exam added successfully!'
                    : 'Exam updated successfully!'
                );

                clearForm();
                fetchExams();
            } else {
                alert(data.message || 'Unable to save exam');
            }

        } catch (error) {
            console.log(error);
            alert('Server error');
        }
    }
    function handleEdit(exam) {
        setName(exam.name);
        setSubject(exam.subject || '');
        setDuration(exam.duration);
        setMarks(exam.marks);
        setPassingMarks(exam.passingMarks);
        setStatus(exam.status);
        setEditId(exam.id);
    }

    async function handleDelete(id) {

        const confirmDelete = window.confirm(
            'Are you sure you want to delete this exam?'
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/exams/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                alert('Exam deleted successfully!');
                fetchExams();
            } else {
                alert(data.message || 'Unable to delete exam');
            }

        } catch (error) {
            console.log(error);
            alert('Server error');
        }
    }

    function clearForm() {
        setName('');
        setSubject('');
        setDuration('');
        setMarks('');
        setPassingMarks('');
        setStatus('draft');
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
                    <label>Passing Marks</label>
                    <input
                        type="number"
                        min="1"
                        value={passingMarks}
                        onChange={(e) => setPassingMarks(e.target.value)}
                        required
                    />

                    <label>Exam Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="closed">Closed</option>
                    </select>

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
