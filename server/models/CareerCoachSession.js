import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);

const careerCoachSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Keep only the latest N messages for a session
careerCoachSessionSchema.methods.trimHistory = function (limit = 50) {
  if (this.messages.length > limit) {
    this.messages = this.messages.slice(this.messages.length - limit);
  }
};

export default mongoose.model('CareerCoachSession', careerCoachSessionSchema);

