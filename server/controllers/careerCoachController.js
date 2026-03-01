import CareerCoachSession from '../models/CareerCoachSession.js';
import User from '../models/User.js';
import ActionPlan from '../models/ActionPlan.js';
import MockInterview from '../models/MockInterview.js';
import ReadinessCard from '../models/ReadinessCard.js';
import { generateCareerCoachReply } from '../services/llm.js';

const MAX_MESSAGES = 50;

const buildUserContext = async (userId) => {
  const user = await User.findById(userId);
  const actionPlan = await ActionPlan.findOne({ userId });
  const completedInterviews = await MockInterview.find({ userId, completedAt: { $ne: null } });
  const readinessCard = await ReadinessCard.findOne({ userId });

  const readinessScore = readinessCard?.score ?? user.readinessScore ?? 0;

  return {
    profile: user?.profile || {},
    readiness: {
      score: readinessScore,
      daysActive: user?.daysActive || 0,
    },
    actionPlanSummary: actionPlan
      ? {
          progress: actionPlan.progress || 0,
          totalDays: actionPlan.plan?.length || 0,
        }
      : null,
    mockInterviewSummary: {
      completedCount: completedInterviews.length,
    },
    basics: {
      name: user?.name,
      college: user?.college,
    },
  };
};

export const getSession = async (req, res) => {
  try {
    let session = await CareerCoachSession.findOne({ userId: req.userId });

    if (!session) {
      session = new CareerCoachSession({
        userId: req.userId,
        messages: [
          {
            role: 'assistant',
            content:
              "Hi! I'm your Career Coach. Tell me your current situation and I'll help you plan your next steps.",
          },
        ],
      });
      session.trimHistory(MAX_MESSAGES);
      await session.save();
    }

    const context = await buildUserContext(req.userId);

    res.json({
      session: {
        id: session._id,
        messages: session.messages,
        lastActiveAt: session.lastActiveAt,
      },
      context,
    });
  } catch (error) {
    console.error('Get career coach session error:', error);
    res.status(500).json({ error: 'Failed to load career coach session' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    let session = await CareerCoachSession.findOne({ userId: req.userId });

    if (!session) {
      session = new CareerCoachSession({
        userId: req.userId,
        messages: [],
      });
    }

    session.messages.push({ role: 'user', content: message });
    session.lastActiveAt = new Date();
    session.trimHistory(MAX_MESSAGES);

    const context = await buildUserContext(req.userId);
    const reply = await generateCareerCoachReply({
      context,
      messages: session.messages,
    });

    session.messages.push({ role: 'assistant', content: reply });
    session.lastActiveAt = new Date();
    session.trimHistory(MAX_MESSAGES);

    await session.save();

    res.json({
      session: {
        id: session._id,
        messages: session.messages,
        lastActiveAt: session.lastActiveAt,
      },
      context,
    });
  } catch (error) {
    console.error('Career coach sendMessage error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
};

