import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function InterviewHistory() {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);

    try {

      const response = await api.get("/mock-interview/history");

      setHistory(response.data.history || []);

    } catch (error) {
      console.error("Failed to load history:", error);
    }

    setLoading(false);
  };

  return (
    <div className="page">

      <nav className="navbar">
        <h1>📜 Interview History</h1>

        <Link to="/mock-interview" className="btn-secondary">
          ← Back to Mock Interview
        </Link>
      </nav>

      <div className="container">

        {loading && <p>Loading history...</p>}

        {!loading && history.length === 0 && (
          <div className="card">
            <h3>No interview history yet</h3>
            <p>Complete a mock interview to see your results here.</p>
          </div>
        )}

        {history.map((interview) => {

          const totalQuestions = interview.questions.length;

          return (
            <div key={interview._id} className="card">

              <h3>{interview.role}</h3>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(interview.completedAt).toLocaleDateString()}
              </p>

              <div style={{ marginTop: "10px" }}>

                <p><strong>Total Questions:</strong> {totalQuestions}</p>

                <p>✅ <strong>Correct:</strong> {interview.correctAnswers}</p>

                <p>❌ <strong>Wrong:</strong> {interview.wrongAnswers}</p>

                <p>📊 <strong>Score:</strong> {interview.score}%</p>

              </div>

              {interview.suggestions && interview.suggestions.length > 0 && (
                <div style={{ marginTop: "15px" }}>
                  <h4>Suggestions</h4>

                  <ul>
                    {interview.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          );
        })}

      </div>
    </div>
  );
}