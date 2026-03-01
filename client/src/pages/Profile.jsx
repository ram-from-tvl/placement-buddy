import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Upload, FileText, CheckCircle, ChevronRight, AlertCircle, FilePlus, ChevronLeft } from 'lucide-react';

export default function Profile() {
  const { user, fetchUser } = useAuth();

  // Step 1: Mode Selection | Step 2: Upload/Parse | Step 3: Manual Entry / Validate
  const [step, setStep] = useState(1);
  const [entryMode, setEntryMode] = useState(null); // 'resume' or 'manual'

  const [formData, setFormData] = useState({
    year: '',
    branch: '',
    targetRole: '',
    skills: '',
    hoursPerWeek: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [atsFeedback, setAtsFeedback] = useState(null);
  const navigate = useNavigate();

  // Check if profile is complete
  const isProfileComplete = useCallback(() => {
    if (!user?.profile) return false;
    const { year, branch, targetRole, skills, hoursPerWeek } = user.profile;
    return year && branch && targetRole && skills?.length > 0 && hoursPerWeek;
  }, [user]);

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        year: user.profile.year || '',
        branch: user.profile.branch || '',
        targetRole: user.profile.targetRole || '',
        skills: user.profile.skills?.join(', ') || '',
        hoursPerWeek: user.profile.hoursPerWeek || ''
      });
      
      // If profile is already complete, go to edit mode
      if (isProfileComplete()) {
        setStep(3);
        setEntryMode('manual');
      }
    }
  }, [user, isProfileComplete]);

  const handleFileUpload = useCallback(async (e) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(uploadedFile.type)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    // Validate file size (5MB max)
    if (uploadedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setFile(uploadedFile);
    setLoading(true);
    setError('');
    setSuccess('');

    const formDataUpload = new FormData();
    formDataUpload.append('resume', uploadedFile);

    try {
      const response = await api.post('/profile/upload-resume', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const atsData = response.data.data;

      setAtsFeedback({
        score: atsData.atsScore || 0,
        issues: atsData.issues || [],
        tips: atsData.tips || []
      });

      // Pre-fill data from parsing
      setFormData(prev => ({
        year: atsData.year || prev.year,
        branch: atsData.branch || prev.branch,
        skills: Array.isArray(atsData.skills) ? atsData.skills.join(', ') : prev.skills,
        targetRole: atsData.targetRole || prev.targetRole,
        hoursPerWeek: prev.hoursPerWeek
      }));

      setSuccess('Resume parsed successfully!');
      setStep(3); // Move to review step
    } catch (err) {
      console.error("Resume parse error", err);
      setError(err.response?.data?.error || 'Failed to parse the resume. Please try again or enter details manually.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectMode = useCallback((mode) => {
    setEntryMode(mode);
    setStep(mode === 'resume' ? 2 : 3);
    setError('');
    setSuccess('');
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate form data
    if (!formData.year || !formData.branch || !formData.targetRole || !formData.skills || !formData.hoursPerWeek) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
      
      if (skillsArray.length === 0) {
        setError('Please enter at least one skill');
        setLoading(false);
        return;
      }

      const response = await api.post('/profile', {
        year: formData.year,
        branch: formData.branch,
        targetRole: formData.targetRole,
        skills: skillsArray,
        hoursPerWeek: parseInt(formData.hoursPerWeek)
      });
      
      setSuccess('Profile updated successfully! Redirecting to dashboard...');
      
      // Wait for user data to refresh completely
      const updatedUser = await fetchUser();
      
      if (updatedUser) {
        // Navigate after state is fully updated
        setTimeout(() => navigate('/'), 800);
      } else {
        // If fetch failed, still navigate but user will see updated data from response
        setTimeout(() => navigate('/'), 800);
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.error || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [formData, fetchUser, navigate]);

  const renderStepOne = () => (
    <div className="onboarding-step animation-fade-in">
      <h2>How would you like to build your profile?</h2>
      <p className="subtitle">Let's get your details to personalize your placement roadmap.</p>

      <div className="mode-cards">
        <div className="mode-card" onClick={() => handleSelectMode('resume')}>
          <div className="mode-icon"><Upload size={32} color="var(--primary)" /></div>
          <h3>Upload Resume</h3>
          <p>We'll extract your details and give you an ATS score & tips to improve.</p>
          <div className="recommended-badge">Recommended</div>
        </div>

        <div className="mode-card" onClick={() => handleSelectMode('manual')}>
          <div className="mode-icon"><FilePlus size={32} color="var(--text-muted)" /></div>
          <h3>Manual Entry</h3>
          <p>Fill out your details from scratch step by step.</p>
        </div>
      </div>
    </div>
  );

  const renderStepTwo = () => (
    <div className="onboarding-step animation-fade-in">
      <button className="btn-back" onClick={() => { setStep(1); setError(''); }}><ChevronLeft /> Back</button>
      <h2>Upload your Resume</h2>
      <p className="subtitle">Upload your PDF file to instantly populate your profile and get an ATS critique.</p>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="upload-zone">
        <input
          type="file"
          id="resume-upload"
          accept=".pdf"
          onChange={handleFileUpload}
          disabled={loading}
          style={{ display: 'none' }}
        />
        <label htmlFor="resume-upload" className={`upload-label ${loading ? 'disabled' : ''}`}>
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Parsing with Kai AI and checking ATS readability...</p>
              <p className="text-sm">This may take 10-15 seconds</p>
            </div>
          ) : (
            <>
              <FileText size={48} color="var(--primary)" />
              <h3>Click to browse or drag & drop</h3>
              <p>PDF up to 5MB</p>
              {file && <p className="text-sm">Selected: {file.name}</p>}
            </>
          )}
        </label>
      </div>
    </div>
  );

  const handleBackFromStep3 = useCallback(() => {
    setError('');
    setSuccess('');
    if (entryMode === 'resume') {
      setStep(2);
      setAtsFeedback(null);
    } else {
      setStep(1);
    }
  }, [entryMode]);

  const renderStepThree = () => (
    <div className="onboarding-step animation-fade-in">
      <div className="header-flex">
        <button className="btn-back" onClick={handleBackFromStep3}>
          <ChevronLeft /> Back
        </button>
        <h2>Review & Complete Profile</h2>
      </div>
      <p className="subtitle">
        {entryMode === 'resume'
          ? "We've parsed your resume. Please verify the details below."
          : "Fill in your details to get started."}
      </p>

      {atsFeedback && (
        <div className="ats-feedback-card">
          <div className="ats-header">
            <div>
              <h3>ATS Readability Check</h3>
              <p>Here's how automated parsers see your resume.</p>
            </div>
            <div className={`ats-score ${atsFeedback.score < 70 ? 'warning' : 'good'}`}>
              <span className="score-val">{atsFeedback.score}</span>/100
            </div>
          </div>

          <div className="ats-body">
            <div className="ats-column">
              <h4 className="flex-align"><AlertCircle size={16} /> Parser Issues Detected</h4>
              <ul>
                {atsFeedback.issues.map((i, idx) => <li key={idx}>{i}</li>)}
              </ul>
            </div>
            <div className="ats-column">
              <h4 className="flex-align"><CheckCircle size={16} /> Suggestions to Improve</h4>
              <ul>
                {atsFeedback.tips.map((i, idx) => <li key={idx}>{i}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      {success && <div className="success">{success}</div>}
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="profile-form mt-4">
        <div className="form-grid">
          <label>
            Year of Study
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              required
            >
              <option value="">Select Year</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
          </label>

          <label>
            Branch / Department
            <input
              type="text"
              placeholder="e.g., Computer Science"
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              required
            />
          </label>
        </div>

        <label>
          Target Placement Role
          <input
            type="text"
            placeholder="e.g., Software Development Engineer"
            value={formData.targetRole}
            onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
            required
          />
        </label>

        <label>
          Core Skills (comma-separated)
          <input
            type="text"
            placeholder="e.g., JavaScript, React, Node.js, Python, DSA"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            required
          />
        </label>

        <label>
          Hours Available Per Week for Prep
          <input
            type="number"
            placeholder="e.g., 20"
            value={formData.hoursPerWeek}
            onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
            required
            min="1"
            max="168"
          />
        </label>

        <button type="submit" className="btn-primary full-width" disabled={loading}>
          {loading ? 'Saving...' : (isProfileComplete() ? 'Update Profile' : 'Finalize Profile & Start Journey')}
        </button>
      </form>
    </div>
  );

  return (
    <div className="page onboarding-page">
      <nav className="navbar">
        <h1>🎯 Kai Placement Copilot</h1>
        <div className="step-indicator">
          <span className={step >= 1 ? 'active' : ''}>1</span>
          <span className="line"></span>
          <span className={step >= 2 ? 'active' : ''}>2</span>
          <span className="line"></span>
          <span className={step >= 3 ? 'active' : ''}>3</span>
        </div>
      </nav>

      <div className="container">
        <div className="onboarding-wrapper">
          {step === 1 && renderStepOne()}
          {step === 2 && renderStepTwo()}
          {step === 3 && renderStepThree()}
        </div>
      </div>
    </div>
  );
}
