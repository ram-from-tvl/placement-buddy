import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
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
  correct: {
    type: Boolean,
    default: null
  }
});

const mockInterviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    role: {
      type: String,
      required: true
    },

    questions: [questionSchema],

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
    },

    completed: {
      type: Boolean,
      default: false
    },

    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Calculate score + correct/wrong
mockInterviewSchema.methods.calculateScore = function () {
  const totalQuestions = this.questions.length;

  const answeredCount = this.questions.filter((q) => q.answered).length;

  const correctCount = this.questions.filter((q) => q.correct === true).length;

  const wrongCount = this.questions.filter((q) => q.correct === false).length;

  this.correctAnswers = correctCount;
  this.wrongAnswers = wrongCount;

  if (totalQuestions > 0) {
    this.score = Math.round((answeredCount / totalQuestions) * 100);
  } else {
    this.score = 0;
  }

  // Mark interview completed
  if (answeredCount === totalQuestions && totalQuestions > 0) {
    this.completed = true;

    if (!this.completedAt) {
      this.completedAt = new Date();
    }
  }

  return this.score;
};

export default mongoose.model("MockInterview", mockInterviewSchema);