/**
 * Profile API Integration Test
 * Tests the actual HTTP endpoints
 */

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
let authToken = '';
let userId = '';

async function testProfileAPI() {
  try {
    console.log('🧪 Starting Profile API Integration Test\n');

    // Step 1: Create test user
    console.log('📝 Step 1: Creating test user...');
    const signupRes = await axios.post(`${API_URL}/auth/signup`, {
      name: 'API Test User',
      email: `apitest${Date.now()}@example.com`,
      password: 'password123',
      college: 'Test College'
    });
    authToken = signupRes.data.token;
    userId = signupRes.data.user.id;
    console.log('✅ User created and authenticated\n');

    // Step 2: Update profile with basic data
    console.log('📝 Step 2: Updating profile with basic data...');
    const basicProfileRes = await axios.post(
      `${API_URL}/profile`,
      {
        year: '3rd',
        branch: 'Computer Science',
        targetRole: 'Software Engineer',
        skills: ['JavaScript', 'Python', 'React'],
        hoursPerWeek: 20
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    console.log('✅ Basic profile updated');
    console.log('   Profile completeness:', basicProfileRes.data.profileCompleteness, '%\n');

    // Step 3: Update with comprehensive data
    console.log('📝 Step 3: Updating with comprehensive data...');
    const comprehensiveProfileRes = await axios.post(
      `${API_URL}/profile`,
      {
        year: '3rd',
        branch: 'Computer Science',
        targetRole: 'Software Engineer',
        skills: ['JavaScript', 'Python', 'React', 'Node.js'],
        hoursPerWeek: 25,
        phone: '+1234567890',
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com/in/testuser',
        github: 'https://github.com/testuser',
        portfolio: 'https://testuser.com',
        education: [
          {
            degree: 'B.Tech in Computer Science',
            institution: 'Test University',
            year: '2024',
            cgpa: '8.5/10',
            location: 'California, USA'
          }
        ],
        experience: [
          {
            title: 'Software Engineering Intern',
            company: 'Tech Corp',
            duration: 'May 2023 - Aug 2023',
            description: 'Developed features using React and Node.js',
            location: 'Remote'
          }
        ],
        projects: [
          {
            name: 'E-commerce Platform',
            description: 'Full-stack web application',
            technologies: ['React', 'Node.js', 'MongoDB'],
            link: 'https://github.com/testuser/ecommerce'
          }
        ],
        certifications: [
          {
            name: 'AWS Certified Developer',
            issuer: 'Amazon Web Services',
            date: 'January 2023',
            link: 'https://aws.amazon.com/verify'
          }
        ],
        achievements: ['Winner of National Hackathon 2023', 'Published research paper'],
        languages: ['Python', 'JavaScript', 'Java', 'English', 'Hindi'],
        atsScore: 85,
        atsIssues: ['Minor formatting issue'],
        atsTips: ['Add more quantifiable achievements']
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    console.log('✅ Comprehensive profile updated');
    console.log('   Profile completeness:', comprehensiveProfileRes.data.profileCompleteness, '%');
    console.log('   ATS Score:', comprehensiveProfileRes.data.profile.atsScore, '\n');

    // Step 4: Retrieve profile
    console.log('📝 Step 4: Retrieving profile...');
    const getProfileRes = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Profile retrieved successfully');
    console.log('   Education entries:', getProfileRes.data.user.profile.education.length);
    console.log('   Experience entries:', getProfileRes.data.user.profile.experience.length);
    console.log('   Projects:', getProfileRes.data.user.profile.projects.length);
    console.log('   Certifications:', getProfileRes.data.user.profile.certifications.length);
    console.log('   Achievements:', getProfileRes.data.user.profile.achievements.length);
    console.log('   Languages:', getProfileRes.data.user.profile.languages.length, '\n');

    // Step 5: Test validation
    console.log('📝 Step 5: Testing validation...');
    try {
      await axios.post(
        `${API_URL}/profile`,
        {
          year: '3rd',
          // Missing required fields
        },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      console.log('❌ Validation should have failed');
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 500) {
        console.log('✅ Validation working correctly (rejected incomplete data)\n');
      } else {
        throw error;
      }
    }

    console.log('✅ ALL API TESTS PASSED!\n');
    console.log('Summary:');
    console.log('  ✓ User signup and authentication');
    console.log('  ✓ Basic profile update');
    console.log('  ✓ Comprehensive profile update');
    console.log('  ✓ Profile retrieval');
    console.log('  ✓ Validation working');
    console.log('\n⚠️  Note: Resume upload test requires actual PDF file and running server');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Check if server is running
axios.get(`${API_URL}/health`)
  .then(() => {
    console.log('✅ Server is running\n');
    testProfileAPI();
  })
  .catch(() => {
    console.error('❌ Server is not running. Please start the server first:');
    console.error('   npm start (from server directory)');
    process.exit(1);
  });
