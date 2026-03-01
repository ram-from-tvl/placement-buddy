import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function ActionPlan() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const fetchPlan = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/action-plan');
      setPlan(response.data.actionPlan);
    } catch (error) {
      if (error.response?.status === 404) {
        setPlan(null);
      } else {
        console.error('Error fetching plan:', error);
        setError('Failed to load action plan');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  const generatePlan = useCallback(async () => {
    setGenerating(true);
    setError('');
    try {
      const response = await api.post('/action-plan/generate');
      setPlan(response.data.actionPlan);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to generate plan';
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setGenerating(false);
    }
  }, []);

  const toggleTask = useCallback(async (day, taskIndex) => {
    if (!plan) return;
    
    const dayPlan = plan.plan.find(d => d.day === day);
    if (!dayPlan) return;
    
    const currentStatus = dayPlan.tasks[taskIndex]?.done || false;
    
    // Optimistic update
    const updatedPlan = {
      ...plan,
      plan: plan.plan.map(d => {
        if (d.day === day) {
          return {
            ...d,
            tasks: d.tasks.map((t, idx) => 
              idx === taskIndex ? { ...t, done: !currentStatus } : t
            )
          };
        }
        return d;
      })
    };
    setPlan(updatedPlan);
    
    try {
      const response = await api.patch('/action-plan/task', {
        day,
        taskIndex,
        done: !currentStatus
      });
      setPlan(response.data.actionPlan);
    } catch (error) {
      console.error('Error updating task:', error);
      // Revert on error
      setPlan(plan);
      alert('Failed to update task. Please try again.');
    }
  }, [plan]);

  return (
    <div className="page">
      <nav className="navbar">
        <h1>📅 7-Day Action Plan</h1>
        <Link to="/" className="btn-secondary">← Dashboard</Link>
      </nav>

      <div className="container">
        {loading ? (
          <div className="loading">Loading your action plan...</div>
        ) : error && !plan ? (
          <div className="card text-center">
            <div className="error">{error}</div>
            <button onClick={fetchPlan} className="btn-secondary">Retry</button>
          </div>
        ) : !plan ? (
          <div className="card text-center">
            <h2>Generate Your Personalized Action Plan</h2>
            <p>Get a 7-day roadmap tailored to your profile and goals</p>
            {error && <div className="error">{error}</div>}
            <button onClick={generatePlan} disabled={generating} className="btn-primary">
              {generating ? 'Generating... (this may take 10-15 seconds)' : 'Generate Action Plan'}
            </button>
          </div>
        ) : (
          <>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${plan.progress}%`}}></div>
              <span>{plan.progress}% Complete</span>
            </div>

            {plan.plan.map((day) => (
              <div key={day.day} className="card">
                <h3>Day {day.day}: {day.title}</h3>
                <ul className="task-list">
                  {day.tasks.map((task, idx) => (
                    <li key={idx} className={task.done ? 'done' : ''}>
                      <input
                        type="checkbox"
                        checked={task.done || false}
                        onChange={() => toggleTask(day.day, idx)}
                      />
                      <span>{task.task}</span>
                      {task.resourceLink && (
                        <a href={task.resourceLink} target="_blank" rel="noopener noreferrer">
                          🔗 Resource
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {plan.resumeTips && plan.resumeTips.length > 0 && (
              <div className="card">
                <h3>📝 ATS Resume Tips</h3>
                <ul>
                  {plan.resumeTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            <button onClick={generatePlan} disabled={generating} className="btn-secondary">
              {generating ? 'Regenerating...' : 'Regenerate Plan'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
