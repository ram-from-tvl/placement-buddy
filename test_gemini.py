#!/usr/bin/env python3
import os
from google import genai

# Set API key
os.environ['GEMINI_API_KEY'] = os.environ.get('GEMINI_API_KEY', 'your_gemini_api_key_here')

print("Testing Gemini API with correct model...")

client = genai.Client(api_key=os.environ['GEMINI_API_KEY'])

# Test with gemini-3-flash-preview (the model user mentioned)
print("\n1. Testing gemini-3-flash-preview...")
try:
    response = client.models.generate_content(
        model='gemini-3-flash-preview',
        contents='Say "Hello, Kai Placement Copilot is working!" in one sentence.'
    )
    print(f"✅ Success with gemini-3-flash-preview!")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"❌ Error: {e}")

# Test with gemini-2.0-flash
print("\n2. Testing gemini-2.0-flash...")
try:
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents='Say "Hello, Kai Placement Copilot is working!" in one sentence.'
    )
    print(f"✅ Success with gemini-2.0-flash!")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"❌ Error: {e}")

# Test with gemini-flash-latest
print("\n3. Testing gemini-flash-latest...")
try:
    response = client.models.generate_content(
        model='gemini-flash-latest',
        contents='Say "Hello, Kai Placement Copilot is working!" in one sentence.'
    )
    print(f"✅ Success with gemini-flash-latest!")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"❌ Error: {e}")
