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

def generate_career_coach_reply(payload):
    """Generate a career coach reply given context and recent messages"""

    context = payload.get("context", {})
    messages = payload.get("messages", [])

    profile = context.get("profile", {})
    readiness = context.get("readiness", {})
    action_plan = context.get("actionPlanSummary")
    mock_summary = context.get("mockInterviewSummary", {})
    basics = context.get("basics", {})

    # Build a concise description of the user's level
    level_summary = f"""
User: {basics.get('name') or 'Student'} from {basics.get('college') or 'college not specified'}
Year: {profile.get('year') or 'not set'}
Branch: {profile.get('branch') or 'not set'}
Target role: {profile.get('targetRole') or 'not set'}
Skills: {', '.join(profile.get('skills', [])) or 'not specified'}
Hours per week for prep: {profile.get('hoursPerWeek') or 'not set'}

Readiness score: {readiness.get('score', 0)}/100
Days active: {readiness.get('daysActive', 0)}
Action plan: {('present with ' + str(action_plan.get('totalDays', 0)) + ' days, progress ' + str(action_plan.get('progress', 0)) + '%') if action_plan else 'not generated yet'}
Completed mock interviews: {mock_summary.get('completedCount', 0)}
"""

    # Turn message history into a simple dialogue for the model
    history_lines = []
    for m in messages[-20:]:
        role = m.get("role")
        content = m.get("content", "")
        if role == "user":
          history_lines.append(f"Student: {content}")
        elif role == "assistant":
          history_lines.append(f"Coach: {content}")

    history_text = "\n".join(history_lines) or "No previous conversation. Start by greeting the student and asking about their goals."

    prompt = f"""
You are an empathetic, concise career coach for college students preparing for placements.
Always:
- Tailor your advice to the student's level and constraints.
- Focus on 2–4 concrete next steps, not generic theory.
- Use simple language and short paragraphs or bullet points.

Student profile and level:
{level_summary}

Recent conversation:
{history_text}

Now, based on this, write your next message as the coach.
Keep it focused, encouraging, and specific to this student.
Return ONLY a JSON object with this structure and nothing else:
{{
  "reply": "your message here"
}}
"""

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
            max_tokens=800,
        )

        response_text = chat_completion.choices[0].message.content

        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}') + 1

        if start_idx != -1 and end_idx > start_idx:
            json_str = response_text[start_idx:end_idx]
            return json.loads(json_str)
        else:
            raise ValueError("No JSON found in response")

    except Exception as e:
        print(f"Error generating career coach reply: {e}", file=sys.stderr)
        raise


def main():
    """Main function to handle CLI requests"""
    if len(sys.argv) < 2:
        print("Usage: python llm_service.py <action> <json_data>", file=sys.stderr)
        sys.exit(1)

    action = sys.argv[1]

    # Join all remaining arguments to be robust to shell splitting,
    # then strip optional surrounding quotes before JSON parsing.
    raw_data = " ".join(sys.argv[2:]).strip()
    if raw_data and raw_data[0] == raw_data[-1] and raw_data[0] in ("'", '"'):
        raw_data = raw_data[1:-1]

    try:
        data = json.loads(raw_data) if raw_data else {}
    except Exception as e:
        print(
            json.dumps(
                {
                    "error": f"Failed to parse JSON args: {e}",
                    "raw": raw_data,
                }
            ),
            file=sys.stderr,
        )
        sys.exit(1)

    try:
        if action == "action_plan":
            result = generate_action_plan(data)
        elif action == "mock_questions":
            result = generate_mock_questions(data["role"], data["year"])
        elif action == "career_coach":
            result = generate_career_coach_reply(data)
        else:
            raise ValueError(f"Unknown action: {action}")

        print(json.dumps(result))

    except Exception as e:
        error_response = {"error": str(e)}
        print(json.dumps(error_response), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
