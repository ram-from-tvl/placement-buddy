import express from 'express';
import { getLeaderboard, getColleges, getMyRank } from '../controllers/leaderboardController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getLeaderboard);
router.get('/colleges', getColleges);
router.get('/my-rank', authenticate, getMyRank);

export default router;
