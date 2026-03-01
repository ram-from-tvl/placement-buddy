import User from '../models/User.js';
import fs from 'fs';
import pdf from 'pdf-parse';
import { parseResume } from '../services/llm.js';
export const updateProfile = async (req, res) => {
  try {
    const { year, branch, targetRole, skills, hoursPerWeek } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update profile
    user.profile = {
      year: year || user.profile.year,
      branch: branch || user.profile.branch,
      targetRole: targetRole || user.profile.targetRole,
      skills: skills || user.profile.skills,
      hoursPerWeek: hoursPerWeek || user.profile.hoursPerWeek
    };

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      profile: user.profile,
      profileCompleteness: user.getProfileCompleteness()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        profile: user.profile,
        readinessScore: user.readinessScore,
        daysActive: user.daysActive
      },
      profileCompleteness: user.getProfileCompleteness()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded.' });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdf(dataBuffer);

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    if (!pdfData.text || pdfData.text.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from the PDF file. It might be an image-based PDF or corrupted.' });
    }

    // Call Groq LLM to parse text
    const atsResult = await parseResume(pdfData.text);

    return res.json({
      success: true,
      data: atsResult
    });

  } catch (error) {
    console.error('Resume upload/parsing error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Internal server error processing the resume' });
  }
};
