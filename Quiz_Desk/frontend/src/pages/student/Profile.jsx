
import { useState } from 'react';
import './Profile.css';

function Profile() {

  const [name, setName] = useState('Rahul Sharma');
  const [email, setEmail] = useState('rahul@gmail.com');
  const [studentId, setStudentId] = useState('STU1001');
  const [course, setCourse] = useState('BCA');

  const [editing, setEditing] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    setEditing(false);
    alert('Profile updated successfully!');
  }

  return (
    <div className="profile-page">

      <h1>My Profile</h1>
      <p className="profile-description">
        View and manage your personal information.
      </p>

      <div className="profile-box">

        <div className="profile-header">
          <div className="profile-avatar">
            {name.charAt(0).toUpperCase()}
          </div>

          <h2>{name}</h2>
          <p>Student Account</p>
        </div>

        <form onSubmit={handleSave}>

          <label>Full Name</label>
          <input
            type="text"
            value={name}
            disabled={!editing}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Email Address</label>
          <input
            type="email"
            value={email}
            disabled={!editing}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Student ID</label>
          <input
            type="text"
            value={studentId}
            disabled
          />

          <label>Course</label>
          <input
            type="text"
            value={course}
            disabled={!editing}
            onChange={(e) => setCourse(e.target.value)}
          />

          {editing ? (
            <div className="profile-buttons">
              <button type="submit">Save Changes</button>

              <button
                type="button"
                className="cancel-btn"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          )}

        </form>

      </div>

    </div>
  );
}

export default Profile;
