import mongoose from 'mongoose';

const actionPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  plan: [{
    day: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    tasks: [{
      task: {
        type: String,
        required: true
      },
      done: {
        type: Boolean,
        default: false
      },
      resourceLink: {
        type: String,
        default: null
      }
    }]
  }],
  resumeTips: {
    type: [String],
    default: []
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Calculate progress based on completed tasks
actionPlanSchema.methods.calculateProgress = function() {
  let totalTasks = 0;
  let completedTasks = 0;
  
  this.plan.forEach(day => {
    totalTasks += day.tasks.length;
    completedTasks += day.tasks.filter(task => task.done).length;
  });
  
  this.progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  return this.progress;
};

export default mongoose.model('ActionPlan', actionPlanSchema);
