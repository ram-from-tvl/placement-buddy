import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ActionPlan from './pages/ActionPlan';
import MockInterview from './pages/MockInterview';
import ReadinessCard from './pages/ReadinessCard';
import Leaderboard from './pages/Leaderboard';
import PublicCard from './pages/PublicCard';
import CareerCoach from './pages/CareerCoach';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/card/:shareLink" element={<PublicCard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/action-plan" element={<PrivateRoute><ActionPlan /></PrivateRoute>} />
        <Route path="/mock-interview" element={<PrivateRoute><MockInterview /></PrivateRoute>} />
        <Route path="/readiness" element={<PrivateRoute><ReadinessCard /></PrivateRoute>} />
        <Route path="/career-coach" element={<PrivateRoute><CareerCoach /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
