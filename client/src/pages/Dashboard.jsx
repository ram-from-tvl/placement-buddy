import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [profileRes, planRes, interviewsRes, cardRes] = await Promise.allSettled([
        api.get('/profile'),
        api.get('/action-plan'),
        api.get('/mock-interview'),
        api.get('/readiness-card')
      ]);

      setStats({
        profileComplete: profileRes.value?.data?.profileCompleteness || 0,
        hasActionPlan: planRes.status === 'fulfilled',
        mockInterviewsCount: interviewsRes.value?.data?.mockInterviews?.length || 0,
        readinessScore: cardRes.value?.data?.card?.score || user?.readinessScore || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>🎯 Kai Placement Copilot</h1>
        <div>
          <span>Welcome, {user?.name}!</span>
          <button onClick={logout} className="btn-secondary">Logout</button>
        </div>
      </nav>

      <div className="container">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Readiness Score</h3>
            <div className="score">{stats?.readinessScore || 0}/100</div>
          </div>
          <div className="stat-card">
            <h3>Profile</h3>
            <div className="score">{stats?.profileComplete || 0}%</div>
          </div>
          <div className="stat-card">
            <h3>Mock Interviews</h3>
            <div className="score">{stats?.mockInterviewsCount || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Action Plan</h3>
            <div className="score">{stats?.hasActionPlan ? '✓' : '✗'}</div>
          </div>
        </div>

        <div className="actions-grid">
          <Link to="/profile" className="action-card">
            <h3>📝 Complete Profile</h3>
            <p>Set your year, branch, target role, and skills</p>
          </Link>

          <Link to="/action-plan" className="action-card">
            <h3>📅 7-Day Action Plan</h3>
            <p>Get your personalized placement preparation roadmap</p>
          </Link>

          <Link to="/mock-interview" className="action-card">
            <h3>💼 Mock Interviews</h3>
            <p>Practice with AI-generated interview questions</p>
          </Link>

          <Link to="/readiness" className="action-card">
            <h3>🎯 Readiness Card</h3>
            <p>Generate and share your placement readiness score</p>
          </Link>

          <Link to="/leaderboard" className="action-card">
            <h3>🏆 Leaderboard</h3>
            <p>See top placement-ready students</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
