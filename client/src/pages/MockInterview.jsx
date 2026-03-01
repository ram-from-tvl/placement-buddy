import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function MockInterview() {
  const [interviews, setInterviews] = useState([]);
  const [currentInterview, setCurrentInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');

  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/mock-interview');
      const fetchedInterviews = response.data.mockInterviews || [];
      setInterviews(fetchedInterviews);
      
      // Set the most recent interview as current if none selected
      if (!currentInterview && fetchedInterviews.length > 0) {
        setCurrentInterview(fetchedInterviews[0]);
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
      setError('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  }, [currentInterview]);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const generateInterview = useCallback(async () => {
    setGenerating(true);
    setError('');
    try {
      const response = await api.post('/mock-interview/generate');
      const newInterview = response.data.mockInterview;
      setCurrentInterview(newInterview);
      setInterviews([newInterview, ...interviews]);
      setAnswers({});
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to generate interview';
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setGenerating(false);
    }
  }, [interviews]);

  const saveAnswer = useCallback(async (questionIndex) => {
    if (!currentInterview) return;
    
    const answer = answers[questionIndex];
    if (!answer || answer.trim().length === 0) {
      alert('Please enter an answer before saving');
      return;
    }

    try {
      const response = await api.patch(`/mock-interview/${currentInterview._id}/answer`, {
        questionIndex,
        answer: answer.trim()
      });
      
      const updatedInterview = response.data.mockInterview;
      setCurrentInterview(updatedInterview);
      
      // Update in the list
      setInterviews(interviews.map(i => 
        i._id === updatedInterview._id ? updatedInterview : i
      ));
      
      // Clear the answer from state
      setAnswers(prev => {
        const newAnswers = { ...prev };
        delete newAnswers[questionIndex];
        return newAnswers;
      });
    } catch (error) {
      console.error('Error saving answer:', error);
      alert('Failed to save answer. Please try again.');
    }
  }, [currentInterview, answers, interviews]);

  const selectInterview = useCallback((interview) => {
    setCurrentInterview(interview);
    setAnswers({});
  }, []);

  return (
    <div className="page">
      <nav className="navbar">
        <h1>💼 Mock Interviews</h1>
        <Link to="/" className="btn-secondary">← Dashboard</Link>
      </nav>

      <div className="container">
        <div className="card">
          {error && <div className="error">{error}</div>}
          <button onClick={generateInterview} disabled={generating} className="btn-primary">
            {generating ? 'Generating... (10-15 seconds)' : '+ New Mock Interview'}
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading interviews...</div>
        ) : currentInterview ? (
          <div className="card">
            <h3>Current Interview - {currentInterview.role}</h3>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${currentInterview.score}%`}}></div>
              <span>{currentInterview.score}% Complete</span>
            </div>

            {currentInterview.questions.map((q, idx) => (
              <div key={idx} className="question-card">
                <h4>Question {idx + 1} {q.answered && <span className="badge">✓ Answered</span>}</h4>
                <p>{q.question}</p>
                <textarea
                  placeholder="Type your answer here..."
                  value={answers[idx] !== undefined ? answers[idx] : (q.answer || '')}
                  onChange={(e) => setAnswers({...answers, [idx]: e.target.value})}
                  rows="4"
                />
                <button 
                  onClick={() => saveAnswer(idx)}
                  disabled={!answers[idx] && !q.answer}
                  className="btn-secondary"
                >
                  {q.answered ? 'Update Answer' : 'Save Answer'}
                </button>
              </div>
            ))}
          </div>
        ) : interviews.length === 0 ? (
          <div className="card text-center">
            <p>No interviews yet. Generate your first mock interview to get started!</p>
          </div>
        ) : null}

        {interviews.length > 0 && (
          <div className="card">
            <h3>Previous Interviews</h3>
            <ul className="interview-list">
              {interviews.map((interview) => (
                <li 
                  key={interview._id} 
                  onClick={() => selectInterview(interview)}
                  className={currentInterview?._id === interview._id ? 'active' : ''}
                >
                  <strong>{interview.role}</strong>
                  <span>{interview.score}% complete</span>
                  <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
