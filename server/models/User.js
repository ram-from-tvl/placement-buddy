import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  college: {
    type: String,
    required: true,
    trim: true
  },
  profile: {
    year: {
      type: String,
      enum: ['1st', '2nd', '3rd', '4th'],
      default: null
    },
    branch: {
      type: String,
      default: null
    },
    targetRole: {
      type: String,
      default: null
    },
    skills: {
      type: [String],
      default: []
    },
    hoursPerWeek: {
      type: Number,
      default: null
    }
  },
  readinessScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  daysActive: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate profile completeness
userSchema.methods.getProfileCompleteness = function() {
  const profile = this.profile;
  let score = 0;
  if (profile.year) score += 20;
  if (profile.branch) score += 20;
  if (profile.targetRole) score += 20;
  if (profile.skills && profile.skills.length > 0) score += 20;
  if (profile.hoursPerWeek) score += 20;
  return score;
};

export default mongoose.model('User', userSchema);
