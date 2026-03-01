import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Update days active
    const today = new Date().setHours(0, 0, 0, 0);
    const lastActive = new Date(user.lastActiveDate).setHours(0, 0, 0, 0);
    
    if (today > lastActive) {
      user.daysActive += 1;
      user.lastActiveDate = new Date();
      await user.save();
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', expired: true });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};
