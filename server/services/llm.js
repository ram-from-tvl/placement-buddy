import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");
const pythonScript = path.join(projectRoot, "llm_service.py");

const venvDir = path.join(projectRoot, "venv");
const unixPython = path.join(venvDir, "bin", "python");
const windowsPython = path.join(venvDir, "Scripts", "python.exe");

let venvPython;

if (fs.existsSync(windowsPython)) {
  venvPython = windowsPython;
} else if (fs.existsSync(unixPython)) {
  venvPython = unixPython;
} else {
  // Critical: Don't fallback to system Python - it won't have required packages
  throw new Error(
    'Python virtual environment not found. Please run:\n' +
    '  python3 -m venv venv\n' +
    '  source venv/bin/activate  # On Windows: venv\\Scripts\\activate\n' +
    '  pip install groq PyPDF2'
  );
}

const encodePayload = (payload) =>
  Buffer.from(JSON.stringify(payload), "utf8").toString("base64");

export const generateActionPlan = async (profile) => {
  try {
    console.log("🤖 Generating action plan with Groq LLM...");

    const encoded = encodePayload(profile);
    const command = `${venvPython} ${pythonScript} action_plan ${encoded}`;

    const { stdout, stderr } = await execAsync(command, {
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      env: { ...process.env },
    });

    if (stderr && !stdout) {
      throw new Error(`Python script error: ${stderr}`);
    }

    const result = JSON.parse(stdout);
    console.log("✅ Action plan generated successfully");
    return result;
  } catch (error) {
    console.error("❌ LLM Service Error:", error.message);
    throw error;
  }
};

export const generateMockQuestions = async (role, year) => {
  try {
    console.log("🤖 Generating mock questions with Groq LLM...");

    const encoded = encodePayload({ role, year });
    const command = `${venvPython} ${pythonScript} mock_questions ${encoded}`;

    const { stdout, stderr } = await execAsync(command, {
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      env: { ...process.env },
    });

    if (stderr && !stdout) {
      throw new Error(`Python script error: ${stderr}`);
    }

    const result = JSON.parse(stdout);
    console.log("✅ Mock questions generated successfully");
    return result;
  } catch (error) {
    console.error("❌ LLM Service Error:", error.message);
    throw error;
  }
};

export const parseResume = async (resumeText) => {
  try {
    console.log("🤖 Parsing resume with Groq LLM...");

    const encoded = encodePayload({ resume_text: resumeText });
    const command = `${venvPython} ${pythonScript} parse_resume ${encoded}`;

    const { stdout, stderr } = await execAsync(command, {
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      env: { ...process.env },
    });

    if (stderr && !stdout) {
      throw new Error(`Python script error: ${stderr}`);
    }

    const result = JSON.parse(stdout);
    console.log("✅ Resume parsed successfully");
    return result;
  } catch (error) {
    console.error("❌ LLM parsing error:", error.message);
    throw error;
  }
};

export const generateCareerCoachReply = async ({ context, messages }) => {
  try {
    console.log("🤖 Generating career coach reply with Groq LLM...");

    const encoded = encodePayload({ context, messages });
    const command = `${venvPython} ${pythonScript} career_coach ${encoded}`;

    const { stdout, stderr } = await execAsync(command, {
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      env: { ...process.env },
    });

    if (stderr && !stdout) {
      throw new Error(`Python script error: ${stderr}`);
    }

    const result = JSON.parse(stdout);

    if (!result || typeof result.reply !== "string") {
      throw new Error("Invalid career coach response format");
    }

    console.log("✅ Career coach reply generated successfully");
    return result.reply;
  } catch (error) {
    console.error("❌ Career coach LLM Error:", error.message);
    throw error;
  }
};
