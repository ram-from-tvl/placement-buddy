import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log('Testing Gemini API with Node.js...');
console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT FOUND');

const ai = new GoogleGenAI({ apiKey: API_KEY });

async function testGemini() {
  try {
    console.log('\nSending test prompt with gemini-3-flash-preview...');
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: 'Say "Hello, Kai Placement Copilot is working!" in one sentence.'
    });
    
    console.log('✅ Success!');
    console.log('Response:', response.text);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response);
    }
  }
}

testGemini();
