#!/usr/bin/env python3
"""
ATS Resume Parser Service
Handles PDF parsing and ATS scoring using industry-standard Python libraries
"""

import os
import sys
import json
import re
from groq import Groq
import PyPDF2
from io import BytesIO

# Initialize Groq client
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
if not GROQ_API_KEY:
    print(json.dumps({"error": "GROQ_API_KEY environment variable not set"}), file=sys.stderr)
    sys.exit(1)

MODEL = "llama-3.3-70b-versatile"

client = Groq(api_key=GROQ_API_KEY)

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF file using PyPDF2"""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            
            # Extract text from all pages
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text() + "\n"
            
            return text.strip()
    except Exception as e:
        raise Exception(f"Failed to extract text from PDF: {str(e)}")

def analyze_resume_with_ats(resume_text):
    """
    Analyze resume text using Groq LLM for ATS scoring
    Returns structured data with score, issues, tips, and extracted profile info
    """
    
    prompt = f"""You are an expert ATS (Applicant Tracking System) analyzer and tech recruiter. 
Analyze the following resume text and provide a comprehensive ATS evaluation.

Resume Text:
'''
{resume_text[:6000]}
'''

Your task:
1. Extract the candidate's academic year (1st, 2nd, 3rd, 4th year). If graduated or unclear, estimate based on experience.
2. Extract their branch/department (e.g., Computer Science, Electrical Engineering, Mechanical).
3. Extract ALL technical skills mentioned (programming languages, frameworks, tools, technologies).
4. Identify their target role based on experience, projects, or objective (e.g., Software Engineer, Data Analyst, Frontend Developer).
5. Calculate an ATS readability score (0-100) based on:
   - Proper formatting and structure
   - Use of standard section headers
   - Keyword optimization
   - Quantifiable achievements
   - Clear contact information
   - Proper date formats
   - No complex tables or graphics that ATS can't parse
6. Identify 2-4 specific issues that would cause ATS parsing problems
7. Provide 3-5 actionable tips to improve ATS score

Return ONLY valid JSON in this exact format:
{{
  "year": "3rd",
  "branch": "Computer Science",
  "skills": ["Python", "JavaScript", "React", "Node.js", "MongoDB", "AWS"],
  "targetRole": "Full Stack Developer",
  "atsScore": 75,
  "issues": [
    "Missing clear graduation date format",
    "Using tables for work experience (ATS can't parse)",
    "No keywords matching job descriptions"
  ],
  "tips": [
    "Use standard section headers: Education, Experience, Skills, Projects",
    "Add quantifiable achievements (e.g., 'Improved performance by 40%')",
    "Include relevant keywords from target job descriptions",
    "Use simple formatting without tables or columns"
  ]
}}

Be specific and practical. Return ONLY the JSON, no other text."""

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model=MODEL,
            temperature=0.3,
            max_tokens=2000,
        )
        
        response_text = chat_completion.choices[0].message.content
        
        # Extract JSON from response
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}') + 1
        
        if start_idx != -1 and end_idx > start_idx:
            json_str = response_text[start_idx:end_idx]
            result = json.loads(json_str)
            
            # Validate and set defaults
            result['year'] = result.get('year', '3rd')
            result['branch'] = result.get('branch', 'Computer Science')
            result['skills'] = result.get('skills', [])
            result['targetRole'] = result.get('targetRole', 'Software Engineer')
            result['atsScore'] = int(result.get('atsScore', 50))
            result['issues'] = result.get('issues', [])
            result['tips'] = result.get('tips', [])
            
            return result
        else:
            raise ValueError("No valid JSON found in LLM response")
            
    except Exception as e:
        print(f"Error in ATS analysis: {e}", file=sys.stderr)
        # Return default structure on error
        return {
            "year": "3rd",
            "branch": "Computer Science",
            "skills": ["Python", "JavaScript"],
            "targetRole": "Software Engineer",
            "atsScore": 50,
            "issues": ["Could not fully parse resume"],
            "tips": ["Use standard resume format", "Include clear section headers"]
        }

def process_resume(pdf_path):
    """
    Main function to process resume PDF
    Returns complete ATS analysis
    """
    try:
        # Step 1: Extract text from PDF
        print(f"📄 Extracting text from PDF: {pdf_path}", file=sys.stderr)
        resume_text = extract_text_from_pdf(pdf_path)
        
        if not resume_text or len(resume_text.strip()) < 50:
            raise Exception("Could not extract sufficient text from PDF. It might be image-based or corrupted.")
        
        print(f"✅ Extracted {len(resume_text)} characters", file=sys.stderr)
        
        # Step 2: Analyze with ATS
        print("🤖 Analyzing resume with Groq LLM...", file=sys.stderr)
        ats_result = analyze_resume_with_ats(resume_text)
        
        print(f"✅ ATS Score: {ats_result['atsScore']}/100", file=sys.stderr)
        
        return ats_result
        
    except Exception as e:
        print(f"❌ Error processing resume: {str(e)}", file=sys.stderr)
        raise

def main():
    """Main CLI handler"""
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python ats_service.py <pdf_path>"}))
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    
    if not os.path.exists(pdf_path):
        print(json.dumps({"error": f"File not found: {pdf_path}"}))
        sys.exit(1)
    
    try:
        result = process_resume(pdf_path)
        print(json.dumps(result))
        sys.exit(0)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
