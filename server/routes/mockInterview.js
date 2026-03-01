import express from "express";
import {
  createMockInterview,
  getMockInterviews,
  getMockInterview,
  answerQuestion,
  getInterviewHistory
} from "../controllers/mockInterviewController.js";

import { authenticate } from "../middleware/auth.js";

const router = express.Router();


// CREATE NEW MOCK INTERVIEW
router.post("/generate", authenticate, createMockInterview);


// GET INTERVIEW HISTORY (COMPLETED INTERVIEWS)
router.get("/history", authenticate, getInterviewHistory);


// GET ALL INTERVIEWS
router.get("/", authenticate, getMockInterviews);


// GET SINGLE INTERVIEW
router.get("/:id", authenticate, getMockInterview);


// SAVE ANSWER
router.patch("/:id/answer", authenticate, answerQuestion);


export default router;