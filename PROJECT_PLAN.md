# Kai Placement Copilot - 8 Hour Build Plan

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB
- AI: Gemini API
- Auth: JWT-based simple auth

## Project Structure
```
kai-placement-copilot/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Main pages
│   │   ├── services/      # API calls
│   │   └── utils/         # Helpers
├── server/                # Node backend
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── controllers/      # Business logic
│   └── middleware/       # Auth, validation
└── .env                  # Config (API keys, DB URI)
```

## Core Features (Priority Order)

### 1. Authentication (30 min)
- Simple email/password signup/login
- JWT token generation
- Protected routes

### 2. Smart Input Form (45 min)
- Collect: year, branch, target role, skills, hours/week
- Store in MongoDB user profile
- Clean, single-page form

### 3. 7-Day Action Plan Generator (90 min)
- Gemini API integration
- Prompt engineering for personalized roadmap
- Day-by-day tasks with resource links
- Checklist UI with progress tracking
- ATS resume tips section

### 4. Mock Interview Questions (60 min)
- Role-based question sets (SDE, Data Analyst, Marketing, etc.)
- Gemini generates 10 questions per role
- Simple Q&A interface
- Save practice history

### 5. Placement Readiness Card (90 min)
- Calculate readiness score (0-100) based on:
  - Profile completeness
  - Action plan progress
  - Mock interview attempts
- Beautiful shareable card design
- Generate unique share link
- WhatsApp share button
- Track card views/clicks

### 6. Campus Leaderboard (60 min)
- Top 100 students by readiness score
- Filter by college
- Real-time updates
- Public view (no auth needed)

### 7. Viral Growth Mechanics (30 min)
- Referral tracking via share links
- "Try Your Own Score" CTA on cards
- Analytics: signups, shares, conversions

## Database Schema

### User
```javascript
{
  email, password, name, college,
  profile: { year, branch, targetRole, skills, hoursPerWeek },
  readinessScore, referredBy, createdAt
}
```

### ActionPlan
```javascript
{
  userId, plan: [{ day, tasks: [{ task, done, resourceLink }] }],
  resumeTips, createdAt
}
```

### MockInterview
```javascript
{
  userId, role, questions: [{ question, answer }],
  completedAt
}
```

### ReadinessCard
```javascript
{
  userId, score, shareLink, views, clicks, createdAt
}
```

## API Endpoints

### Auth
- POST /api/auth/signup
- POST /api/auth/login

### Profile
- POST /api/profile (create/update)
- GET /api/profile/:userId

### Action Plan
- POST /api/action-plan/generate
- GET /api/action-plan/:userId
- PATCH /api/action-plan/task/:taskId (mark done)

### Mock Interview
- POST /api/mock-interview/generate
- GET /api/mock-interview/:userId

### Readiness Card
- POST /api/readiness-card/generate
- GET /api/readiness-card/:shareLink (public)
- POST /api/readiness-card/:id/track (views/clicks)

### Leaderboard
- GET /api/leaderboard (public, paginated)
- GET /api/leaderboard/:college

## Gemini Prompt Templates

### Action Plan
```
Generate a 7-day placement preparation plan for:
- Year: {year}, Branch: {branch}
- Target Role: {targetRole}
- Current Skills: {skills}
- Available Time: {hoursPerWeek} hours/week

Provide day-by-day tasks with specific resource links.
Also include 5 ATS-friendly resume tips for {targetRole}.
```

### Mock Interview
```
Generate 10 interview questions for {targetRole} role.
Mix technical and behavioral questions.
Difficulty level based on {year} year student.
```

## Readiness Score Algorithm
```
Score = (profileComplete * 20) + 
        (actionPlanProgress * 40) + 
        (mockInterviewsDone * 30) + 
        (daysActive * 10)
```

## Time Breakdown (8 hours)
- Setup (30 min): Project init, dependencies, env config
- Auth (30 min)
- Input Form (45 min)
- Action Plan (90 min)
- Mock Interview (60 min)
- Readiness Card (90 min)
- Leaderboard (60 min)
- Viral Mechanics (30 min)
- Testing & Polish (60 min)

## Environment Variables
```
MONGODB_URI=your_mongo_uri
GEMINI_API_KEY=your_gemini_key
JWT_SECRET=random_secret
PORT=5000
CLIENT_URL=http://localhost:5173
```

## Quick Start Commands
```bash
# Backend
cd server && npm install
npm run dev

# Frontend
cd client && npm install
npm run dev
```

## MVP Scope (What to Skip)
- Email verification
- Password reset
- File uploads
- Advanced analytics dashboard
- Mobile app
- Deployment/hosting

## Success Criteria
- User can signup → fill profile → get action plan
- Generate readiness card with share link
- Leaderboard shows top students
- Share link works without login
- All features work locally
