import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import actionPlanRoutes from './routes/actionPlan.js';
import mockInterviewRoutes from './routes/mockInterview.js';
import readinessRoutes from './routes/readiness.js';
import leaderboardRoutes from './routes/leaderboard.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/action-plan', actionPlanRoutes);
app.use('/api/mock-interview', mockInterviewRoutes);
app.use('/api/readiness-card', readinessRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Kai Placement Copilot API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Connect to MongoDB
console.log('🔄 Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✅ Connected to MongoDB');
    console.log(`📦 Database: kai_placement_copilot`);
    
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 API: http://localhost:${PORT}`);
      console.log(`🏥 Health: http://localhost:${PORT}/health`);
      console.log('\n⚠️  If you see connection errors, please:');
      console.log('   1. Go to MongoDB Atlas Dashboard');
      console.log('   2. Network Access → Add IP Address');
      console.log('   3. Add 0.0.0.0/0 (Allow from anywhere) for testing');
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('\n⚠️  Please whitelist your IP in MongoDB Atlas:');
    console.log('   1. Go to https://cloud.mongodb.com');
    console.log('   2. Select your cluster');
    console.log('   3. Network Access → Add IP Address');
    console.log('   4. Add 0.0.0.0/0 (Allow from anywhere) for testing\n');
    process.exit(1);
  });

export default app;
