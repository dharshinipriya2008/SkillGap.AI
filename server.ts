import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
// Safe dynamic imports for document parsers to avoid top-level ESM/CJS load crashes
async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  try {
    // @ts-ignore
    const pdfParseModule: any = await import('pdf-parse');
    const pdfParse = pdfParseModule.default || pdfParseModule;
    const pdfData = await pdfParse(buffer);
    return pdfData?.text?.trim() || '';
  } catch (err) {
    console.warn('pdf-parse text extraction error:', err);
    return '';
  }
}

async function parseDocxBuffer(buffer: Buffer): Promise<string> {
  try {
    // @ts-ignore
    const mammothModule: any = await import('mammoth');
    const mammoth = mammothModule.default || mammothModule;
    const result = await mammoth.extractRawText({ buffer });
    return result?.value?.trim() || '';
  } catch (err) {
    console.warn('mammoth text extraction error:', err);
    return '';
  }
}

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function extractPlainTextFromFile(fileData?: string, fileName?: string, fileType?: string, resumeText?: string): Promise<string> {
  if (resumeText && resumeText.trim().length > 0) {
    return resumeText.trim();
  }
  if (!fileData) return '';

  const base64Clean = fileData.includes('base64,') ? fileData.split('base64,')[1] : fileData;
  const buffer = Buffer.from(base64Clean, 'base64');
  const lowerName = (fileName || '').toLowerCase();
  const lowerType = (fileType || '').toLowerCase();

  // PDF
  if (lowerName.endsWith('.pdf') || lowerType.includes('pdf')) {
    const pdfText = await parsePdfBuffer(buffer);
    if (pdfText) return pdfText;
  }

  // DOCX / DOC
  if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc') || lowerType.includes('word') || lowerType.includes('officedocument')) {
    const docxText = await parseDocxBuffer(buffer);
    if (docxText) return docxText;
  }

  // Plain Text / Markdown
  try {
    const rawText = buffer.toString('utf-8');
    const cleanText = rawText.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
    if (cleanText.length > 0) {
      return cleanText;
    }
  } catch (err) {
    console.warn('UTF-8 text conversion failed:', err);
  }

  return '';
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini API client lazily or safely on server
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing. Please set GEMINI_API_KEY in your environment variables.');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // Helper to generate content with fallback models for standard Gemini API keys
  const generateGeminiContent = async (ai: GoogleGenAI, params: { contents: any; config?: any; preferredModel?: string }) => {
    const candidateModels = Array.from(new Set([
      params.preferredModel || 'gemini-2.5-flash',
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-3.6-flash',
    ]));

    let lastError: any = null;
    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: params.contents,
          config: params.config,
        });
        return response;
      } catch (err: any) {
        console.warn(`Gemini API call failed for model '${modelName}': ${err?.message || err}. Trying next fallback model...`);
        lastError = err;
      }
    }
    throw lastError || new Error('All Gemini model generation attempts failed.');
  };

  // API Health Check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Dedicated API for strict resume extraction with zero target-role inferencing
  app.post('/api/extract-resume-raw', async (req, res) => {
    try {
      const { fileData, fileType, fileName, resumeText } = req.body;

      // Extract clean plain text first using pdf-parse or mammoth
      const extractedPlainText = await extractPlainTextFromFile(fileData, fileName, fileType, resumeText);

      const promptText = `You are a strict, precise AI resume parser.
Extract content ONLY from the provided resume text/file.

STRICT RULES:
1. Extract exact technical skills, programming languages, frameworks, and tools explicitly mentioned in the resume.
2. Remove duplicate occurrences of the same skill.
3. Preserve the exact skill names as written in the resume.
4. Do NOT split skill names into separate letters or list garbage single letters like "C R Go C R Go" unless "C" or "R" or "Go" is explicitly written as a standalone skill in a skills list.
5. Do NOT infer or add any missing skills, degrees, projects, certifications, or experience not explicitly written in the resume.
6. Do NOT add skills based on any job description or target role.
7. If the resume file text cannot be read reliably, set "unreadable": true.

Return JSON matching this exact structure:
{
  "unreadable": false,
  "rawResumeText": "Full clean text of resume",
  "detectedSkills": ["Exact Skill 1", "Exact Skill 2"],
  "programmingLanguages": ["Exact Language 1"],
  "toolsAndTechnologies": ["Exact Tool 1"],
  "education": [{"degree": "Degree name", "institution": "University/School", "year": "Dates"}],
  "projects": [{"title": "Project title", "description": "Details"}],
  "certifications": [{"name": "Cert name", "issuer": "Issuer"}],
  "experience": [{"role": "Role title", "company": "Company", "duration": "Dates", "description": "Details"}],
  "skillEvidence": { "Exact Skill 1": "Quote from resume where skill appears" }
}`;

      const parts: any[] = [];

      if (extractedPlainText) {
        parts.push({ text: `Resume Text Content:\n${extractedPlainText}` });
      }

      if (fileData) {
        const base64Clean = fileData.includes('base64,') ? fileData.split('base64,')[1] : fileData;
        const isPdf = fileName?.toLowerCase().endsWith('.pdf') || fileType?.toLowerCase().includes('pdf');
        if (isPdf) {
          parts.push({
            inlineData: {
              mimeType: 'application/pdf',
              data: base64Clean,
            },
          });
        }
      }

      if (parts.length === 0) {
        return res.status(400).json({ error: 'Either valid fileData or resumeText must be provided.' });
      }

      parts.push({ text: promptText });

      try {
        const ai = getGeminiClient();
        const response = await generateGeminiContent(ai, {
          preferredModel: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts,
            },
          ],
          config: {
            responseMimeType: 'application/json',
            temperature: 0.1,
          },
        });

        const responseText = response.text || '{}';
        const parsedData = JSON.parse(responseText);

        if (!parsedData.rawResumeText && extractedPlainText) {
          parsedData.rawResumeText = extractedPlainText;
        }

        return res.json({ success: true, data: parsedData });
      } catch (geminiError: any) {
        console.warn('Gemini extraction failed, returning plain text fallback extraction:', geminiError?.message || geminiError);
        
        if (extractedPlainText) {
          return res.json({
            success: true,
            data: {
              unreadable: false,
              rawResumeText: extractedPlainText,
              detectedSkills: [],
              programmingLanguages: [],
              toolsAndTechnologies: [],
              education: [],
              projects: [],
              certifications: [],
              experience: [],
            },
          });
        }
        throw geminiError;
      }
    } catch (error: any) {
      console.error('Error in /api/extract-resume-raw:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to extract resume using Gemini AI.',
      });
    }
  });

  // AI Resume Extraction & Skill Gap Analysis API
  app.post('/api/parse-and-analyze-resume', async (req, res) => {
    try {
      const { targetRole, fileData, fileType, fileName, resumeText } = req.body;

      if (!targetRole) {
        return res.status(400).json({ error: 'targetRole is required.' });
      }

      const promptText = `You are "SkillGap AI", an expert AI resume parser and technical career advisor.
Analyze ONLY the provided uploaded resume for the target job position: "${targetRole}".
Do NOT generate or hallucinate fake credentials or skills not supported by the resume content.

Tasks:
1. Extract all structured profile details:
   - "candidateName": Exact candidate name from resume, or "Not detected" if missing.
   - "detectedSkills": Array of all technical skills explicitly found in the resume.
   - "programmingLanguages": Array of programming languages explicitly found in resume.
   - "toolsAndTechnologies": Array of tools, frameworks, and technologies explicitly found in resume.
   - "education": Array of objects [{"degree": "Degree name", "institution": "University/School", "year": "Graduation year or dates"}].
   - "projects": Array of objects [{"title": "Project title", "description": "Key details", "technologies": ["Tech1", "Tech2"]}].
   - "certifications": Array of objects or strings [{"name": "Certification name", "issuer": "Issuer"}].
   - "experience": Array of objects [{"role": "Job/Internship Title", "company": "Company Name", "duration": "Dates", "description": "Key achievements"}].

2. Analyze ONLY the extracted resume against "${targetRole}" requirements:
   - "requiredSkills": Array of 8-12 standard industry required skills specifically for "${targetRole}".
   - "strongSkills": Array of skills from candidate's resume that strongly meet "${targetRole}" expectations.
   - "skillsToImprove": Array of skills from candidate's resume that need further depth or improvement for "${targetRole}".
   - "missingSkills": Array of key skills for "${targetRole}" that are COMPLETELY MISSING from candidate's resume.
   - "skillMatchPct": Integer (0-100) calculated matching percentage between resume and "${targetRole}".
   - "jobReadinessScore": Integer (0-100) readiness score for "${targetRole}".
   - "skillComparisonTable": Array of 6 to 10 skills evaluated against "${targetRole}" requirements:
     [
       {
         "skill": "Skill name",
         "category": "Category name",
         "requiredLevel": "Basic" | "Intermediate" | "Advanced",
         "currentLevel": "None" | "Beginner" | "Basic" | "Intermediate" | "Advanced",
         "requiredPct": 85,
         "currentPct": 60,
         "status": "Strong" | "Improve" | "Missing"
       }
     ]
   - "recommendations": Array of 3 specific actionable recommendations.

Respond STRICTLY in valid JSON matching this schema.`;

      const ai = getGeminiClient();
      const parts: any[] = [];

      // If base64 file data provided
      if (fileData) {
        const base64Clean = fileData.includes('base64,') ? fileData.split('base64,')[1] : fileData;
        const mimeType = fileType || (fileName?.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'text/plain');
        parts.push({
          inlineData: {
            mimeType,
            data: base64Clean,
          },
        });
      } else if (resumeText) {
        parts.push({ text: `Resume Content:\n${resumeText}` });
      } else {
        return res.status(400).json({ error: 'Either fileData or resumeText must be provided.' });
      }

      parts.push({ text: promptText });

      const response = await generateGeminiContent(ai, {
        preferredModel: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts,
          },
        ],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = response.text || '{}';
      const parsedData = JSON.parse(responseText);

      return res.json({ success: true, data: parsedData });
    } catch (error: any) {
      console.error('Error in /api/parse-and-analyze-resume:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to parse and analyze resume using Gemini AI.',
      });
    }
  });

  // AI Skill Gap Analysis API
  app.post('/api/analyze-skills', async (req, res) => {
    try {
      const { targetRole, userSkills, resumeText } = req.body;

      if (!targetRole) {
        return res.status(400).json({ error: 'targetRole is required.' });
      }

      const prompt = `You are "SkillGap AI", an elite career advisor & AI skill gap analyzer for tech students and fresh grads.
Analyze the following student profile for the target job role: "${targetRole}".

User Provided Skills / Summary: ${userSkills || 'Not provided'}
User Resume / Bio Snippet: ${resumeText || 'Student targeting entry-level positions.'}

Perform a rigorous analysis and respond STRICTLY in JSON format matching this schema:
{
  "readinessScore": number (0-100),
  "summary": "2-3 encouraging sentences highlighting readiness and key gaps.",
  "matchedSkills": ["skill1", "skill2", ...],
  "missingSkills": [
    {"name": "skill name", "importance": "High" | "Critical" | "Medium", "description": "Why it matters"}
  ],
  "skillsToImprove": [
    {"name": "skill name", "currentLevel": "Intermediate", "targetLevel": "Advanced"}
  ],
  "customRoadmap": [
    {"step": 1, "topic": "Name", "status": "Mastered" | "In Progress" | "Up Next", "estimatedWeeks": number, "keyTopics": ["A", "B"]}
  ],
  "recommendedProjects": [
    {
      "title": "Project Title",
      "difficulty": "Beginner" | "Intermediate" | "Advanced",
      "estimatedHours": number,
      "description": "Brief description of project to bridge specific gaps",
      "tags": ["Tag1", "Tag2"]
    }
  ],
  "interviewTip": "A targeted technical interview advice item."
}`;

      const ai = getGeminiClient();
      const response = await generateGeminiContent(ai, {
        preferredModel: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const responseText = response.text || '{}';
      const parsedData = JSON.parse(responseText);

      return res.json({ success: true, data: parsedData });
    } catch (error: any) {
      console.error('Error in /api/analyze-skills:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to analyze skills using Gemini AI.',
      });
    }
  });

  // Setup Vite or Static File Serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
