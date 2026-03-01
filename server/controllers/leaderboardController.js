import User from '../models/User.js';
import ReadinessCard from '../models/ReadinessCard.js';

export const getLeaderboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 100, 100); // Max 100
    const college = req.query.college;
    const skip = (page - 1) * limit;

    let query = { readinessScore: { $gt: 0 } };
    if (college) {
      // Escape special regex characters
      const escapedCollege = college.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.college = new RegExp(escapedCollege, 'i');
    }

    const users = await User.find(query)
      .select('name college profile.targetRole readinessScore daysActive')
      .sort({ readinessScore: -1, daysActive: -1 })
      .limit(limit)
      .skip(skip);

    const total = await User.countDocuments(query);

    // Get cards for these users
    const userIds = users.map(u => u._id);
    const cards = await ReadinessCard.find({ userId: { $in: userIds } });
    const cardMap = {};
    cards.forEach(card => {
      cardMap[card.userId.toString()] = card;
    });

    const leaderboard = users.map((user, index) => ({
      rank: skip + index + 1,
      name: user.name,
      college: user.college,
      targetRole: user.profile.targetRole,
      readinessScore: user.readinessScore,
      daysActive: user.daysActive,
      hasCard: !!cardMap[user._id.toString()],
      shareLink: cardMap[user._id.toString()]?.shareLink
    }));

    res.json({
      leaderboard,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getColleges = async (req, res) => {
  try {
    const colleges = await User.distinct('college');
    res.json({ colleges: colleges.sort() });
  } catch (error) {
    console.error('Get colleges error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMyRank = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get overall rank
    const overallRank = await User.countDocuments({
      readinessScore: { $gt: user.readinessScore }
    }) + 1;

    // Get college rank
    const collegeRank = await User.countDocuments({
      college: user.college,
      readinessScore: { $gt: user.readinessScore }
    }) + 1;

    res.json({
      overallRank,
      collegeRank,
      readinessScore: user.readinessScore
    });
  } catch (error) {
    console.error('Get my rank error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
