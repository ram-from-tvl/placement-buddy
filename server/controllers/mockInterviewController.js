import MockInterview from "../models/MockInterview.js";
import User from "../models/User.js";
import { generateMockQuestions } from "../services/llm.js";


// CREATE MOCK INTERVIEW
export const createMockInterview = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const targetRole = role || user.profile.targetRole;
    const year = user.profile.year;

    if (!targetRole || !year) {
      return res
        .status(400)
        .json({ error: "Profile incomplete. Please set target role and year." });
    }

    // Generate questions using AI
    const generated = await generateMockQuestions(targetRole, year);

    const mockInterview = new MockInterview({
      userId: req.userId,
      role: targetRole,
      questions: generated.questions.map((q) => ({
        question: q.question,
        answer: null,
        answered: false,
        correct: null
      }))
    });

    await mockInterview.save();

    res.json({
      message: "Mock interview created successfully",
      mockInterview
    });
  } catch (error) {
    console.error("Create mock interview error:", error);
    res.status(500).json({ error: "Failed to generate mock interview" });
  }
};



// GET ALL INTERVIEWS
export const getMockInterviews = async (req, res) => {
  try {
    const mockInterviews = await MockInterview.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json({ mockInterviews });
  } catch (error) {
    console.error("Get mock interviews error:", error);
    res.status(500).json({ error: "Server error" });
  }
};



// GET SINGLE INTERVIEW
export const getMockInterview = async (req, res) => {
  try {
    const mockInterview = await MockInterview.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!mockInterview) {
      return res.status(404).json({ error: "Mock interview not found" });
    }

    res.json({ mockInterview });
  } catch (error) {
    console.error("Get mock interview error:", error);
    res.status(500).json({ error: "Server error" });
  }
};



// SAVE ANSWER
export const answerQuestion = async (req, res) => {
  try {
    const { questionIndex, answer } = req.body;

    const mockInterview = await MockInterview.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!mockInterview) {
      return res.status(404).json({ error: "Mock interview not found" });
    }

    if (!mockInterview.questions[questionIndex]) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Save answer
    mockInterview.questions[questionIndex].answer = answer;
    mockInterview.questions[questionIndex].answered = true;

    // Basic correctness logic (placeholder)
    // Future: AI evaluation
    const isCorrect = answer && answer.length > 20;

    mockInterview.questions[questionIndex].correct = isCorrect;

    // Calculate score
    mockInterview.calculateScore();

    // Generate suggestions when completed
    if (mockInterview.completed && mockInterview.suggestions.length === 0) {

      const suggestions = [];

      if (mockInterview.score < 40) {
        suggestions.push("Focus on core fundamentals.");
        suggestions.push("Practice more mock interviews.");
      }

      if (mockInterview.score >= 40 && mockInterview.score < 70) {
        suggestions.push("Improve explanation clarity.");
        suggestions.push("Practice coding and system design questions.");
      }

      if (mockInterview.score >= 70) {
        suggestions.push("Great job! Continue practicing advanced questions.");
      }

      mockInterview.suggestions = suggestions;
    }

    await mockInterview.save();

    res.json({
      message: "Answer saved successfully",
      score: mockInterview.score,
      mockInterview
    });

  } catch (error) {
    console.error("Answer question error:", error);
    res.status(500).json({ error: "Server error" });
  }
};



// GET HISTORY (COMPLETED INTERVIEWS ONLY)
export const getInterviewHistory = async (req, res) => {
  try {

    const history = await MockInterview.find({
      userId: req.userId,
      completed: true
    })
      .sort({ completedAt: -1 });

    res.json({ history });

  } catch (error) {
    console.error("History fetch error:", error);
    res.status(500).json({ error: "Server error" });
  }
};