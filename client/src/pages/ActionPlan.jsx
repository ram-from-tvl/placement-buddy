import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function ActionPlan() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const response = await api.get('/action-plan');
      setPlan(response.data.actionPlan);
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Error fetching plan:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = async () => {
    setGenerating(true);
    try {
      const response = await api.post('/action-plan/generate');
      setPlan(response.data.actionPlan);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to generate plan');
    } finally {
      setGenerating(false);
    }
  };

  const toggleTask = async (day, taskIndex) => {
    const dayPlan = plan.plan.find(d => d.day === day);
    const currentStatus = dayPlan.tasks[taskIndex].done;
    
    try {
      const response = await api.patch('/action-plan/task', {
        day,
        taskIndex,
        done: !currentStatus
      });
      setPlan(response.data.actionPlan);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="page">
      <nav className="navbar">
        <h1>📅 7-Day Action Plan</h1>
        <Link to="/" className="btn-secondary">← Dashboard</Link>
      </nav>

      <div className="container">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : !plan ? (
          <div className="card text-center">
            <h2>Generate Your Personalized Action Plan</h2>
            <p>Get a 7-day roadmap tailored to your profile and goals</p>
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
                        checked={task.done}
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

            <div className="card">
              <h3>📝 ATS Resume Tips</h3>
              <ul>
                {plan.resumeTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            <button onClick={generatePlan} disabled={generating} className="btn-secondary">
              {generating ? 'Regenerating...' : 'Regenerate Plan'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
