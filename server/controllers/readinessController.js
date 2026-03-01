import { nanoid } from 'nanoid';
import ReadinessCard from '../models/ReadinessCard.js';
import User from '../models/User.js';
import ActionPlan from '../models/ActionPlan.js';
import MockInterview from '../models/MockInterview.js';

const calculateReadinessScore = async (userId) => {
  const user = await User.findById(userId);
  const actionPlan = await ActionPlan.findOne({ userId });
  const mockInterviews = await MockInterview.find({ userId, completedAt: { $ne: null } });

  // Profile completeness (0-20)
  const profileComplete = user.getProfileCompleteness() * 0.2;

  // Action plan progress (0-40)
  const actionPlanProgress = actionPlan ? (actionPlan.progress * 0.4) : 0;

  // Mock interviews done (0-30)
  const mockInterviewsDone = Math.min(mockInterviews.length * 10, 30);

  // Days active (0-10)
  const daysActive = Math.min(user.daysActive * 2, 10);

  const totalScore = Math.round(profileComplete + actionPlanProgress + mockInterviewsDone + daysActive);

  return {
    score: totalScore,
    breakdown: {
      profileComplete: Math.round(profileComplete),
      actionPlanProgress: Math.round(actionPlanProgress),
      mockInterviewsDone,
      daysActive: Math.round(daysActive)
    }
  };
};

export const generateReadinessCard = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate readiness score
    const { score, breakdown } = await calculateReadinessScore(req.userId);

    // Update user's readiness score
    user.readinessScore = score;
    await user.save();

    // Check if card already exists
    let card = await ReadinessCard.findOne({ userId: req.userId });

    if (card) {
      // Update existing card
      card.score = score;
      card.breakdown = breakdown;
    } else {
      // Create new card
      const shareLink = nanoid(10);
      card = new ReadinessCard({
        userId: req.userId,
        score,
        shareLink,
        breakdown
      });
    }

    await card.save();

    // Populate user data
    await card.populate('userId', 'name college profile');

    res.json({
      message: 'Readiness card generated successfully',
      card
    });
  } catch (error) {
    console.error('Generate readiness card error:', error);
    res.status(500).json({ error: 'Failed to generate readiness card' });
  }
};

export const getReadinessCard = async (req, res) => {
  try {
    const card = await ReadinessCard.findOne({ userId: req.userId })
      .populate('userId', 'name college profile');

    if (!card) {
      return res.status(404).json({ error: 'Readiness card not found. Please generate one first.' });
    }

    res.json({ card });
  } catch (error) {
    console.error('Get readiness card error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCardByShareLink = async (req, res) => {
  try {
    const { shareLink } = req.params;
    const card = await ReadinessCard.findOne({ shareLink })
      .populate('userId', 'name college profile');

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    res.json({ card });
  } catch (error) {
    console.error('Get card by share link error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const trackCardView = async (req, res) => {
  try {
    const { shareLink } = req.params;
    const card = await ReadinessCard.findOne({ shareLink });

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    card.views += 1;
    await card.save();

    res.json({ message: 'View tracked', views: card.views });
  } catch (error) {
    console.error('Track view error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const trackCardClick = async (req, res) => {
  try {
    const { shareLink } = req.params;
    const card = await ReadinessCard.findOne({ shareLink });

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    card.clicks += 1;
    await card.save();

    res.json({ message: 'Click tracked', clicks: card.clicks });
  } catch (error) {
    console.error('Track click error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
