import User from '../models/User.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');
const pythonScript = path.join(projectRoot, 'ats_service.py');
const venvPython = path.join(projectRoot, 'venv/bin/python');

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

    // Return updated user data with profile completeness
    const profileCompleteness = user.getProfileCompleteness();

    res.json({
      message: 'Profile updated successfully',
      profile: user.profile,
      profileCompleteness,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        profile: user.profile,
        readinessScore: user.readinessScore,
        daysActive: user.daysActive
      }
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

    const filePath = req.file.path;
    
    // Validate file type
    if (!req.file.originalname.toLowerCase().endsWith('.pdf')) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Only PDF files are supported.' });
    }

    console.log('📄 Processing resume:', req.file.originalname);
    console.log('📍 File path:', filePath);

    try {
      // Call Python ATS service
      const command = `${venvPython} ${pythonScript} "${filePath}"`;
      console.log('🐍 Executing:', command);
      
      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
        env: {
          ...process.env,
          GROQ_API_KEY: process.env.GROQ_API_KEY
        }
      });

      // Clean up temp file
      fs.unlinkSync(filePath);

      if (stderr) {
        console.log('Python stderr:', stderr);
      }

      if (!stdout || stdout.trim().length === 0) {
        throw new Error('No output from Python ATS service');
      }

      const atsResult = JSON.parse(stdout);
      
      if (atsResult.error) {
        throw new Error(atsResult.error);
      }

      console.log('✅ ATS Analysis complete:', atsResult);

      return res.json({
        success: true,
        data: atsResult
      });

    } catch (error) {
      // Clean up temp file on error
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw error;
    }

  } catch (error) {
    console.error('❌ Resume upload/parsing error:', error);
    
    // Clean up temp file if it still exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: error.message || 'Internal server error processing the resume' 
    });
  }
};
