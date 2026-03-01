import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Dashboard() {
  const { user, logout, fetchUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStats = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [planRes, interviewsRes, cardRes] = await Promise.allSettled([
        api.get('/action-plan'),
        api.get('/mock-interview'),
        api.get('/readiness-card')
      ]);

      const planData = planRes.status === 'fulfilled' ? planRes.value.data : null;
      const interviewsData = interviewsRes.status === 'fulfilled' ? interviewsRes.value.data : null;
      const cardData = cardRes.status === 'fulfilled' ? cardRes.value.data : null;

      // Calculate profile completeness from user object
      const profileComplete = calculateProfileCompleteness(user.profile);

      setStats({
        profileComplete,
        hasActionPlan: !!planData?.actionPlan,
        actionPlanProgress: planData?.actionPlan?.progress || 0,
        mockInterviewsCount: interviewsData?.mockInterviews?.length || 0,
        readinessScore: cardData?.card?.score || user?.readinessScore || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        profileComplete: 0,
        hasActionPlan: false,
        actionPlanProgress: 0,
        mockInterviewsCount: 0,
        readinessScore: 0
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Helper function to calculate profile completeness
  const calculateProfileCompleteness = (profile) => {
    if (!profile) return 0;
    let score = 0;
    if (profile.year) score += 20;
    if (profile.branch) score += 20;
    if (profile.targetRole) score += 20;
    if (profile.skills && profile.skills.length > 0) score += 20;
    if (profile.hoursPerWeek) score += 20;
    return score;
  };

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Refresh user data when component mounts
  useEffect(() => {
    fetchUser();
  }, []);

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
        {loading ? (
          <div className="loading">Loading your dashboard...</div>
        ) : (
          <>
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
                {stats?.profileComplete < 100 && <span className="badge">Incomplete</span>}
              </Link>

              <Link to="/action-plan" className="action-card">
                <h3>📅 7-Day Action Plan</h3>
                <p>Get your personalized placement preparation roadmap</p>
                {stats?.hasActionPlan && <span className="badge">{stats.actionPlanProgress}% done</span>}
              </Link>

              <Link to="/mock-interview" className="action-card">
                <h3>💼 Mock Interviews</h3>
                <p>Practice with AI-generated interview questions</p>
                {stats?.mockInterviewsCount > 0 && <span className="badge">{stats.mockInterviewsCount} completed</span>}
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
          </>
        )}
      </div>
    </div>
  );
}
