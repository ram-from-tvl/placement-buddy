import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getSession, sendMessage } from '../controllers/careerCoachController.js';

const router = express.Router();

router.get('/session', authenticate, getSession);
router.post('/message', authenticate, sendMessage);

export default router;

