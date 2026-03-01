import { useState, useEffect } from 'react';
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

  // Dummy ATS feedback state
  const [atsFeedback, setAtsFeedback] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.profile && user.profile.year) {
      setFormData({
        year: user.profile.year || '',
        branch: user.profile.branch || '',
        targetRole: user.profile.targetRole || '',
        skills: user.profile.skills?.join(', ') || '',
        hoursPerWeek: user.profile.hoursPerWeek || ''
      });
      // If profile is already complete, maybe jump to final step or prepopulate
      if (user.getProfileCompleteness && user.getProfileCompleteness() >= 100) {
        setStep(3);
        setEntryMode('manual');
      }
    }
  }, [user]);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      // Simulate fake parsing/ATS check
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setAtsFeedback({
          score: 64,
          issues: [
            "Missing clear graduation year format",
            "Target role is ambiguous based on projects",
            "Incompatible PDF formatting for some ATS parsers"
          ],
          tips: [
            "Use standard section headers (Education, Experience, Skills)",
            "Ensure standard fonts instead of complex formatting",
            "Include your target job title under your name"
          ]
        });
        // Fake pre-fill some data from "parsing"
        setFormData(prev => ({
          ...prev,
          branch: 'Computer Science',
          skills: 'JavaScript, React, Python, SQL',
          targetRole: 'Software Engineer'
        }));
        setStep(3); // Move to review step
      }, 2500);
    }
  };

  const handleSelectMode = (mode) => {
    setEntryMode(mode);
    setStep(mode === 'resume' ? 2 : 3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/profile', {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      });
      setSuccess('Profile updated successfully! Welcome aboard.');
      await fetchUser();
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

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
      <button className="btn-back" onClick={() => setStep(1)}><ChevronLeft /> Back</button>
      <h2>Upload your Resume</h2>
      <p className="subtitle">Upload your PDF or DOCX file to instantly populate your profile and get an ATS critique.</p>

      <div className="upload-zone">
        <input
          type="file"
          id="resume-upload"
          accept=".pdf,.doc,.docx"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <label htmlFor="resume-upload" className="upload-label">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Parsing with Kai AI and checking ATS readability...</p>
            </div>
          ) : (
            <>
              <FileText size={48} color="var(--primary)" />
              <h3>Click to browse or drag & drop</h3>
              <p>PDF, DOCX up to 5MB</p>
            </>
          )}
        </label>
      </div>
    </div>
  );

  const renderStepThree = () => (
    <div className="onboarding-step animation-fade-in">
      <div className="header-flex">
        <button className="btn-back" onClick={() => {
          if (entryMode === 'resume') { setStep(2); setAtsFeedback(null); }
          else setStep(1);
        }}><ChevronLeft /> Back</button>
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
          {loading ? 'Saving...' : 'Finalize Profile & Start Journey'}
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
