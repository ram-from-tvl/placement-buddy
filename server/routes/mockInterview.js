import express from 'express';
import { 
  createMockInterview, 
  getMockInterviews, 
  getMockInterview,
  answerQuestion 
} from '../controllers/mockInterviewController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', authenticate, createMockInterview);
router.get('/', authenticate, getMockInterviews);
router.get('/:id', authenticate, getMockInterview);
router.patch('/:id/answer', authenticate, answerQuestion);

export default router;
