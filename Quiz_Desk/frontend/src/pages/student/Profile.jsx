
import { useState, useEffect } from 'react';
import './Profile.css';
import API_URL from '../../services/api';

function Profile() {
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    student_code: '',
    course: ''
  });

  const [originalProfile, setOriginalProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Could not load profile');
        }

        setProfile(data.user);
        setOriginalProfile(data.user);

      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setProfile(previousProfile => ({
      ...previousProfile,
      [name]: value
    }));
  }

  async function handleSave(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: profile.full_name,
          email: profile.email,
          course: profile.course
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not update profile');
      }

      setOriginalProfile(profile);
      setEditing(false);

      // Update the name shown in the saved login information
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.full_name = profile.full_name;
      user.email = profile.email;
      localStorage.setItem('user', JSON.stringify(user));

      alert('Profile updated successfully!');

    } catch (error) {
      alert(error.message);
    }
  }

  function handleCancel() {
    setProfile(originalProfile);
    setEditing(false);
  }

  if (loading) {
    return <h2>Loading profile...</h2>;
  }

  if (!originalProfile) {
    return <h2>Could not load profile.</h2>;
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
            {profile.full_name.charAt(0).toUpperCase()}
          </div>

          <h2>{profile.full_name}</h2>
          <p>Student Account</p>
        </div>

        <form onSubmit={handleSave}>

          <label>Full Name</label>
          <input
            type="text"
            name="full_name"
            value={profile.full_name}
            disabled={!editing}
            onChange={handleChange}
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            disabled={!editing}
            onChange={handleChange}
            required
          />

          <label>Student ID</label>
          <input
            type="text"
            value={profile.student_code || ''}
            disabled
          />

          <label>Course</label>
          <input
            type="text"
            name="course"
            value={profile.course || ''}
            disabled={!editing}
            onChange={handleChange}
          />

          {editing ? (
            <div className="profile-buttons">
              <button type="submit">Save Changes</button>

              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
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
