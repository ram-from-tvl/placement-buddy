# Lovable Integration Guide - Kai Placement Copilot

## Quick Start for Lovable

This guide provides everything you need to build a beautiful UI for the Kai Placement Copilot backend.

---

## Backend Information

**Base URL:** `http://localhost:5000/api`

**Authentication:** JWT token in Authorization header
```
Authorization: Bearer <token>
```

**CORS:** Enabled for `http://localhost:5173`

---

## Complete User Journey with API Calls

### 1. User Signs Up

**UI Flow:**
- Show signup form (name, email, password, college)
- On submit, show loading
- On success, store token and redirect to profile page
- On error, show error message

**API Call:**
```javascript
const signup = async (name, email, password, college) => {
  const response = await fetch('http://localhost:5000/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, college })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};
```

---

### 2. User Completes Profile

**UI Flow:**
- Show form with year dropdown, branch, target role, skills (comma-separated), hours/week
- On submit, show loading
- On success, show success message and redirect to dashboard
- On error, show error message

**API Call:**
```javascript
const updateProfile = async (profileData) => {
  const response = await fetch('http://localhost:5000/api/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      year: profileData.year,
      branch: profileData.branch,
      targetRole: profileData.targetRole,
      skills: profileData.skills.split(',').map(s => s.trim()),
      hoursPerWeek: parseInt(profileData.hoursPerWeek)
    })
  });
  
  const data = await response.json();
  return data;
};
```

---

### 3. User Generates Action Plan

**UI Flow:**
- Show "Generate Action Plan" button
- On click, show loading with message "Generating... (10-15 seconds)"
- On success, show 7-day plan with checkboxes
- Show progress bar at top
- Show resume tips at bottom

**API Call:**
```javascript
const generateActionPlan = async () => {
  const response = await fetch('http://localhost:5000/api/action-plan/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  const data = await response.json();
  return data.actionPlan;
};

// Get existing plan
const getActionPlan = async () => {
  const response = await fetch('http://localhost:5000/api/action-plan', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  if (response.status === 404) {
    return null; // No plan yet
  }
  
  const data = await response.json();
  return data.actionPlan;
};

// Mark task as done
const toggleTask = async (day, taskIndex, done) => {
  const response = await fetch('http://localhost:5000/api/action-plan/task', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ day, taskIndex, done })
  });
  
  const data = await response.json();
  return data.actionPlan;
};
```

**UI Components:**
```jsx
// Progress Bar
<div className="progress-bar">
  <div 
    className="progress-fill" 
    style={{ width: `${actionPlan.progress}%` }}
  />
  <span>{actionPlan.progress}% Complete</span>
</div>

// Day Card
{actionPlan.plan.map(day => (
  <div key={day.day} className="day-card">
    <h3>Day {day.day}: {day.title}</h3>
    <ul>
      {day.tasks.map((task, idx) => (
        <li key={idx}>
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => toggleTask(day.day, idx, !task.done)}
          />
          <span className={task.done ? 'done' : ''}>{task.task}</span>
          {task.resourceLink && (
            <a href={task.resourceLink} target="_blank">🔗</a>
          )}
        </li>
      ))}
    </ul>
  </div>
))}

// Resume Tips
<div className="resume-tips">
  <h3>📝 ATS Resume Tips</h3>
  <ul>
    {actionPlan.resumeTips.map((tip, idx) => (
      <li key={idx}>{tip}</li>
    ))}
  </ul>
</div>
```

---

### 4. User Generates Mock Interview

**UI Flow:**
- Show "New Mock Interview" button
- On click, show loading "Generating questions... (10-15 seconds)"
- On success, show 10 questions with textareas
- Show progress bar
- Allow saving answers one by one

**API Call:**
```javascript
const generateMockInterview = async () => {
  const response = await fetch('http://localhost:5000/api/mock-interview/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  const data = await response.json();
  return data.mockInterview;
};

// Save answer
const saveAnswer = async (interviewId, questionIndex, answer) => {
  const response = await fetch(`http://localhost:5000/api/mock-interview/${interviewId}/answer`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ questionIndex, answer })
  });
  
  const data = await response.json();
  return data.mockInterview;
};
```

**UI Components:**
```jsx
// Question Card
{interview.questions.map((q, idx) => (
  <div key={idx} className="question-card">
    <h4>Question {idx + 1}</h4>
    <p>{q.question}</p>
    <textarea
      value={answers[idx] || q.answer || ''}
      onChange={(e) => setAnswers({...answers, [idx]: e.target.value})}
      placeholder="Type your answer here..."
      rows="4"
    />
    <button onClick={() => saveAnswer(interview._id, idx, answers[idx])}>
      {q.answered ? 'Update Answer' : 'Save Answer'}
    </button>
  </div>
))}
```

---

### 5. User Generates Readiness Card

**UI Flow:**
- Show "Generate Readiness Card" button
- On success, show beautiful card with:
  - Large score circle
  - User name, college, role
  - Score breakdown (4 items)
  - View/click stats
- Show share buttons (WhatsApp, copy link)
- Show share link input

**API Call:**
```javascript
const generateReadinessCard = async () => {
  const response = await fetch('http://localhost:5000/api/readiness-card/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  const data = await response.json();
  return data.card;
};

// Share on WhatsApp
const shareOnWhatsApp = (card) => {
  const url = `${window.location.origin}/card/${card.shareLink}`;
  const text = `Check out my Placement Readiness Score: ${card.score}/100! 🎯\n\nGenerate yours at Kai Placement Copilot`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');
};
```

**UI Components:**
```jsx
// Readiness Card
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
  
  <div className="card-stats">
    <div>👁️ {card.views} views</div>
    <div>🔗 {card.clicks} clicks</div>
  </div>
</div>

// Share Buttons
<div className="share-buttons">
  <button onClick={() => shareOnWhatsApp(card)} className="btn-whatsapp">
    📱 Share on WhatsApp
  </button>
  <button onClick={() => copyShareLink(card.shareLink)}>
    🔗 Copy Link
  </button>
</div>
```

---

### 6. Public Card View (No Auth)

**UI Flow:**
- Show readiness card (same design)
- Show CTA section below
- Track view on page load
- Track click when CTA button pressed

**API Call:**
```javascript
// Get card by share link (no auth)
const getPublicCard = async (shareLink) => {
  const response = await fetch(`http://localhost:5000/api/readiness-card/share/${shareLink}`);
  const data = await response.json();
  return data.card;
};

// Track view (call on page load)
const trackView = async (shareLink) => {
  await fetch(`http://localhost:5000/api/readiness-card/share/${shareLink}/view`, {
    method: 'POST'
  });
};

// Track click (call when CTA clicked)
const trackClick = async (shareLink) => {
  await fetch(`http://localhost:5000/api/readiness-card/share/${shareLink}/click`, {
    method: 'POST'
  });
};
```

**UI Components:**
```jsx
// Public Card Page
<div className="public-card-page">
  {/* Same readiness card component */}
  <ReadinessCard card={card} />
  
  {/* CTA Section */}
  <div className="cta-section">
    <h3>Want to improve your placement readiness?</h3>
    <p>Generate your own personalized action plan and track your progress</p>
    <Link 
      to="/signup" 
      onClick={() => trackClick(shareLink)}
      className="btn-primary btn-large"
    >
      🎯 Try Kai Placement Copilot
    </Link>
  </div>
</div>
```

---

### 7. Leaderboard (Public)

**UI Flow:**
- Show top 100 students in table
- Show college filter dropdown
- Highlight top 3 with special styling
- Show rank emoji for top 3

**API Call:**
```javascript
// Get leaderboard (no auth required)
const getLeaderboard = async (college = '') => {
  const params = college ? `?college=${encodeURIComponent(college)}` : '';
  const response = await fetch(`http://localhost:5000/api/leaderboard${params}`);
  const data = await response.json();
  return data.leaderboard;
};

// Get colleges list
const getColleges = async () => {
  const response = await fetch('http://localhost:5000/api/leaderboard/colleges');
  const data = await response.json();
  return data.colleges;
};

// Get my rank (requires auth)
const getMyRank = async () => {
  const response = await fetch('http://localhost:5000/api/leaderboard/my-rank', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  const data = await response.json();
  return data;
};
```

**UI Components:**
```jsx
// Leaderboard Table
<table>
  <thead>
    <tr>
      <th>Rank</th>
      <th>Name</th>
      <th>College</th>
      <th>Role</th>
      <th>Score</th>
      <th>Days Active</th>
    </tr>
  </thead>
  <tbody>
    {leaderboard.map(entry => (
      <tr key={entry.rank} className={entry.rank <= 3 ? 'top-rank' : ''}>
        <td className="rank">
          {entry.rank === 1 ? '🥇' : 
           entry.rank === 2 ? '🥈' : 
           entry.rank === 3 ? '🥉' : 
           `#${entry.rank}`}
        </td>
        <td>{entry.name}</td>
        <td>{entry.college}</td>
        <td>{entry.targetRole || 'N/A'}</td>
        <td className="score">{entry.readinessScore}</td>
        <td>{entry.daysActive}</td>
      </tr>
    ))}
  </tbody>
</table>
```

---

## Complete React Context Example

```jsx
// AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const signup = async (name, email, password, college) => {
    const response = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, college })
    });
    const data = await response.json();
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## Routing Example

```jsx
// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/card/:shareLink" element={<PublicCard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/action-plan" element={<PrivateRoute><ActionPlan /></PrivateRoute>} />
          <Route path="/mock-interview" element={<PrivateRoute><MockInterview /></PrivateRoute>} />
          <Route path="/readiness" element={<PrivateRoute><ReadinessCard /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

---

## Error Handling Pattern

```javascript
const handleApiCall = async (apiFunction) => {
  try {
    setLoading(true);
    setError('');
    const result = await apiFunction();
    return result;
  } catch (error) {
    setError(error.message || 'Something went wrong');
    return null;
  } finally {
    setLoading(false);
  }
};

// Usage
const handleGeneratePlan = async () => {
  const plan = await handleApiCall(generateActionPlan);
  if (plan) {
    setActionPlan(plan);
  }
};
```

---

## Loading States

```jsx
// Button Loading
<button disabled={loading}>
  {loading ? 'Loading...' : 'Submit'}
</button>

// Page Loading
{loading ? (
  <div className="loading">Loading...</div>
) : (
  <div>{/* content */}</div>
)}

// AI Generation Loading
{generating ? (
  <div className="loading">
    <div className="spinner" />
    <p>Generating... (this may take 10-15 seconds)</p>
  </div>
) : (
  <button onClick={generate}>Generate</button>
)}
```

---

## Key Points for Lovable

1. **Base URL**: `http://localhost:5000/api`
2. **Auth**: Store JWT in localStorage, include in Authorization header
3. **AI Endpoints**: Show loading for 10-15 seconds
4. **Public Routes**: Leaderboard and public card don't need auth
5. **Error Handling**: Show user-friendly messages
6. **Loading States**: Always show loading indicators
7. **Responsive**: Mobile-first design
8. **Colors**: Purple gradient theme (#667eea to #764ba2)
9. **Animations**: Smooth transitions, hover effects
10. **Gamification**: Progress bars, scores, rankings

---

## Testing the Backend

The backend is fully functional. Test with:
```bash
cd server
node test-api.js
```

All 20 endpoints are tested and working.

---

## Support

If you need clarification on any endpoint or response format, refer to:
- `API_DOCUMENTATION.md` - Complete API reference
- `UI_REQUIREMENTS.md` - Design guidelines
- `README.md` - Project overview

The backend is running and ready for your beautiful UI! 🎨
