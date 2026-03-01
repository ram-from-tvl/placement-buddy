import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchColleges();
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedCollege]);

  const fetchColleges = async () => {
    try {
      const response = await api.get('/leaderboard/colleges');
      setColleges(response.data.colleges);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const params = selectedCollege ? `?college=${selectedCollege}` : '';
      const response = await api.get(`/leaderboard${params}`);
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="page">
      <nav className="navbar">
        <h1>🏆 Leaderboard</h1>
        <Link to="/" className="btn-secondary">← Dashboard</Link>
      </nav>

      <div className="container">
        <div className="card">
          <h2>Top 100 Placement-Ready Students</h2>
          
          <div className="filter">
            <label>
              Filter by College:
              <select 
                value={selectedCollege} 
                onChange={(e) => setSelectedCollege(e.target.value)}
              >
                <option value="">All Colleges</option>
                {colleges.map((college) => (
                  <option key={college} value={college}>{college}</option>
                ))}
              </select>
            </label>
          </div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="leaderboard-table">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>College</th>
                    <th>Role</th>
                    <th>Score</th>
                    <th>Days Active</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr key={entry.rank}>
                      <td className="rank">{getRankEmoji(entry.rank)}</td>
                      <td>{entry.name}</td>
                      <td>{entry.college}</td>
                      <td>{entry.targetRole || 'N/A'}</td>
                      <td className="score">{entry.readinessScore}</td>
                      <td>{entry.daysActive}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
