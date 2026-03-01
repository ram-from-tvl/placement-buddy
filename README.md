# 🎯 Kai Placement Copilot

A complete placement preparation platform that helps students get placement-ready with personalized action plans, mock interviews, and readiness tracking.

## ✅ All Features Implemented & Tested

### Core Features
1. ✅ **Smart Input Form** - Collect year, branch, target role, skills, hours/week
2. ✅ **7-Day Action Plan** - AI-generated personalized roadmap with tasks and resources
3. ✅ **Mock Interview Questions** - Role-based questions (10 per session)
4. ✅ **Placement Readiness Card** - Beautiful shareable card with score breakdown
5. ✅ **Campus Leaderboard** - Top 100 students ranked by readiness score
6. ✅ **Viral Growth Mechanics** - Share links, view/click tracking, referral system

### Technical Stack
- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **AI/LLM**: Groq API (Llama 3.3 70B)
- **Auth**: JWT-based authentication

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Python 3.12+
- MongoDB Atlas account (already configured)

### 1. Backend Setup

```bash
# Install dependencies
cd server
npm install

# Server will start automatically with nodemon
# Already running on http://localhost:5000
```

### 2. Python LLM Service

```bash
# Activate virtual environment (already set up)
source venv/bin/activate

# The llm_service.py is already configured with Groq API
# No additional setup needed
```

### 3. Frontend Setup

```bash
# Install dependencies
cd client
npm install

# Start development server
npm run dev

# Frontend will be available at http://localhost:5173
```

## 📊 API Endpoints (All Tested ✅)

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Profile
- `POST /api/profile` - Update profile
- `GET /api/profile` - Get profile

### Action Plan
- `POST /api/action-plan/generate` - Generate AI action plan
- `GET /api/action-plan` - Get action plan
- `PATCH /api/action-plan/task` - Mark task as done

### Mock Interview
- `POST /api/mock-interview/generate` - Generate questions
- `GET /api/mock-interview` - Get all interviews
- `GET /api/mock-interview/:id` - Get specific interview
- `PATCH /api/mock-interview/:id/answer` - Save answer

### Readiness Card
- `POST /api/readiness-card/generate` - Generate card
- `GET /api/readiness-card` - Get user's card
- `GET /api/readiness-card/share/:shareLink` - Public card view
- `POST /api/readiness-card/share/:shareLink/view` - Track view
- `POST /api/readiness-card/share/:shareLink/click` - Track click

### Leaderboard
- `GET /api/leaderboard` - Get top 100 students
- `GET /api/leaderboard/colleges` - Get all colleges
- `GET /api/leaderboard/my-rank` - Get user's rank

## 🎮 User Flow

1. **Signup/Login** → Create account or login
2. **Complete Profile** → Add year, branch, target role, skills, hours/week
3. **Generate Action Plan** → Get AI-powered 7-day roadmap
4. **Practice Interviews** → Generate and answer mock questions
5. **Generate Readiness Card** → Create shareable card with score
6. **Share & Compete** → Share on WhatsApp, climb leaderboard

## 📈 Readiness Score Calculation

```
Total Score (0-100) = 
  Profile Completeness (20 points) +
  Action Plan Progress (40 points) +
  Mock Interviews Done (30 points) +
  Days Active (10 points)
```

## 🔥 Viral Growth Features

1. **Shareable Readiness Card**
   - Unique share link for each user
   - WhatsApp share button
   - View and click tracking

2. **Campus Leaderboard**
   - Top 100 students displayed
   - Filter by college
   - Real-time ranking updates

3. **Referral System**
   - Track who referred whom
   - Built into signup flow

## 🧪 Testing

All 20 API endpoints have been tested successfully:

```bash
cd server
node test-api.js
```

Test Results: ✅ 20/20 passed

## 🌐 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.ex1mc.mongodb.net/kai_placement_copilot
GROQ_API_KEY=your_groq_api_key_here
JWT_SECRET=kai_placement_secret_key_2024_secure_random
PORT=5000
CLIENT_URL=http://localhost:5173
```

## 📱 Frontend Pages

1. `/login` - Login page
2. `/signup` - Signup page
3. `/` - Dashboard (protected)
4. `/profile` - Profile setup (protected)
5. `/action-plan` - 7-day action plan (protected)
6. `/mock-interview` - Mock interviews (protected)
7. `/readiness` - Readiness card (protected)
8. `/leaderboard` - Public leaderboard
9. `/card/:shareLink` - Public card view

## 🎨 Key Features Highlights

### AI-Powered Action Plans
- Personalized based on user profile
- Day-by-day tasks with resource links
- Progress tracking with checkboxes
- ATS-friendly resume tips

### Mock Interviews
- Role-specific questions
- Technical + behavioral mix
- Answer tracking
- Progress scoring

### Readiness Card
- Beautiful gradient design
- Score breakdown visualization
- Social sharing (WhatsApp)
- View/click analytics

### Leaderboard
- Top 100 ranking
- College filtering
- Real-time updates
- Competitive motivation

## 🔧 Technical Highlights

1. **Groq LLM Integration** - Fast, reliable AI responses using Llama 3.3 70B
2. **Python-Node.js Bridge** - Seamless integration via child process
3. **JWT Authentication** - Secure token-based auth
4. **MongoDB Atlas** - Cloud database with proper indexing
5. **React Router** - Client-side routing
6. **Responsive Design** - Mobile-friendly UI

## 📊 Database Schema

### Users
- Authentication (email, password)
- Profile (year, branch, role, skills, hours)
- Readiness score
- Referral tracking

### Action Plans
- 7-day structure
- Task completion tracking
- Progress calculation
- Resume tips

### Mock Interviews
- Role-based questions
- Answer storage
- Completion scoring

### Readiness Cards
- Score breakdown
- Share links
- View/click analytics

## 🎯 Success Metrics

The application tracks:
- Total signups
- Cards generated
- Share clicks
- Referral conversions
- Campus leaderboard rankings

## 🚀 Deployment Ready

The application is fully functional and ready for demo. All features work end-to-end:
- ✅ User authentication
- ✅ Profile management
- ✅ AI action plan generation
- ✅ Mock interview generation
- ✅ Readiness card creation
- ✅ Social sharing
- ✅ Leaderboard system

## 📝 Notes

- Backend server running on port 5000
- Frontend running on port 5173
- MongoDB Atlas connected and working
- Groq API integrated and tested
- All 20 API endpoints functional
- Complete user flow implemented

## 🎉 Demo Instructions

1. Open http://localhost:5173
2. Sign up with any email
3. Complete your profile
4. Generate action plan (takes 10-15 seconds)
5. Generate mock interview
6. Generate readiness card
7. Share your card!
8. Check the leaderboard

---

Built for the Kai Placement Copilot Hackathon 🚀
