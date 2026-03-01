import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function MockInterview() {
  const [interviews, setInterviews] = useState([]);
  const [currentInterview, setCurrentInterview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const response = await api.get('/mock-interview');
      setInterviews(response.data.mockInterviews);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInterview = async () => {
    setGenerating(true);
    try {
      const response = await api.post('/mock-interview/generate');
      setCurrentInterview(response.data.mockInterview);
      setInterviews([response.data.mockInterview, ...interviews]);
      setAnswers({});
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to generate interview');
    } finally {
      setGenerating(false);
    }
  };

  const saveAnswer = async (questionIndex) => {
    try {
      const response = await api.patch(`/mock-interview/${currentInterview._id}/answer`, {
        questionIndex,
        answer: answers[questionIndex] || ''
      });
      setCurrentInterview(response.data.mockInterview);
    } catch (error) {
      console.error('Error saving answer:', error);
    }
  };

  return (
    <div className="page">
      <nav className="navbar">
        <h1>💼 Mock Interviews</h1>
        <Link to="/" className="btn-secondary">← Dashboard</Link>
      </nav>

      <div className="container">
        <div className="card">
          <button onClick={generateInterview} disabled={generating} className="btn-primary">
            {generating ? 'Generating... (10-15 seconds)' : '+ New Mock Interview'}
          </button>
        </div>

        {currentInterview && (
          <div className="card">
            <h3>Current Interview - {currentInterview.role}</h3>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${currentInterview.score}%`}}></div>
              <span>{currentInterview.score}% Complete</span>
            </div>

            {currentInterview.questions.map((q, idx) => (
              <div key={idx} className="question-card">
                <h4>Question {idx + 1}</h4>
                <p>{q.question}</p>
                <textarea
                  placeholder="Type your answer here..."
                  value={answers[idx] || q.answer || ''}
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
        )}

        {interviews.length > 0 && (
          <div className="card">
            <h3>Previous Interviews</h3>
            <ul className="interview-list">
              {interviews.map((interview) => (
                <li key={interview._id} onClick={() => setCurrentInterview(interview)}>
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
