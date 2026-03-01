import mongoose from 'mongoose';

const mockInterviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      default: null
    },
    answered: {
      type: Boolean,
      default: false
    },
    isCorrect: {
      type: Boolean,
      default: null
    }
  }],
  completedAt: {
    type: Date,
    default: null
  },
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  wrongAnswers: {
    type: Number,
    default: 0
  },
  suggestions: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Calculate completion score
mockInterviewSchema.methods.calculateScore = function() {
  const answeredCount = this.questions.filter(q => q.answered).length;
  this.score = Math.round((answeredCount / this.questions.length) * 100);
  if (this.score === 100 && !this.completedAt) {
    this.completedAt = new Date();
  }
  return this.score;
};

export default mongoose.model('MockInterview', mockInterviewSchema);
