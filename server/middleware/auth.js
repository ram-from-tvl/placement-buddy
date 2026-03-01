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

    // Update days active (atomic operation to prevent race conditions)
    const today = new Date().setHours(0, 0, 0, 0);
    const lastActive = new Date(user.lastActiveDate).setHours(0, 0, 0, 0);
    
    if (today > lastActive) {
      // Use atomic update to prevent race condition
      await User.updateOne(
        { 
          _id: user._id, 
          lastActiveDate: { $lt: new Date(today) } 
        },
        { 
          $inc: { daysActive: 1 }, 
          $set: { lastActiveDate: new Date() } 
        }
      );
      // Update local user object
      user.daysActive += 1;
      user.lastActiveDate = new Date();
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
