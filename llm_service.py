#!/usr/bin/env python3
"""
LLM Service using Groq API
Provides action plan and mock interview generation
"""

import os
import json
import sys
from groq import Groq

# Initialize Groq client
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "your_groq_api_key_here")
MODEL = "llama-3.3-70b-versatile"

client = Groq(api_key=GROQ_API_KEY)

def generate_action_plan(profile):
    """Generate a 7-day action plan for placement preparation"""
    
    prompt = f"""Generate a detailed 7-day placement preparation action plan for a student with the following profile:

Year: {profile['year']}
Branch: {profile['branch']}
Target Role: {profile['targetRole']}
Current Skills: {', '.join(profile['skills'])}
Available Time: {profile['hoursPerWeek']} hours per week

Please provide:
1. A day-by-day roadmap (7 days) with specific, actionable tasks
2. Each day should have 3-5 tasks
3. Include specific resource links (real URLs to tutorials, courses, documentation)
4. Make tasks realistic based on available time
5. Also provide 5 ATS-friendly resume tips specifically for {profile['targetRole']} role

Format the response as JSON with this structure:
{{
  "plan": [
    {{
      "day": 1,
      "title": "Day title",
      "tasks": [
        {{
          "task": "Specific task description",
          "resourceLink": "https://actual-url.com"
        }}
      ]
    }}
  ],
  "resumeTips": ["tip1", "tip2", "tip3", "tip4", "tip5"]
}}

Make it practical, specific, and tailored to their profile. Return ONLY the JSON, no other text."""

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model=MODEL,
            temperature=0.7,
            max_tokens=2000,
        )
        
        response_text = chat_completion.choices[0].message.content
        
        # Extract JSON from response
        # Try to find JSON in the response
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}') + 1
        
        if start_idx != -1 and end_idx > start_idx:
            json_str = response_text[start_idx:end_idx]
            return json.loads(json_str)
        else:
            raise ValueError("No JSON found in response")
            
    except Exception as e:
        print(f"Error generating action plan: {e}", file=sys.stderr)
        raise

def generate_mock_questions(role, year):
    """Generate mock interview questions"""
    
    prompt = f"""Generate 10 interview questions for a {year} year student applying for {role} role.

Mix technical and behavioral questions:
- 6 technical questions (specific to {role})
- 4 behavioral/situational questions

Make questions appropriate for a {year} year student's level.

Format as JSON:
{{
  "questions": [
    {{"question": "Question text here"}}
  ]
}}

Make questions realistic and commonly asked in actual interviews. Return ONLY the JSON, no other text."""

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model=MODEL,
            temperature=0.7,
            max_tokens=1000,
        )
        
        response_text = chat_completion.choices[0].message.content
        
        # Extract JSON from response
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}') + 1
        
        if start_idx != -1 and end_idx > start_idx:
            json_str = response_text[start_idx:end_idx]
            return json.loads(json_str)
        else:
            raise ValueError("No JSON found in response")
            
    except Exception as e:
        print(f"Error generating mock questions: {e}", file=sys.stderr)
        raise

def main():
    """Main function to handle CLI requests"""
    if len(sys.argv) < 2:
        print("Usage: python llm_service.py <action> <json_data>", file=sys.stderr)
        sys.exit(1)
    
    action = sys.argv[1]
    data = json.loads(sys.argv[2])
    
    try:
        if action == "action_plan":
            result = generate_action_plan(data)
        elif action == "mock_questions":
            result = generate_mock_questions(data['role'], data['year'])
        else:
            raise ValueError(f"Unknown action: {action}")
        
        print(json.dumps(result))
        
    except Exception as e:
        error_response = {"error": str(e)}
        print(json.dumps(error_response), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
