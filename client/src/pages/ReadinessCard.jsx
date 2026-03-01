import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function ReadinessCard() {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const fetchCard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/readiness-card');
      setCard(response.data.card);
    } catch (error) {
      if (error.response?.status === 404) {
        setCard(null);
      } else {
        console.error('Error fetching card:', error);
        setError('Failed to load readiness card');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCard();
  }, [fetchCard]);

  const generateCard = useCallback(async () => {
    setGenerating(true);
    setError('');
    try {
      const response = await api.post('/readiness-card/generate');
      setCard(response.data.card);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to generate card';
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setGenerating(false);
    }
  }, []);

  const shareCard = useCallback(() => {
    if (!card) return;
    
    const url = `${window.location.origin}/card/${card.shareLink}`;
    const text = `Check out my Placement Readiness Score: ${card.score}/100! 🎯\n\nGenerate yours at Kai Placement Copilot`;
    
    if (navigator.share) {
      navigator.share({ title: 'My Readiness Card', text, url }).catch(err => {
        console.log('Share cancelled or failed:', err);
      });
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`).then(() => {
        alert('Link copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy link');
      });
    }
  }, [card]);

  const shareWhatsApp = useCallback(() => {
    if (!card) return;
    
    const url = `${window.location.origin}/card/${card.shareLink}`;
    const text = `Check out my Placement Readiness Score: ${card.score}/100! 🎯 Generate yours at Kai Placement Copilot`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');
  }, [card]);

  return (
    <div className="page">
      <nav className="navbar">
        <h1>🎯 Readiness Card</h1>
        <Link to="/" className="btn-secondary">← Dashboard</Link>
      </nav>

      <div className="container">
        {loading ? (
          <div className="loading">Loading your readiness card...</div>
        ) : error && !card ? (
          <div className="card text-center">
            <div className="error">{error}</div>
            <button onClick={fetchCard} className="btn-secondary">Retry</button>
          </div>
        ) : !card ? (
          <div className="card text-center">
            <h2>Generate Your Readiness Card</h2>
            <p>Create a shareable card showing your placement readiness score</p>
            {error && <div className="error">{error}</div>}
            <button onClick={generateCard} disabled={generating} className="btn-primary">
              {generating ? 'Generating...' : 'Generate Card'}
            </button>
          </div>
        ) : (
          <>
            <div className="readiness-card">
              <div className="card-header">
                <h2>Placement Readiness</h2>
              </div>
              <div className="score-circle">
                <div className="score-value">{card.score}</div>
                <div className="score-label">/ 100</div>
              </div>
              <div className="card-details">
                <h3>{card.userId?.name || 'User'}</h3>
                <p>{card.userId?.college || 'College'}</p>
                <p className="role">{card.userId?.profile?.targetRole || 'Target Role'}</p>
              </div>
              <div className="breakdown">
                <h4>Score Breakdown</h4>
                <div className="breakdown-item">
                  <span>Profile Complete</span>
                  <span>{card.breakdown?.profileComplete || 0}/20</span>
                </div>
                <div className="breakdown-item">
                  <span>Action Plan Progress</span>
                  <span>{card.breakdown?.actionPlanProgress || 0}/40</span>
                </div>
                <div className="breakdown-item">
                  <span>Mock Interviews</span>
                  <span>{card.breakdown?.mockInterviewsDone || 0}/30</span>
                </div>
                <div className="breakdown-item">
                  <span>Days Active</span>
                  <span>{card.breakdown?.daysActive || 0}/10</span>
                </div>
              </div>
              <div className="card-stats">
                <div>👁️ {card.views || 0} views</div>
                <div>🔗 {card.clicks || 0} clicks</div>
              </div>
            </div>

            <div className="share-buttons">
              <button onClick={shareWhatsApp} className="btn-whatsapp">
                📱 Share on WhatsApp
              </button>
              <button onClick={shareCard} className="btn-primary">
                🔗 Share Card
              </button>
              <button onClick={generateCard} disabled={generating} className="btn-secondary">
                {generating ? 'Updating...' : '🔄 Update Card'}
              </button>
            </div>

            <div className="card">
              <h4>Share Link</h4>
              <input 
                type="text" 
                value={`${window.location.origin}/card/${card.shareLink}`}
                readOnly
                onClick={(e) => e.target.select()}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
