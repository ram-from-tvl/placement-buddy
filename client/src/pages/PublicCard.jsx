import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function PublicCard() {
  const { shareLink } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCard();
    trackView();
  }, [shareLink]);

  const fetchCard = async () => {
    try {
      const response = await api.get(`/readiness-card/share/${shareLink}`);
      setCard(response.data.card);
    } catch (error) {
      console.error('Error fetching card:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    try {
      await api.post(`/readiness-card/share/${shareLink}/view`);
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const trackClick = async () => {
    try {
      await api.post(`/readiness-card/share/${shareLink}/click`);
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!card) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Card Not Found</h2>
          <p>This readiness card doesn't exist or has been removed.</p>
          <Link to="/signup" className="btn-primary">Create Your Own Card</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="public-card-page">
      <div className="container">
        <div className="readiness-card">
          <div className="card-header">
            <h2>Placement Readiness</h2>
          </div>
          <div className="score-circle">
            <div className="score-value">{card.score}</div>
            <div className="score-label">/ 100</div>
          </div>
          <div className="card-details">
            <h3>{card.userId.name}</h3>
            <p>{card.userId.college}</p>
            <p className="role">{card.userId.profile.targetRole}</p>
          </div>
          <div className="breakdown">
            <h4>Score Breakdown</h4>
            <div className="breakdown-item">
              <span>Profile Complete</span>
              <span>{card.breakdown.profileComplete}/20</span>
            </div>
            <div className="breakdown-item">
              <span>Action Plan Progress</span>
              <span>{card.breakdown.actionPlanProgress}/40</span>
            </div>
            <div className="breakdown-item">
              <span>Mock Interviews</span>
              <span>{card.breakdown.mockInterviewsDone}/30</span>
            </div>
            <div className="breakdown-item">
              <span>Days Active</span>
              <span>{card.breakdown.daysActive}/10</span>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h3>Want to improve your placement readiness?</h3>
          <p>Generate your own personalized action plan and track your progress</p>
          <Link 
            to="/signup" 
            className="btn-primary btn-large"
            onClick={trackClick}
          >
            🎯 Try Kai Placement Copilot
          </Link>
        </div>
      </div>
    </div>
  );
}
