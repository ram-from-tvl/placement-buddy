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
    // Basic Info
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
    },
    
    // Comprehensive Resume Data
    phone: {
      type: String,
      default: null
    },
    location: {
      type: String,
      default: null
    },
    linkedin: {
      type: String,
      default: null
    },
    github: {
      type: String,
      default: null
    },
    portfolio: {
      type: String,
      default: null
    },
    
    // Education Details
    education: [{
      degree: String,
      institution: String,
      year: String,
      cgpa: String,
      location: String
    }],
    
    // Experience
    experience: [{
      title: String,
      company: String,
      duration: String,
      description: String,
      location: String
    }],
    
    // Projects
    projects: [{
      name: String,
      description: String,
      technologies: [String],
      link: String
    }],
    
    // Certifications
    certifications: [{
      name: String,
      issuer: String,
      date: String,
      link: String
    }],
    
    // Achievements
    achievements: {
      type: [String],
      default: []
    },
    
    // Languages
    languages: {
      type: [String],
      default: []
    },
    
    // ATS Data
    atsScore: {
      type: Number,
      default: null,
      min: 0,
      max: 100
    },
    atsIssues: {
      type: [String],
      default: []
    },
    atsTips: {
      type: [String],
      default: []
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
  let total = 0;
  
  // Basic fields (required) - 50 points
  if (profile.year) score += 10;
  total += 10;
  if (profile.branch) score += 10;
  total += 10;
  if (profile.targetRole) score += 10;
  total += 10;
  if (profile.skills && profile.skills.length > 0) score += 10;
  total += 10;
  if (profile.hoursPerWeek) score += 10;
  total += 10;
  
  // Contact info - 15 points
  if (profile.phone) score += 5;
  total += 5;
  if (profile.location) score += 5;
  total += 5;
  if (profile.linkedin || profile.github || profile.portfolio) score += 5;
  total += 5;
  
  // Education - 10 points
  if (profile.education && profile.education.length > 0) score += 10;
  total += 10;
  
  // Experience - 10 points
  if (profile.experience && profile.experience.length > 0) score += 10;
  total += 10;
  
  // Projects - 10 points
  if (profile.projects && profile.projects.length > 0) score += 10;
  total += 10;
  
  // Additional - 5 points
  if (profile.certifications && profile.certifications.length > 0) score += 2.5;
  total += 2.5;
  if (profile.achievements && profile.achievements.length > 0) score += 2.5;
  total += 2.5;
  
  return Math.round((score / total) * 100);
};

export default mongoose.model('User', userSchema);
