import express from 'express';
import { 
  generateReadinessCard, 
  getReadinessCard,
  getCardByShareLink,
  trackCardView,
  trackCardClick
} from '../controllers/readinessController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', authenticate, generateReadinessCard);
router.get('/', authenticate, getReadinessCard);
router.get('/share/:shareLink', getCardByShareLink);
router.post('/share/:shareLink/view', trackCardView);
router.post('/share/:shareLink/click', trackCardClick);

export default router;
