// API Test Script for Kai Placement Copilot
// Run this after whitelisting your IP in MongoDB Atlas

const API_BASE = 'http://localhost:5000/api';
let authToken = '';
let userId = '';
let shareLink = '';

// Helper function for API calls
async function apiCall(method, endpoint, data = null, useAuth = false) {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (useAuth && authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const options = {
    method,
    headers
  };

  if (data && (method === 'POST' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const result = await response.json();
    
    if (!response.ok) {
      console.error(`❌ ${method} ${endpoint} - Status: ${response.status}`);
      console.error('Error:', result);
      return null;
    }
    
    console.log(`✅ ${method} ${endpoint} - Status: ${response.status}`);
    return result;
  } catch (error) {
    console.error(`❌ ${method} ${endpoint} - Error:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log('🧪 Starting API Tests...\n');

  // Test 1: Health Check
  console.log('📍 Test 1: Health Check');
  const health = await fetch('http://localhost:5000/health');
  const healthData = await health.json();
  console.log('Response:', healthData);
  console.log('');

  // Test 2: Signup
  console.log('📍 Test 2: User Signup');
  const signupData = {
    name: 'Test Student',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    college: 'IIT Delhi'
  };
  const signup = await apiCall('POST', '/auth/signup', signupData);
  if (signup) {
    authToken = signup.token;
    userId = signup.user.id;
    console.log('Token:', authToken.substring(0, 20) + '...');
    console.log('User ID:', userId);
  }
  console.log('');

  // Test 3: Login
  console.log('📍 Test 3: User Login');
  const loginData = {
    email: signupData.email,
    password: signupData.password
  };
  const login = await apiCall('POST', '/auth/login', loginData);
  console.log('');

  // Test 4: Get Me
  console.log('📍 Test 4: Get Current User');
  const me = await apiCall('GET', '/auth/me', null, true);
  console.log('');

  // Test 5: Update Profile
  console.log('📍 Test 5: Update Profile');
  const profileData = {
    year: '3rd',
    branch: 'Computer Science',
    targetRole: 'Software Development Engineer',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python'],
    hoursPerWeek: 20
  };
  const profile = await apiCall('POST', '/profile', profileData, true);
  console.log('');

  // Test 6: Get Profile
  console.log('📍 Test 6: Get Profile');
  const getProfile = await apiCall('GET', '/profile', null, true);
  console.log('');

  // Test 7: Generate Action Plan
  console.log('📍 Test 7: Generate Action Plan (using Gemini AI)');
  console.log('⏳ This may take 10-15 seconds...');
  const actionPlan = await apiCall('POST', '/action-plan/generate', null, true);
  if (actionPlan) {
    console.log('Plan Days:', actionPlan.actionPlan.plan.length);
    console.log('Resume Tips:', actionPlan.actionPlan.resumeTips.length);
  }
  console.log('');

  // Test 8: Get Action Plan
  console.log('📍 Test 8: Get Action Plan');
  const getActionPlan = await apiCall('GET', '/action-plan', null, true);
  console.log('');

  // Test 9: Update Task Status
  console.log('📍 Test 9: Mark Task as Done');
  const taskUpdate = await apiCall('PATCH', '/action-plan/task', {
    day: 1,
    taskIndex: 0,
    done: true
  }, true);
  if (taskUpdate) {
    console.log('Progress:', taskUpdate.progress + '%');
  }
  console.log('');

  // Test 10: Generate Mock Interview
  console.log('📍 Test 10: Generate Mock Interview (using Gemini AI)');
  console.log('⏳ This may take 10-15 seconds...');
  const mockInterview = await apiCall('POST', '/mock-interview/generate', {
    role: 'Software Development Engineer'
  }, true);
  if (mockInterview) {
    console.log('Questions:', mockInterview.mockInterview.questions.length);
  }
  console.log('');

  // Test 11: Get Mock Interviews
  console.log('📍 Test 11: Get All Mock Interviews');
  const getMockInterviews = await apiCall('GET', '/mock-interview', null, true);
  console.log('');

  // Test 12: Answer Question
  if (mockInterview) {
    console.log('📍 Test 12: Answer Mock Interview Question');
    const answer = await apiCall('PATCH', `/mock-interview/${mockInterview.mockInterview._id}/answer`, {
      questionIndex: 0,
      answer: 'This is my test answer to the interview question.'
    }, true);
    if (answer) {
      console.log('Score:', answer.score + '%');
    }
    console.log('');
  }

  // Test 13: Generate Readiness Card
  console.log('📍 Test 13: Generate Readiness Card');
  const readinessCard = await apiCall('POST', '/readiness-card/generate', null, true);
  if (readinessCard) {
    shareLink = readinessCard.card.shareLink;
    console.log('Readiness Score:', readinessCard.card.score);
    console.log('Share Link:', shareLink);
    console.log('Breakdown:', readinessCard.card.breakdown);
  }
  console.log('');

  // Test 14: Get Readiness Card
  console.log('📍 Test 14: Get My Readiness Card');
  const getCard = await apiCall('GET', '/readiness-card', null, true);
  console.log('');

  // Test 15: Get Card by Share Link (Public)
  if (shareLink) {
    console.log('📍 Test 15: Get Card by Share Link (Public)');
    const publicCard = await apiCall('GET', `/readiness-card/share/${shareLink}`);
    console.log('');

    // Test 16: Track View
    console.log('📍 Test 16: Track Card View');
    const trackView = await apiCall('POST', `/readiness-card/share/${shareLink}/view`);
    console.log('');

    // Test 17: Track Click
    console.log('📍 Test 17: Track Card Click');
    const trackClick = await apiCall('POST', `/readiness-card/share/${shareLink}/click`);
    console.log('');
  }

  // Test 18: Get Leaderboard
  console.log('📍 Test 18: Get Leaderboard');
  const leaderboard = await apiCall('GET', '/leaderboard');
  if (leaderboard) {
    console.log('Total Users:', leaderboard.pagination.total);
    console.log('Top 3:', leaderboard.leaderboard.slice(0, 3).map(u => ({
      rank: u.rank,
      name: u.name,
      score: u.readinessScore
    })));
  }
  console.log('');

  // Test 19: Get Colleges
  console.log('📍 Test 19: Get All Colleges');
  const colleges = await apiCall('GET', '/leaderboard/colleges');
  if (colleges) {
    console.log('Colleges:', colleges.colleges.slice(0, 5));
  }
  console.log('');

  // Test 20: Get My Rank
  console.log('📍 Test 20: Get My Rank');
  const myRank = await apiCall('GET', '/leaderboard/my-rank', null, true);
  if (myRank) {
    console.log('Overall Rank:', myRank.overallRank);
    console.log('College Rank:', myRank.collegeRank);
  }
  console.log('');

  console.log('✅ All tests completed!');
  console.log('\n📊 Summary:');
  console.log(`   User ID: ${userId}`);
  console.log(`   Share Link: ${shareLink}`);
  console.log(`   Share URL: http://localhost:5173/card/${shareLink}`);
}

// Run tests
runTests().catch(console.error);
