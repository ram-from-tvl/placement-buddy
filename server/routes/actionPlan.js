import express from 'express';
import { createActionPlan, getActionPlan, updateTaskStatus } from '../controllers/actionPlanController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', authenticate, createActionPlan);
router.get('/', authenticate, getActionPlan);
router.patch('/task', authenticate, updateTaskStatus);

export default router;
