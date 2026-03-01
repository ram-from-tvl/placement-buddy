import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Profile() {
  const { user, fetchUser } = useAuth();
  const [formData, setFormData] = useState({
    year: '',
    branch: '',
    targetRole: '',
    skills: '',
    hoursPerWeek: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        year: user.profile.year || '',
        branch: user.profile.branch || '',
        targetRole: user.profile.targetRole || '',
        skills: user.profile.skills?.join(', ') || '',
        hoursPerWeek: user.profile.hoursPerWeek || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/profile', {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      });
      setSuccess('Profile updated successfully!');
      await fetchUser();
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <nav className="navbar">
        <h1>🎯 Kai Placement Copilot</h1>
        <Link to="/" className="btn-secondary">← Back to Dashboard</Link>
      </nav>

      <div className="container">
        <div className="card">
          <h2>Complete Your Profile</h2>
          <p>Help us personalize your placement preparation journey</p>

          {success && <div className="success">{success}</div>}
          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label>
              Year
              <select
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
                required
              >
                <option value="">Select Year</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>
            </label>

            <label>
              Branch
              <input
                type="text"
                placeholder="e.g., Computer Science"
                value={formData.branch}
                onChange={(e) => setFormData({...formData, branch: e.target.value})}
                required
              />
            </label>

            <label>
              Target Role
              <input
                type="text"
                placeholder="e.g., Software Development Engineer"
                value={formData.targetRole}
                onChange={(e) => setFormData({...formData, targetRole: e.target.value})}
                required
              />
            </label>

            <label>
              Skills (comma-separated)
              <input
                type="text"
                placeholder="e.g., JavaScript, React, Node.js, Python"
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                required
              />
            </label>

            <label>
              Hours Available Per Week
              <input
                type="number"
                placeholder="e.g., 20"
                value={formData.hoursPerWeek}
                onChange={(e) => setFormData({...formData, hoursPerWeek: e.target.value})}
                required
                min="1"
                max="168"
              />
            </label>

            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
