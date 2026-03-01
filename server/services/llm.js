import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');
const pythonScript = path.join(projectRoot, 'llm_service.py');
const venvPython = path.join(projectRoot, 'venv/bin/python');

export const generateActionPlan = async (profile) => {
  try {
    console.log('🤖 Generating action plan with Groq LLM...');
    
    const profileData = JSON.stringify(profile);
    const command = `${venvPython} ${pythonScript} action_plan '${profileData}'`;
    
    const { stdout, stderr } = await execAsync(command, {
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });
    
    if (stderr && !stdout) {
      throw new Error(`Python script error: ${stderr}`);
    }
    
    const result = JSON.parse(stdout);
    console.log('✅ Action plan generated successfully');
    return result;
    
  } catch (error) {
    console.error('❌ LLM Service Error:', error.message);
    throw error;
  }
};

export const generateMockQuestions = async (role, year) => {
  try {
    console.log('🤖 Generating mock questions with Groq LLM...');
    
    const data = JSON.stringify({ role, year });
    const command = `${venvPython} ${pythonScript} mock_questions '${data}'`;
    
    const { stdout, stderr } = await execAsync(command, {
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });
    
    if (stderr && !stdout) {
      throw new Error(`Python script error: ${stderr}`);
    }
    
    const result = JSON.parse(stdout);
    console.log('✅ Mock questions generated successfully');
    return result;
    
  } catch (error) {
    console.error('❌ LLM Service Error:', error.message);
    throw error;
  }
};
