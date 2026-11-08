
import { useState, useEffect } from 'react';
import API_URL from '../../services/api';
import './ManageStudents.css';

function ManageStudents() {
  const [students, setStudents] = useState([]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [course, setCourse] = useState('');
  const [status, setStatus] = useState('Active');
  const [password, setPassword] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch students from database
  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/admin/students`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        const formattedStudents = data.map((student) => ({
          id: student.user_id,
          name: student.full_name,
          email: student.email,
          studentId: student.student_code || '',
          course: student.course || '',
          status: student.status === 'active' ? 'Active' : 'Inactive'
        }));

        setStudents(formattedStudents);
      } else {
        alert(data.message || 'Error fetching students');
      }
    } catch (error) {
      console.log(error);
      alert('Server error');
    }
  };

  // Add or update student
  
const handleSubmit = async (e) => {
    e.preventDefault();

    const isEditing = editId !== null;

    try {
        const response = await fetch(
            isEditing
                ? `${API_URL}/auth/admin/students/${editId}`
                : `${API_URL}/auth/admin/students`,
            {
                method: isEditing ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(
                    isEditing
                        ? { name, email, studentId, course, status }
                        : { name, email, studentId, course, password }
                )
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert(
                isEditing
                    ? 'Student updated successfully'
                    : 'Student added successfully'
            );

            clearForm();
            fetchStudents();
        } else {
            alert(data.message || 'Operation failed');
        }
    } catch (error) {
        console.log(error);
        alert('Server error');
    }
};


  // Edit student
  const handleEdit = (student) => {
    setName(student.name);
    setEmail(student.email);
    setStudentId(student.studentId);
    setCourse(student.course);
    setStatus(student.status);
    setEditId(student.id);
  };

  // Delete student (database connection will be added next)
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to deactivate this student?'
    );

    if (confirmDelete) {
      try {
        const response = await fetch(
          `${API_URL}/auth/admin/students/${id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        const data = await response.json();

        if (response.ok) {
          alert('Student deactivated successfully');
          fetchStudents();
        } else {
          alert(data.message || 'Error deactivating student');
        }
      } catch (error) {
        console.log(error);
        alert('Server error');
      }
    }
  };

  // Clear form
  const clearForm = () => {
    setName('');
    setEmail('');
    setStudentId('');
    setCourse('');
    setStatus('Active');
    setPassword('');
    setEditId(null);
};

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
          {!editId && (
    <input
        type="password"
        placeholder="Student Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
    />
)}

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
                    Deactivate
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
