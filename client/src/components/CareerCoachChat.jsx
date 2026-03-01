import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function CareerCoachChat({ compact = false }) {
  const [messages, setMessages] = useState([]);
  const [context, setContext] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      setInitialLoading(true);
      const res = await api.get('/career-coach/session');
      setMessages(res.data.session.messages || []);
      setContext(res.data.context || null);
      setError('');
    } catch (err) {
      console.error('Error loading career coach session:', err);
      setError('Failed to load coach. Please try again later.');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/career-coach/message', { message: userText });
      setMessages(res.data.session.messages || []);
      setContext(res.data.context || null);
    } catch (err) {
      console.error('Error sending message to career coach:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const visibleMessages = compact ? messages.slice(-4) : messages;

  return (
    <div className={`career-coach ${compact ? 'career-coach-compact' : ''}`}>
      {context && (
        <div className="coach-context">
          <div className="coach-context-main">
            <span className="coach-tag">Career Coach</span>
            {context.readiness && (
              <span className="coach-score">
                Readiness: {context.readiness.score ?? 0}/100
              </span>
            )}
          </div>
          {context.profile && context.profile.targetRole && (
            <div className="coach-subtext">
              Target: {context.profile.targetRole} • Year:{' '}
              {context.profile.year || 'N/A'}
            </div>
          )}
        </div>
      )}

      <div className="coach-messages">
        {initialLoading ? (
          <div className="coach-status">Loading your coach...</div>
        ) : (
          <>
            {visibleMessages.map((m, idx) => (
              <div
                key={idx}
                className={`coach-message coach-message-${m.role}`}
              >
                <div className="coach-message-bubble">{m.content}</div>
              </div>
            ))}
            {loading && (
              <div className="coach-message coach-message-assistant">
                <div className="coach-message-bubble coach-typing">
                  Coach is thinking...
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {error && <div className="coach-error">{error}</div>}

      <form className="coach-input-row" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Ask about your preparation, next steps, or what to focus on..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

