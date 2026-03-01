# 🎯 Kai Placement Copilot - For Lovable UI Development

## TL;DR - What You Need to Know

I have a **fully functional backend** for a placement preparation platform. I need you to create a **beautiful, modern UI** that connects to it.

---

## 📚 Documentation Files

1. **API_DOCUMENTATION.md** - Complete API reference with all endpoints, request/response formats
2. **UI_REQUIREMENTS.md** - Design guidelines, colors, typography, component patterns
3. **LOVABLE_INTEGRATION_GUIDE.md** - Step-by-step integration examples with code
4. **README.md** - Project overview and setup instructions

---

## 🚀 Backend Status

✅ **Fully Built & Tested**
- 20 API endpoints (all working)
- MongoDB database (connected)
- AI integration with Groq (Llama 3.3 70B)
- JWT authentication
- Running on `http://localhost:5000`

---

## 🎨 What I Need from You

Create a **modern, beautiful React frontend** with:

### Pages Needed:
1. **Login Page** - Email/password form
2. **Signup Page** - Name, email, password, college
3. **Dashboard** - Stats cards + action cards
4. **Profile Page** - Form to complete profile
5. **Action Plan Page** - 7-day plan with checkboxes
6. **Mock Interview Page** - Questions with answer textareas
7. **Readiness Card Page** - Beautiful shareable card
8. **Leaderboard Page** - Top 100 students table
9. **Public Card Page** - View shared cards (no auth)

### Design Requirements:
- **Colors**: Purple gradient (#667eea to #764ba2)
- **Style**: Modern, clean, card-based
- **Responsive**: Mobile-first
- **Animations**: Smooth transitions, hover effects
- **Icons**: Use emojis (🎯📝📅💼🏆)

---

## 🔌 API Integration

### Base URL
```
http://localhost:5000/api
```

### Authentication
```javascript
// Store token after login/signup
localStorage.setItem('token', data.token);

// Include in requests
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}
```

### Key Endpoints

**Auth:**
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

**Profile:**
- `POST /api/profile` - Update profile
- `GET /api/profile` - Get profile

**Action Plan:**
- `POST /api/action-plan/generate` - Generate plan (takes 10-15 sec)
- `GET /api/action-plan` - Get plan
- `PATCH /api/action-plan/task` - Mark task done

**Mock Interview:**
- `POST /api/mock-interview/generate` - Generate questions (takes 10-15 sec)
- `GET /api/mock-interview` - Get all interviews
- `PATCH /api/mock-interview/:id/answer` - Save answer

**Readiness Card:**
- `POST /api/readiness-card/generate` - Generate card
- `GET /api/readiness-card` - Get user's card
- `GET /api/readiness-card/share/:shareLink` - Public view (no auth)

**Leaderboard:**
- `GET /api/leaderboard` - Top 100 (no auth)
- `GET /api/leaderboard/colleges` - College list (no auth)

---

## 💡 Key Features to Implement

### 1. Authentication Flow
- User signs up → gets token → redirects to profile
- User logs in → gets token → redirects to dashboard
- Protected routes check for token

### 2. Profile Setup
- Form with year, branch, target role, skills, hours/week
- All fields required
- Skills are comma-separated

### 3. Action Plan
- Button to generate (show loading 10-15 sec)
- Display 7 days with tasks
- Checkboxes to mark tasks done
- Progress bar showing completion %
- Resume tips section

### 4. Mock Interview
- Button to generate (show loading 10-15 sec)
- Display 10 questions
- Textarea for each answer
- Save button per question
- Progress bar showing answered %

### 5. Readiness Card
- Beautiful card with:
  - Large score circle (0-100)
  - User name, college, role
  - Score breakdown (4 items)
  - View/click stats
- WhatsApp share button
- Copy link button

### 6. Leaderboard
- Table with top 100 students
- Filter by college dropdown
- Highlight top 3 with emojis (🥇🥈🥉)
- Show rank, name, college, role, score, days active

### 7. Public Card
- Same card design as user's card
- CTA section below
- Track view on load
- Track click on CTA button

---

## 🎯 User Journey

1. User lands on login page
2. Clicks "Sign up"
3. Fills form → submits
4. Redirects to profile page
5. Completes profile → submits
6. Redirects to dashboard
7. Sees stats (all 0) and action cards
8. Clicks "Generate Action Plan"
9. Waits 10-15 seconds
10. Sees plan, starts checking tasks
11. Generates mock interview
12. Answers questions
13. Generates readiness card
14. Shares on WhatsApp
15. Checks leaderboard

---

## 🎨 Design Guidelines

### Colors
```css
--primary: #667eea;
--secondary: #764ba2;
--gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--success: #10b981;
--error: #ef4444;
--warning: #f59e0b;
```

### Typography
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

### Components
- **Cards**: White background, rounded corners, shadow
- **Buttons**: Primary (purple), secondary (gray), WhatsApp (green)
- **Progress Bars**: Gradient fill, rounded
- **Forms**: Clean inputs with focus states

---

## ⚠️ Important Notes

1. **AI Generation Takes Time**
   - Action plan: 10-15 seconds
   - Mock interview: 10-15 seconds
   - Show loading state with message

2. **Profile Required**
   - User must complete profile before generating plan/interview
   - Show error if profile incomplete

3. **Public Routes**
   - Leaderboard doesn't need auth
   - Public card view doesn't need auth
   - Everything else needs auth

4. **Share Links**
   - Format: `http://localhost:5173/card/{shareLink}`
   - WhatsApp text: "Check out my Placement Readiness Score: {score}/100! 🎯"

5. **Error Handling**
   - Show user-friendly error messages
   - Handle 401 (redirect to login)
   - Handle 404 (show empty state)
   - Handle 500 (show error message)

---

## 📦 Tech Stack Suggestion

- **React** (with hooks)
- **React Router** (for routing)
- **Axios** or **Fetch** (for API calls)
- **Context API** (for auth state)
- **CSS** or **Tailwind** (for styling)

---

## 🧪 Testing the Backend

The backend is running and tested. You can verify:

```bash
# Health check
curl http://localhost:5000/health

# Run full test suite
cd server
node test-api.js
```

All 20 endpoints pass tests.

---

## 📖 Example Code

### Login Component
```jsx
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};
```

### Protected Route
```jsx
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};
```

---

## 🎯 Success Criteria

Your UI should:
- ✅ Look modern and professional
- ✅ Be fully responsive (mobile + desktop)
- ✅ Connect to all backend endpoints
- ✅ Handle loading states
- ✅ Handle errors gracefully
- ✅ Show smooth animations
- ✅ Be easy to navigate
- ✅ Make sharing easy (WhatsApp button)
- ✅ Show progress everywhere
- ✅ Feel fast and responsive

---

## 🚀 Getting Started

1. Read `API_DOCUMENTATION.md` for all endpoints
2. Read `UI_REQUIREMENTS.md` for design guidelines
3. Read `LOVABLE_INTEGRATION_GUIDE.md` for code examples
4. Start building!

The backend is ready and waiting for your beautiful UI! 🎨

---

## 📞 Questions?

Refer to the documentation files:
- API details → `API_DOCUMENTATION.md`
- Design specs → `UI_REQUIREMENTS.md`
- Code examples → `LOVABLE_INTEGRATION_GUIDE.md`
- Project info → `README.md`

Everything you need is documented. Let's build something amazing! 🚀
