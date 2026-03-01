#!/usr/bin/env python3
import os
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY", "your_groq_api_key_here"))

print("Testing Groq API...")
print("\nAvailable models:")

# Try different model names
models_to_try = [
    "llama-3.3-70b-versatile",
    "llama-3.1-70b-versatile",
    "mixtral-8x7b-32768",
    "gemma2-9b-it",
]

for model in models_to_try:
    try:
        print(f"\nTrying {model}...")
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": "Say hello"}],
            model=model,
            max_tokens=50,
        )
        print(f"✅ {model} works!")
        print(f"Response: {chat_completion.choices[0].message.content}")
        break
    except Exception as e:
        print(f"❌ {model} failed: {e}")
