import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import { writeFile, unlink } from 'fs/promises';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

const pythonScript = path.join(projectRoot, 'llm_service.py');

// ⭐ Cross-platform python path
const venvPython = process.platform === "win32"
  ? path.join(projectRoot, "venv", "Scripts", "python.exe")
  : path.join(projectRoot, "venv", "bin", "python");

export const generateActionPlan = async (profile) => {
  let tempFile = null;
  try {

    console.log('🤖 Generating action plan with Groq LLM...');

    const profileData = JSON.stringify(profile);
    
    // Write JSON to temp file to avoid shell escaping issues on Windows
    tempFile = path.join(projectRoot, `.temp_${Date.now()}_profile.json`);
    await writeFile(tempFile, profileData);

    const command = `${venvPython} ${pythonScript} action_plan ${tempFile}`;

    const { stdout, stderr } = await execAsync(command, {
      maxBuffer: 10 * 1024 * 1024
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
  } finally {
    // Clean up temp file
    if (tempFile) {
      try {
        await unlink(tempFile);
      } catch (e) {
        // ignore cleanup errors
      }
    }
  }
};

export const generateMockQuestions = async (role, year) => {
  // if the GROQ API key is missing, we cannot call the Python service
  // instead return a set of static questions so that the frontend
  // continues to work and the user doesn't see an error alert.
  if (!process.env.GROQ_API_KEY) {
    console.warn('GROQ_API_KEY not set - using fallback mock questions');
    return {
      questions: [
        { question: `What interests you about the ${role} position?` },
        { question: `Describe a challenging project you worked on in ${year} year.` },
        { question: `How do you stay current with industry trends?` },
        { question: `Tell me about a time you had to work in a team.` },
        { question: `What programming languages are you most comfortable with?` },
        { question: `Explain a technical concept to a non-technical person.` },
        { question: `Have you ever faced an ethical dilemma? How did you handle it?` },
        { question: `How do you prioritize tasks under a tight deadline?` },
        { question: `What are your long-term career goals?` },
        { question: `Why should we hire you for the ${role} role?` }
      ]
    };
  }

  let tempFile = null;
  try {

    console.log('🤖 Generating mock questions with Groq LLM...');

    const data = JSON.stringify({ role, year });
    
    // Write JSON to temp file to avoid shell escaping issues on Windows
    tempFile = path.join(projectRoot, `.temp_${Date.now()}_questions.json`);
    await writeFile(tempFile, data);

    const command = `${venvPython} ${pythonScript} mock_questions ${tempFile}`;

    const { stdout, stderr } = await execAsync(command, {
      maxBuffer: 10 * 1024 * 1024
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
  } finally {
    // Clean up temp file
    if (tempFile) {
      try {
        await unlink(tempFile);
      } catch (e) {
        // ignore cleanup errors
      }
    }
  }
};

export const parseResume = async (resumeText) => {
  let tempFile = null;
  try {

    console.log('🤖 Parsing resume with Groq LLM...');

    const data = JSON.stringify({ resume_text: resumeText });
    
    // Write JSON to temp file to avoid shell escaping issues on Windows
    tempFile = path.join(projectRoot, `.temp_${Date.now()}_resume.json`);
    await writeFile(tempFile, data);

    const command = `${venvPython} ${pythonScript} parse_resume ${tempFile}`;

    const { stdout, stderr } = await execAsync(command, {
      maxBuffer: 10 * 1024 * 1024
    });

    if (stderr && !stdout) {
      throw new Error(`Python script error: ${stderr}`);
    }

    const result = JSON.parse(stdout);

    console.log('✅ Resume parsed successfully');

    return result;

  } catch (error) {

    console.error('❌ LLM parsing error:', error.message);

    throw error;
  } finally {
    // Clean up temp file
    if (tempFile) {
      try {
        await unlink(tempFile);
      } catch (e) {
        // ignore cleanup errors
      }
    }
  }
};
