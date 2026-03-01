# 🎯 Quick Reference Card

## Start/Stop Commands

```bash
# Start everything
./start.sh

# Stop everything
./stop.sh

# Run tests
./test.sh
```

## URLs

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
- **API Base:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/health

## Key Files for Lovable

1. **FOR_LOVABLE.md** - Start here!
2. **API_DOCUMENTATION.md** - All endpoints
3. **UI_REQUIREMENTS.md** - Design specs
4. **LOVABLE_INTEGRATION_GUIDE.md** - Code examples

## API Quick Reference

### Auth
```
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
```

### Profile
```
POST /api/profile
GET  /api/profile
```

### Action Plan
```
POST  /api/action-plan/generate  (10-15 sec)
GET   /api/action-plan
PATCH /api/action-plan/task
```

### Mock Interview
```
POST  /api/mock-interview/generate  (10-15 sec)
GET   /api/mock-interview
PATCH /api/mock-interview/:id/answer
```

### Readiness Card
```
POST /api/readiness-card/generate
GET  /api/readiness-card
GET  /api/readiness-card/share/:shareLink  (public)
```

### Leaderboard
```
GET /api/leaderboard  (public)
GET /api/leaderboard/colleges  (public)
```

## Auth Header

```javascript
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}
```

## Colors

```css
--primary: #667eea
--secondary: #764ba2
--gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

## Pages Needed

1. Login - `/login`
2. Signup - `/signup`
3. Dashboard - `/`
4. Profile - `/profile`
5. Action Plan - `/action-plan`
6. Mock Interview - `/mock-interview`
7. Readiness Card - `/readiness`
8. Leaderboard - `/leaderboard`
9. Public Card - `/card/:shareLink`

## Status

✅ Backend: Fully working
✅ Database: Connected
✅ AI: Integrated
✅ Tests: All passing
⚠️ Frontend: Needs redesign

## Next Step

Take documentation to Lovable and get beautiful UI! 🎨
