// Use direct HTTP requests to Gemini API
// Note: API key is loaded at runtime from process.env
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

async function callGeminiAPI(model, prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  
  const url = `${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini API Error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

export const generateActionPlan = async (profile) => {
  try {
    console.log('🤖 Generating action plan with Gemini...');
    
    const prompt = `Generate a detailed 7-day placement preparation action plan for a student with the following profile:

Year: ${profile.year}
Branch: ${profile.branch}
Target Role: ${profile.targetRole}
Current Skills: ${profile.skills.join(', ')}
Available Time: ${profile.hoursPerWeek} hours per week

Please provide:
1. A day-by-day roadmap (7 days) with specific, actionable tasks
2. Each day should have 3-5 tasks
3. Include specific resource links (real URLs to tutorials, courses, documentation)
4. Make tasks realistic based on available time
5. Also provide 5 ATS-friendly resume tips specifically for ${profile.targetRole} role

Format the response as JSON with this structure:
{
  "plan": [
    {
      "day": 1,
      "title": "Day title",
      "tasks": [
        {
          "task": "Specific task description",
          "resourceLink": "https://actual-url.com"
        }
      ]
    }
  ],
  "resumeTips": ["tip1", "tip2", "tip3", "tip4", "tip5"]
}

Make it practical, specific, and tailored to their profile.`;

    const text = await callGeminiAPI('gemini-3-flash-preview', prompt);
    console.log('✅ Gemini response received');
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log('✅ Action plan parsed successfully');
      return parsed;
    }
    
    throw new Error('Failed to parse action plan from response');
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    throw error;
  }
};

export const generateMockQuestions = async (role, year) => {
  try {
    console.log('🤖 Generating mock questions with Gemini...');
    
    const prompt = `Generate 10 interview questions for a ${year} year student applying for ${role} role.

Mix technical and behavioral questions:
- 6 technical questions (specific to ${role})
- 4 behavioral/situational questions

Make questions appropriate for a ${year} year student's level.

Format as JSON:
{
  "questions": [
    {"question": "Question text here"}
  ]
}

Make questions realistic and commonly asked in actual interviews.`;

    const text = await callGeminiAPI('gemini-3-flash-preview', prompt);
    console.log('✅ Gemini response received');
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log('✅ Mock questions parsed successfully');
      return parsed;
    }
    
    throw new Error('Failed to parse questions from response');
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    throw error;
  }
};
