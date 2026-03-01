import mongoose from 'mongoose';

const readinessCardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  shareLink: {
    type: String,
    required: true,
    unique: true
  },
  views: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },
  breakdown: {
    profileComplete: Number,
    actionPlanProgress: Number,
    mockInterviewsDone: Number,
    daysActive: Number
  }
}, {
  timestamps: true
});

export default mongoose.model('ReadinessCard', readinessCardSchema);
