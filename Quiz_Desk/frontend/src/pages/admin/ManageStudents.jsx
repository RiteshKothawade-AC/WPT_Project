
import { useState } from 'react';
import './ManageStudents.css';

function ManageStudents() {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Rahul Patil',
      email: 'rahul@gmail.com',
      studentId: 'STU101',
      course: 'BCA',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya@gmail.com',
      studentId: 'STU102',
      course: 'BSc CS',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Amit Joshi',
      email: 'amit@gmail.com',
      studentId: 'STU103',
      course: 'BCA',
      status: 'Inactive'
    }
  ]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [course, setCourse] = useState('');
  const [status, setStatus] = useState('Active');
  const [editId, setEditId] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();

    const studentData = {
      id: editId || Date.now(),
      name,
      email,
      studentId,
      course,
      status
    };

    if (editId) {
      setStudents(
        students.map((student) =>
          student.id === editId ? studentData : student
        )
      );
    } else {
      setStudents([...students, studentData]);
    }

    clearForm();
  }

  function handleEdit(student) {
    setName(student.name);
    setEmail(student.email);
    setStudentId(student.studentId);
    setCourse(student.course);
    setStatus(student.status);
    setEditId(student.id);
  }

  function handleDelete(id) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this student?'
    );

    if (confirmDelete) {
      setStudents(
        students.filter((student) => student.id !== id)
      );
    }
  }

  function clearForm() {
    setName('');
    setEmail('');
    setStudentId('');
    setCourse('');
    setStatus('Active');
    setEditId(null);
  }

  return (
    <div className="manage-students">
      <h1>Manage Students</h1>
      <p>Add, edit and manage student accounts.</p>

      <div className="student-form-box">
        <h2>{editId ? 'Edit Student' : 'Add New Student'}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button type="submit">
            {editId ? 'Update Student' : 'Add Student'}
          </button>

          {editId && (
            <button type="button" onClick={clearForm}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="student-table-box">
        <h2>Student List</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Student ID</th>
              <th>Course</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.studentId}</td>
                <td>{student.course}</td>
                <td>{student.status}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(student)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(student.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {students.length === 0 && (
          <p>No students available.</p>
        )}
      </div>
    </div>
  );
}

export default ManageStudents;
