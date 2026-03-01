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
import careerCoachRoutes from './routes/careerCoach.js';

dotenv.config();

const app = express();

// CORS configuration with whitelist
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request ID middleware for tracing
app.use((req, res, next) => {
  req.id = Math.random().toString(36).substring(7);
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/action-plan', actionPlanRoutes);
app.use('/api/mock-interview', mockInterviewRoutes);
app.use('/api/readiness-card', readinessRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/career-coach', careerCoachRoutes);

// Health check with dependency status
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    message: 'Kai Placement Copilot API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    dependencies: {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    }
  };
  
  const statusCode = health.dependencies.database === 'connected' ? 200 : 503;
  res.status(statusCode).json(health);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[${req.id}] Error:`, err);
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  res.status(err.status || 500).json({ 
    error: isDevelopment ? err.message : 'Internal server error',
    requestId: req.id,
    ...(isDevelopment && { stack: err.stack })
  });
});

// Connect to MongoDB
console.log('🔄 Connecting to MongoDB...');

let isDbConnected = false;

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    isDbConnected = true;
    console.log('✅ Connected to MongoDB');
    console.log(`📦 Database: kai_placement_copilot`);
    
    // Create indexes
    createIndexes();
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('\n⚠️  IMPORTANT: MongoDB connection failed!');
    console.log('   The server will start but database operations will fail.');
    console.log('   Please whitelist your IP in MongoDB Atlas:');
    console.log('   1. Go to https://cloud.mongodb.com');
    console.log('   2. Select your cluster → Network Access');
    console.log('   3. Add IP Address → Add Current IP Address');
    console.log('   4. Or add 0.0.0.0/0 (Allow from anywhere) for testing\n');
  });

// Create database indexes for performance
async function createIndexes() {
  try {
    const User = (await import('./models/User.js')).default;
    const ActionPlan = (await import('./models/ActionPlan.js')).default;
    const MockInterview = (await import('./models/MockInterview.js')).default;
    const ReadinessCard = (await import('./models/ReadinessCard.js')).default;
    const CareerCoachSession = (await import('./models/CareerCoachSession.js')).default;
    
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ readinessScore: -1 });
    await User.collection.createIndex({ college: 1 });
    await ActionPlan.collection.createIndex({ userId: 1 }, { unique: true });
    await MockInterview.collection.createIndex({ userId: 1 });
    await ReadinessCard.collection.createIndex({ userId: 1 }, { unique: true });
    await ReadinessCard.collection.createIndex({ shareLink: 1 }, { unique: true });
    await CareerCoachSession.collection.createIndex({ userId: 1 }, { unique: true });
    
    console.log('✅ Database indexes created');
  } catch (error) {
    console.error('⚠️  Error creating indexes:', error.message);
  }
}

// Middleware to check DB connection
app.use((req, res, next) => {
  if (!isDbConnected && !req.path.includes('/health')) {
    return res.status(503).json({ 
      error: 'Database connection not available. Please try again later.',
      code: 'DB_UNAVAILABLE'
    });
  }
  next();
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing server gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log('\n💡 Next Steps:');
  console.log('   1. Ensure MongoDB Atlas IP is whitelisted');
  console.log('   2. Frontend will start on http://localhost:5173');
  console.log('   3. Run tests: cd server && node test-api.js\n');
});

export default app;
