import { Link } from 'react-router-dom';
import CareerCoachChat from '../components/CareerCoachChat';

export default function CareerCoach() {
  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>🎯 Kai Placement Copilot</h1>
        <div>
          <span>Your personal Career Coach</span>
          <Link to="/" className="btn-secondary">
            Back to dashboard
          </Link>
        </div>
      </nav>

      <div className="container">
        <div className="card">
          <h2>Career Coach</h2>
          <p>
            Chat with your AI career coach to understand where you are, what to
            focus on next, and how to reach your target role faster.
          </p>
          <CareerCoachChat />
        </div>
      </div>
    </div>
  );
}

