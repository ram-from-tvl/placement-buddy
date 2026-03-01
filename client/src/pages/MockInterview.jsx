import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function MockInterview() {

  const [interviews, setInterviews] = useState([]);
  const [currentInterview, setCurrentInterview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [answers, setAnswers] = useState({});

  const saveTimers = useRef({});   // ⭐ store debounce timers

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {

    setLoading(true);

    try {

      const response = await api.get("/mock-interview");

      setInterviews(response.data.mockInterviews || []);

    } catch (error) {

      console.error("Error fetching interviews:", error);

    }

    setLoading(false);

  };

  const generateInterview = async () => {

    setGenerating(true);

    try {

      const response = await api.post("/mock-interview/generate");

      const newInterview = response.data.mockInterview;

      setCurrentInterview(newInterview);

      setInterviews(prev => [newInterview, ...prev]);

      setAnswers({});

    } catch (error) {

      alert(error.response?.data?.error || "Failed to generate interview");

    }

    setGenerating(false);

  };

  const saveAnswer = async (questionIndex, answer) => {

    try {

      const response = await api.patch(
        `/mock-interview/${currentInterview._id}/answer`,
        {
          questionIndex,
          answer
        }
      );

      setCurrentInterview(response.data.mockInterview);

    } catch (error) {

      console.error("Auto save error:", error);

    }

  };

  // ⭐ PROFESSIONAL AUTO SAVE FUNCTION
  const handleAnswerChange = (index, value) => {

    setAnswers(prev => ({
      ...prev,
      [index]: value
    }));

    // clear previous timer
    if (saveTimers.current[index]) {
      clearTimeout(saveTimers.current[index]);
    }

    // create new timer
    saveTimers.current[index] = setTimeout(() => {

      saveAnswer(index, value);

    }, 1000);

  };

  return (

    <div className="page">

      <nav className="navbar">

        <h1>💼 Mock Interviews</h1>

        <div style={{ display: "flex", gap: "10px" }}>

          <Link to="/history" className="btn-secondary">
            📜 Interview History
          </Link>

          <Link to="/" className="btn-secondary">
            ← Dashboard
          </Link>

        </div>

      </nav>

      <div className="container">

        <div className="card">

          <button
            onClick={generateInterview}
            disabled={generating}
            className="btn-primary"
          >

            {generating
              ? "Generating... (10-15 seconds)"
              : "+ New Mock Interview"}

          </button>

        </div>

        {currentInterview && (

          <div className="card">

            <h3>Current Interview - {currentInterview.role}</h3>

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{ width: `${currentInterview.score}%` }}
              ></div>

              <span>{currentInterview.score}% Complete</span>

            </div>

            {currentInterview.questions.map((q, idx) => (

              <div key={idx} className="question-card">

                <h4>Question {idx + 1}</h4>

                <p>{q.question}</p>

                <textarea
                  placeholder="Type your answer here..."
                  value={answers[idx] ?? q.answer ?? ""}
                  onChange={(e) =>
                    handleAnswerChange(idx, e.target.value)
                  }
                  rows="4"
                />

                <small style={{ color: "gray" }}>
                  Auto saving...
                </small>

              </div>

            ))}

          </div>

        )}

        {interviews.length > 0 && (

          <div className="card">

            <h3>Previous Interviews</h3>

            <ul className="interview-list">

              {interviews.map((interview) => (

                <li
                  key={interview._id}
                  onClick={() => setCurrentInterview(interview)}
                  style={{ cursor: "pointer" }}
                >

                  <strong>{interview.role}</strong>

                  <span>{interview.score}% complete</span>

                  <span>
                    {new Date(interview.createdAt).toLocaleDateString()}
                  </span>

                </li>

              ))}

            </ul>

          </div>

        )}

      </div>

    </div>

  );

}