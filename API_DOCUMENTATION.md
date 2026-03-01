# Kai Placement Copilot - Complete API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

The token is returned from `/auth/signup` and `/auth/login` endpoints.

---

## 1. Authentication Endpoints

### POST /api/auth/signup
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "college": "IIT Delhi",
  "referralCode": "optional_user_id"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "college": "IIT Delhi",
    "readinessScore": 0
  }
}
```

**Error (400):**
```json
{
  "error": "Email already registered"
}
```

---

### POST /api/auth/login
Login to existing account.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "college": "IIT Delhi",
    "profile": {
      "year": "3rd",
      "branch": "Computer Science",
      "targetRole": "Software Development Engineer",
      "skills": ["JavaScript", "React", "Node.js"],
      "hoursPerWeek": 20
    },
    "readinessScore": 45
  }
}
```

**Error (401):**
```json
{
  "error": "Invalid credentials"
}
```

---

### GET /api/auth/me
Get current logged-in user details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "college": "IIT Delhi",
    "profile": {
      "year": "3rd",
      "branch": "Computer Science",
      "targetRole": "Software Development Engineer",
      "skills": ["JavaScript", "React", "Node.js"],
      "hoursPerWeek": 20
    },
    "readinessScore": 45,
    "daysActive": 5
  }
}
```

---

## 2. Profile Endpoints

### POST /api/profile
Update user profile (creates or updates).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "year": "3rd",
  "branch": "Computer Science",
  "targetRole": "Software Development Engineer",
  "skills": ["JavaScript", "React", "Node.js", "Python", "MongoDB"],
  "hoursPerWeek": 20
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "profile": {
    "year": "3rd",
    "branch": "Computer Science",
    "targetRole": "Software Development Engineer",
    "skills": ["JavaScript", "React", "Node.js", "Python", "MongoDB"],
    "hoursPerWeek": 20
  },
  "profileCompleteness": 100
}
```

**Error (400):**
```json
{
  "error": "All fields are required"
}
```

---

### GET /api/profile
Get current user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "college": "IIT Delhi",
    "profile": {
      "year": "3rd",
      "branch": "Computer Science",
      "targetRole": "Software Development Engineer",
      "skills": ["JavaScript", "React", "Node.js"],
      "hoursPerWeek": 20
    },
    "readinessScore": 45,
    "daysActive": 5
  },
  "profileCompleteness": 100
}
```

---

## 3. Action Plan Endpoints

### POST /api/action-plan/generate
Generate a personalized 7-day action plan using AI.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** None (uses user's profile)

**Response (200):**
```json
{
  "message": "Action plan generated successfully",
  "actionPlan": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439011",
    "plan": [
      {
        "day": 1,
        "title": "Foundation & Profile Setup",
        "tasks": [
          {
            "task": "Update your LinkedIn profile with relevant skills",
            "done": false,
            "resourceLink": "https://www.linkedin.com/help"
          },
          {
            "task": "Create a GitHub portfolio",
            "done": false,
            "resourceLink": "https://docs.github.com"
          }
        ]
      },
      {
        "day": 2,
        "title": "Resume & Technical Prep",
        "tasks": [
          {
            "task": "Build an ATS-friendly resume",
            "done": false,
            "resourceLink": "https://www.overleaf.com"
          }
        ]
      }
      // ... days 3-7
    ],
    "resumeTips": [
      "Use action verbs like 'Developed', 'Implemented'",
      "Quantify achievements with metrics",
      "Keep it to 1 page for students",
      "Include relevant coursework and projects",
      "Tailor resume for each application"
    ],
    "progress": 0,
    "createdAt": "2024-02-01T10:00:00.000Z"
  }
}
```

**Error (400):**
```json
{
  "error": "Please complete your profile first"
}
```

**Note:** This endpoint takes 10-15 seconds as it uses AI to generate the plan.

---

### GET /api/action-plan
Get user's action plan.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "actionPlan": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439011",
    "plan": [
      {
        "day": 1,
        "title": "Foundation & Profile Setup",
        "tasks": [
          {
            "task": "Update your LinkedIn profile",
            "done": true,
            "resourceLink": "https://www.linkedin.com/help"
          }
        ]
      }
      // ... more days
    ],
    "resumeTips": ["tip1", "tip2", "tip3", "tip4", "tip5"],
    "progress": 25,
    "createdAt": "2024-02-01T10:00:00.000Z"
  }
}
```

**Error (404):**
```json
{
  "error": "Action plan not found. Please generate one first."
}
```

---

### PATCH /api/action-plan/task
Mark a task as done or undone.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "day": 1,
  "taskIndex": 0,
  "done": true
}
```

**Response (200):**
```json
{
  "message": "Task updated successfully",
  "progress": 5,
  "actionPlan": {
    // ... full action plan with updated task
  }
}
```

---

## 4. Mock Interview Endpoints

### POST /api/mock-interview/generate
Generate mock interview questions using AI.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "role": "Software Development Engineer"
}
```
*Note: If role is not provided, uses user's profile targetRole*

**Response (200):**
```json
{
  "message": "Mock interview created successfully",
  "mockInterview": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439011",
    "role": "Software Development Engineer",
    "questions": [
      {
        "question": "Explain the difference between stack and heap memory",
        "answer": null,
        "answered": false
      },
      {
        "question": "What is the time complexity of quicksort?",
        "answer": null,
        "answered": false
      }
      // ... 10 questions total
    ],
    "completedAt": null,
    "score": 0,
    "createdAt": "2024-02-01T10:00:00.000Z"
  }
}
```

**Note:** This endpoint takes 10-15 seconds as it uses AI.

---

### GET /api/mock-interview
Get all mock interviews for the user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "mockInterviews": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439011",
      "role": "Software Development Engineer",
      "questions": [
        // ... 10 questions
      ],
      "completedAt": "2024-02-01T11:00:00.000Z",
      "score": 80,
      "createdAt": "2024-02-01T10:00:00.000Z"
    }
    // ... more interviews
  ]
}
```

---

### GET /api/mock-interview/:id
Get a specific mock interview.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "mockInterview": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439011",
    "role": "Software Development Engineer",
    "questions": [
      {
        "question": "Explain the difference between stack and heap memory",
        "answer": "Stack is used for static memory allocation...",
        "answered": true
      }
      // ... more questions
    ],
    "completedAt": null,
    "score": 30,
    "createdAt": "2024-02-01T10:00:00.000Z"
  }
}
```

---

### PATCH /api/mock-interview/:id/answer
Save an answer to a question.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "questionIndex": 0,
  "answer": "Stack is used for static memory allocation and stores local variables..."
}
```

**Response (200):**
```json
{
  "message": "Answer saved successfully",
  "score": 10,
  "mockInterview": {
    // ... full interview with updated answer
  }
}
```

---

## 5. Readiness Card Endpoints

### POST /api/readiness-card/generate
Generate or update readiness card.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** None

**Response (200):**
```json
{
  "message": "Readiness card generated successfully",
  "card": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "college": "IIT Delhi",
      "profile": {
        "targetRole": "Software Development Engineer"
      }
    },
    "score": 45,
    "shareLink": "abc123xyz",
    "views": 0,
    "clicks": 0,
    "breakdown": {
      "profileComplete": 20,
      "actionPlanProgress": 10,
      "mockInterviewsDone": 10,
      "daysActive": 5
    },
    "createdAt": "2024-02-01T10:00:00.000Z"
  }
}
```

**Score Calculation:**
- Profile Complete: 0-20 points (based on profile completeness)
- Action Plan Progress: 0-40 points (based on tasks completed)
- Mock Interviews Done: 0-30 points (10 points per completed interview, max 3)
- Days Active: 0-10 points (2 points per day, max 5 days)

---

### GET /api/readiness-card
Get user's readiness card.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "card": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "college": "IIT Delhi",
      "profile": {
        "targetRole": "Software Development Engineer"
      }
    },
    "score": 45,
    "shareLink": "abc123xyz",
    "views": 15,
    "clicks": 3,
    "breakdown": {
      "profileComplete": 20,
      "actionPlanProgress": 10,
      "mockInterviewsDone": 10,
      "daysActive": 5
    },
    "createdAt": "2024-02-01T10:00:00.000Z"
  }
}
```

**Error (404):**
```json
{
  "error": "Readiness card not found. Please generate one first."
}
```

---

### GET /api/readiness-card/share/:shareLink
Get readiness card by share link (PUBLIC - no auth required).

**Response (200):**
```json
{
  "card": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "college": "IIT Delhi",
      "profile": {
        "targetRole": "Software Development Engineer"
      }
    },
    "score": 45,
    "shareLink": "abc123xyz",
    "views": 15,
    "clicks": 3,
    "breakdown": {
      "profileComplete": 20,
      "actionPlanProgress": 10,
      "mockInterviewsDone": 10,
      "daysActive": 5
    },
    "createdAt": "2024-02-01T10:00:00.000Z"
  }
}
```

---

### POST /api/readiness-card/share/:shareLink/view
Track a view on the card (PUBLIC - no auth required).

**Response (200):**
```json
{
  "message": "View tracked",
  "views": 16
}
```

---

### POST /api/readiness-card/share/:shareLink/click
Track a click on the card (PUBLIC - no auth required).

**Response (200):**
```json
{
  "message": "Click tracked",
  "clicks": 4
}
```

---

## 6. Leaderboard Endpoints

### GET /api/leaderboard
Get top 100 students (PUBLIC - no auth required).

**Query Parameters:**
- `college` (optional): Filter by college name
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 100)

**Example:**
```
GET /api/leaderboard?college=IIT%20Delhi&page=1&limit=50
```

**Response (200):**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "name": "John Doe",
      "college": "IIT Delhi",
      "targetRole": "Software Development Engineer",
      "readinessScore": 95,
      "daysActive": 10,
      "hasCard": true,
      "shareLink": "abc123xyz"
    },
    {
      "rank": 2,
      "name": "Jane Smith",
      "college": "IIT Bombay",
      "targetRole": "Data Analyst",
      "readinessScore": 92,
      "daysActive": 8,
      "hasCard": true,
      "shareLink": "def456uvw"
    }
    // ... up to 100 entries
  ],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 250,
    "pages": 3
  }
}
```

---

### GET /api/leaderboard/colleges
Get list of all colleges (PUBLIC - no auth required).

**Response (200):**
```json
{
  "colleges": [
    "IIT Delhi",
    "IIT Bombay",
    "IIT Madras",
    "BITS Pilani",
    "NIT Trichy"
  ]
}
```

---

### GET /api/leaderboard/my-rank
Get current user's rank.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "overallRank": 15,
  "collegeRank": 3,
  "readinessScore": 85
}
```

---

## Error Responses

All endpoints may return these common errors:

**401 Unauthorized:**
```json
{
  "error": "Authentication required"
}
```

**401 Invalid Token:**
```json
{
  "error": "Invalid token"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Server Error:**
```json
{
  "error": "Internal server error"
}
```

---

## Important Notes

1. **Authentication Flow:**
   - User signs up → receives token
   - Store token in localStorage/sessionStorage
   - Include token in Authorization header for all protected endpoints
   - Token expires in 30 days

2. **Profile Requirement:**
   - User must complete profile before generating action plan or mock interviews
   - Profile completeness affects readiness score

3. **AI Generation:**
   - Action plan and mock interview generation take 10-15 seconds
   - Show loading state to user
   - These endpoints use Groq LLM (Llama 3.3 70B)

4. **Readiness Score:**
   - Automatically calculated when generating readiness card
   - Updates user's readinessScore field
   - Formula: profileComplete(20) + actionPlanProgress(40) + mockInterviews(30) + daysActive(10)

5. **Share Links:**
   - Generated using nanoid (10 characters)
   - Unique per user
   - Public access (no auth required)
   - Track views and clicks for analytics

6. **Leaderboard:**
   - Public access
   - Real-time ranking
   - Filter by college
   - Shows top 100 students

7. **Days Active:**
   - Automatically tracked
   - Increments once per day when user makes authenticated request
   - Max 5 days counted for readiness score

---

## Example Frontend Integration

### Login Flow
```javascript
// Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const data = await response.json();
localStorage.setItem('token', data.token);

// Make authenticated request
const profileResponse = await fetch('http://localhost:5000/api/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

### Generate Action Plan
```javascript
const response = await fetch('http://localhost:5000/api/action-plan/generate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
const data = await response.json();
// data.actionPlan contains the 7-day plan
```

### Share Card
```javascript
// Generate card
const cardResponse = await fetch('http://localhost:5000/api/readiness-card/generate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
const cardData = await cardResponse.json();

// Share URL
const shareUrl = `http://localhost:5173/card/${cardData.card.shareLink}`;

// WhatsApp share
const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
  `Check out my Placement Readiness Score: ${cardData.card.score}/100! ${shareUrl}`
)}`;
```

---

## Testing

Run the test suite:
```bash
cd server
node test-api.js
```

This tests all 20 endpoints with real data.

---

## CORS Configuration

The backend allows requests from:
- `http://localhost:5173` (Vite dev server)
- Configure `CLIENT_URL` in `.env` for production

---

## Rate Limiting

Currently no rate limiting implemented. For production, consider:
- Rate limit AI generation endpoints (action plan, mock interview)
- Rate limit authentication endpoints
- Rate limit public endpoints (leaderboard, public cards)
