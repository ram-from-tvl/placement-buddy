import ActionPlan from '../models/ActionPlan.js';
import User from '../models/User.js';
import { generateActionPlan } from '../services/llm.js';

export const createActionPlan = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if profile is complete
    const { year, branch, targetRole, skills, hoursPerWeek } = user.profile;
    if (!year || !branch || !targetRole || !skills?.length || !hoursPerWeek) {
      return res.status(400).json({ error: 'Please complete your profile first' });
    }

    // Check if action plan already exists
    let actionPlan = await ActionPlan.findOne({ userId: req.userId });
    
    // Generate new plan using Groq
    const generatedPlan = await generateActionPlan(user.profile);

    if (actionPlan) {
      // Update existing plan
      actionPlan.plan = generatedPlan.plan;
      actionPlan.resumeTips = generatedPlan.resumeTips;
      actionPlan.calculateProgress(); // Calculate before resetting
      actionPlan.progress = 0; // Reset progress for new plan
    } else {
      // Create new plan
      actionPlan = new ActionPlan({
        userId: req.userId,
        plan: generatedPlan.plan,
        resumeTips: generatedPlan.resumeTips
      });
    }

    await actionPlan.save();

    res.json({
      message: 'Action plan generated successfully',
      actionPlan
    });
  } catch (error) {
    console.error('Create action plan error:', error);
    res.status(500).json({ error: 'Failed to generate action plan' });
  }
};

export const getActionPlan = async (req, res) => {
  try {
    const actionPlan = await ActionPlan.findOne({ userId: req.userId });
    
    if (!actionPlan) {
      return res.status(404).json({ error: 'Action plan not found. Please generate one first.' });
    }

    res.json({ actionPlan });
  } catch (error) {
    console.error('Get action plan error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { day, taskIndex, done } = req.body;

    const actionPlan = await ActionPlan.findOne({ userId: req.userId });
    
    if (!actionPlan) {
      return res.status(404).json({ error: 'Action plan not found' });
    }

    // Find the day and update task
    const dayPlan = actionPlan.plan.find(d => d.day === day);
    if (!dayPlan || !dayPlan.tasks[taskIndex]) {
      return res.status(404).json({ error: 'Task not found' });
    }

    dayPlan.tasks[taskIndex].done = done;
    actionPlan.calculateProgress();
    
    await actionPlan.save();

    res.json({
      message: 'Task updated successfully',
      progress: actionPlan.progress,
      actionPlan
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
