import express from 'express';
import { updateProfile, getProfile } from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, updateProfile);
router.get('/', authenticate, getProfile);
router.get('/:userId', getProfile);

export default router;
