import express from 'express';
import multer from 'multer';
import { updateProfile, getProfile, uploadResume } from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary storage for PDF parsing

router.post('/', authenticate, updateProfile);
router.post('/upload-resume', authenticate, upload.single('resume'), uploadResume);
router.get('/', authenticate, getProfile);
router.get('/:userId', getProfile);

export default router;
