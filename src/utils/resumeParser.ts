import { ExtractedResumeData } from '../components/WelcomeSection';

// Dictionary of known technical skills with safe, contextual regex patterns
const KNOWN_TECH_SKILLS = [
  // Programming Languages (with strict boundary checks for short names)
  { name: 'Python', pattern: /\bpython\b/i },
  { name: 'SQL', pattern: /\bsql\b/i },
  { name: 'JavaScript', pattern: /\b(javascript|js)\b/i },
  { name: 'TypeScript', pattern: /\b(typescript|ts)\b/i },
  { name: 'Java', pattern: /\bjava\b/i },
  { name: 'C++', pattern: /\b(c\+\+|cpp)\b/i },
  { name: 'C#', pattern: /\b(c\#|c-sharp)\b/i },
  { name: 'C', pattern: /\b(c\s+language|c\s+programming|\bc\b(?=\s*[,;\/|]|\s+and|\s+or|\s+with|\s+skill))\b/i },
  { name: 'R', pattern: /\b(r\s+language|r\s+programming|\br\b(?=\s*[,;\/|]|\s+and|\s+or|\s+with|\s+skill))\b/i },
  { name: 'Go', pattern: /\b(golang|\bgo\b(?=\s*[,;\/|]|\s+language|\s+programming))\b/i },
  { name: 'Rust', pattern: /\brust\b/i },
  { name: 'Ruby', pattern: /\bruby\b/i },
  { name: 'PHP', pattern: /\bphp\b/i },
  { name: 'Swift', pattern: /\bswift\b/i },
  { name: 'Kotlin', pattern: /\bkotlin\b/i },
  { name: 'HTML', pattern: /\bhtml5?\b/i },
  { name: 'CSS', pattern: /\bcss3?\b/i },
  { name: 'Bash', pattern: /\b(bash|shell)\b/i },
  { name: 'MATLAB', pattern: /\bmatlab\b/i },
  { name: 'Scala', pattern: /\bscala\b/i },

  // Data Science, ML & AI
  { name: 'Pandas', pattern: /\bpandas\b/i },
  { name: 'NumPy', pattern: /\bnumpy\b/i },
  { name: 'Scikit-Learn', pattern: /\b(scikit-learn|sklearn)\b/i },
  { name: 'TensorFlow', pattern: /\btensorflow\b/i },
  { name: 'PyTorch', pattern: /\bpytorch\b/i },
  { name: 'Keras', pattern: /\bkeras\b/i },
  { name: 'OpenCV', pattern: /\bopencv\b/i },
  { name: 'Hugging Face', pattern: /\bhugging\s*face\b/i },
  { name: 'Transformers', pattern: /\btransformers\b/i },
  { name: 'NLTK', pattern: /\bnltk\b/i },
  { name: 'spaCy', pattern: /\bspacy\b/i },
  { name: 'Machine Learning', pattern: /\bmachine\s+learning\b/i },
  { name: 'Deep Learning', pattern: /\bdeep\s+learning\b/i },
  { name: 'Statistics & Probability', pattern: /\b(statistics|probability|stats)\b/i },
  { name: 'Exploratory Data Analysis (EDA)', pattern: /\b(exploratory\s+data\s+analysis|eda)\b/i },
  { name: 'Data Visualization', pattern: /\bdata\s+vis(ualization)?\b/i },
  { name: 'Data Cleaning', pattern: /\bdata\s+cleaning\b/i },
  { name: 'Feature Engineering', pattern: /\bfeature\s+engineering\b/i },
  { name: 'A/B Testing', pattern: /\b(a\/b\s+testing|ab\s+testing)\b/i },
  { name: 'Natural Language Processing (NLP)', pattern: /\b(nlp|natural\s+language\s+processing)\b/i },
  { name: 'Computer Vision', pattern: /\bcomputer\s+vision\b/i },
  { name: 'Large Language Models (LLMs)', pattern: /\b(llm|llms|large\s+language\s+models)\b/i },
  { name: 'Retrieval-Augmented Generation (RAG)', pattern: /\b(rag|retrieval\s*augmented\s*generation)\b/i },
  { name: 'Prompt Engineering', pattern: /\bprompt\s+engineering\b/i },
  { name: 'Vector Databases', pattern: /\bvector\s+(database|db|search|embeddings)\b/i },

  // Web & Frameworks
  { name: 'React', pattern: /\b(react|reactjs|react\.js)\b/i },
  { name: 'Node.js', pattern: /\b(node|nodejs|node\.js)\b/i },
  { name: 'Express', pattern: /\bexpress(\.js)?\b/i },
  { name: 'Next.js', pattern: /\bnext(\.js)?\b/i },
  { name: 'Vue', pattern: /\b(vue|vuejs)\b/i },
  { name: 'Angular', pattern: /\bangular\b/i },
  { name: 'FastAPI', pattern: /\bfastapi\b/i },
  { name: 'Flask', pattern: /\bflask\b/i },
  { name: 'Django', pattern: /\bdjango\b/i },
  { name: 'Spring Boot', pattern: /\bspring\s*boot\b/i },
  { name: 'Tailwind CSS', pattern: /\btailwind\b/i },
  { name: 'REST APIs', pattern: /\b(rest|restful|rest\s+api)\b/i },
  { name: 'GraphQL', pattern: /\bgraphql\b/i },

  // Cloud & DevOps & Tools
  { name: 'Apache Spark', pattern: /\b(spark|pyspark)\b/i },
  { name: 'Airflow', pattern: /\bairflow\b/i },
  { name: 'Snowflake', pattern: /\bsnowflake\b/i },
  { name: 'BigQuery', pattern: /\bbigquery\b/i },
  { name: 'ETL Pipelines', pattern: /\b(etl|data\s+pipeline)\b/i },
  { name: 'Docker', pattern: /\bdocker\b/i },
  { name: 'Kubernetes', pattern: /\b(kubernetes|k8s)\b/i },
  { name: 'AWS', pattern: /\b(aws|amazon\s+web\s+services)\b/i },
  { name: 'Azure', pattern: /\bazure\b/i },
  { name: 'GCP', pattern: /\b(gcp|google\s+cloud)\b/i },
  { name: 'Terraform', pattern: /\bterraform\b/i },
  { name: 'CI/CD', pattern: /\b(ci\/cd|continuous\s+integration)\b/i },
  { name: 'Linux', pattern: /\blinux\b/i },
  { name: 'MLOps', pattern: /\bmlops\b/i },
  { name: 'PostgreSQL', pattern: /\b(postgresql|postgres)\b/i },
  { name: 'MySQL', pattern: /\bmysql\b/i },
  { name: 'MongoDB', pattern: /\bmongodb\b/i },
  { name: 'Redis', pattern: /\bredis\b/i },
  { name: 'SQLite', pattern: /\bsqlite\b/i },
  { name: 'Excel & Pivot Tables', pattern: /\b(excel|pivot\s+tables)\b/i },
  { name: 'Tableau', pattern: /\btableau\b/i },
  { name: 'Power BI', pattern: /\bpower\s*bi\b/i },
  { name: 'Git & GitHub', pattern: /\b(git|github|gitlab)\b/i },
  { name: 'VS Code', pattern: /\b(vs\s*code|visual\s+studio\s+code)\b/i },
  { name: 'Jupyter', pattern: /\bjupyter\b/i },
];

/**
 * Converts a browser File object to base64 string.
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Helper to deduplicate array of skill strings case-insensitively.
 */
export function deduplicateSkills(skills: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const s of skills) {
    if (!s || typeof s !== 'string') continue;
    const trimmed = s.trim();
    // Ignore single letter garbage tokens unless explicitly valid
    if (trimmed.length < 2 && !['C', 'R'].includes(trimmed.toUpperCase())) continue;
    
    const key = trimmed.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(trimmed);
    }
  }

  return result;
}

/**
 * Extracts a clean surrounding snippet from rawText where match occurred.
 */
function extractEvidenceSnippet(rawText: string, matchIndex: number, matchLength: number): string {
  const start = Math.max(0, matchIndex - 30);
  const end = Math.min(rawText.length, matchIndex + matchLength + 40);
  let snippet = rawText.substring(start, end).replace(/\s+/g, ' ').trim();
  if (start > 0) snippet = '...' + snippet;
  if (end < rawText.length) snippet = snippet + '...';
  return snippet;
}

/**
 * STRICT CLIENT-SIDE FALLBACK PARSER
 * Extracts explicit skills only when text is available, enforcing zero duplicates and zero single-char noise.
 */
export function extractSkillsWithEvidenceClient(rawText: string): {
  skills: string[];
  evidenceMap: Record<string, string>;
} {
  if (!rawText || rawText.trim().length === 0) {
    return { skills: [], evidenceMap: {} };
  }

  const detectedMap = new Map<string, string>();

  // Scan dictionary
  for (const item of KNOWN_TECH_SKILLS) {
    const match = item.pattern.exec(rawText);
    if (match) {
      const snippet = extractEvidenceSnippet(rawText, match.index, match[0].length);
      detectedMap.set(item.name, snippet);
    }
  }

  // Scan Skills section
  const skillsSectionRegex = /(?:skills|technical\s+skills|technologies|tools|languages)\s*[:\-\n]([\s\S]*?)(?=\n\n|\n[A-Z][a-z]+:|\n[A-Z\s]{4,}|$)/i;
  const sectionMatch = rawText.match(skillsSectionRegex);

  if (sectionMatch && sectionMatch[1]) {
    const rawTokens = sectionMatch[1].split(/[,|\n•;\/]+/);
    for (let token of rawTokens) {
      token = token.replace(/^[*\-\s]+|[*\-\s]+$/g, '').trim();
      if (token.length >= 2 && token.length <= 35) {
        if (!/^(built|created|worked|developed|responsible|managed|experience|using|and|with|in|for|etc)$/i.test(token)) {
          const esc = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const tokenMatch = new RegExp(`\\b${esc}\\b`, 'i').exec(rawText);
          if (tokenMatch) {
            const snippet = extractEvidenceSnippet(rawText, tokenMatch.index, tokenMatch[0].length);
            const existingKey = Array.from(detectedMap.keys()).find(k => k.toLowerCase() === token.toLowerCase());
            if (!existingKey) {
              detectedMap.set(token, snippet);
            }
          }
        }
      }
    }
  }

  const skills = deduplicateSkills(Array.from(detectedMap.keys()));
  const evidenceMap: Record<string, string> = {};
  for (const s of skills) {
    const key = Array.from(detectedMap.keys()).find(k => k.toLowerCase() === s.toLowerCase());
    if (key) {
      evidenceMap[s] = detectedMap.get(key) || '';
    }
  }

  return { skills, evidenceMap };
}

/**
 * MAIN PARSER FUNCTION
 * Sends file base64 to server API /api/extract-resume-raw for Gemini PDF/DOCX processing.
 * Strictly extracts only what's explicitly in the uploaded resume.
 */
export async function parseResumeFile(file: File): Promise<ExtractedResumeData> {
  try {
    const fileData = await fileToBase64(file);

    const res = await fetch('/api/extract-resume-raw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileData,
        fileName: file.name,
        fileType: file.type,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;

        // Deduplicate and sanitize all extracted skills
        let rawSkills = [
          ...(d.detectedSkills || []),
          ...(d.programmingLanguages || []),
          ...(d.toolsAndTechnologies || [])
        ];
        let uniqueSkills = deduplicateSkills(rawSkills);
        let evidenceMap = d.skillEvidence || {};
        const rawText = d.rawResumeText || '';

        // If backend returned clean raw text but no structured skills, run client extraction on rawText
        if (uniqueSkills.length === 0 && rawText.trim().length > 30) {
          const clientExtract = extractSkillsWithEvidenceClient(rawText);
          uniqueSkills = clientExtract.skills;
          evidenceMap = clientExtract.evidenceMap;
        }

        const progLangs = deduplicateSkills(d.programmingLanguages?.length ? d.programmingLanguages : uniqueSkills.filter(s =>
          ['Python', 'SQL', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'C', 'R', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'HTML', 'CSS', 'Bash', 'MATLAB', 'Scala'].includes(s)
        ));
        const toolsTech = deduplicateSkills(d.toolsAndTechnologies?.length ? d.toolsAndTechnologies : uniqueSkills.filter(s => !progLangs.includes(s)));

        return {
          rawResumeText: rawText,
          detectedSkills: uniqueSkills,
          skillEvidence: evidenceMap,
          programmingLanguages: progLangs,
          toolsAndTechnologies: toolsTech,
          education: Array.isArray(d.education) ? d.education : [],
          projects: Array.isArray(d.projects) ? d.projects : [],
          certifications: Array.isArray(d.certifications) ? d.certifications : [],
          experience: Array.isArray(d.experience) ? d.experience : [],
          unreliableExtractMessage: d.unreadable ? 'Unable to reliably extract this section. Please re-upload the resume.' : undefined,
        };
      }
    }
  } catch (err) {
    console.warn('Backend resume extraction call failed:', err);
  }

  // Client-side fallback: Only attempt plain text parsing for non-binary files or plain text
  if (file.type?.startsWith('text/') || file.name?.endsWith('.txt') || file.name?.endsWith('.md')) {
    try {
      const rawText = await file.text();
      const cleanText = rawText.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
      const { skills, evidenceMap } = extractSkillsWithEvidenceClient(cleanText);

      const progLangs = skills.filter(s =>
        ['Python', 'SQL', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'C', 'R', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'HTML', 'CSS', 'Bash', 'MATLAB', 'Scala'].includes(s)
      );
      const toolsTech = skills.filter(s => !progLangs.includes(s));

      return {
        rawResumeText: cleanText,
        detectedSkills: skills,
        skillEvidence: evidenceMap,
        programmingLanguages: progLangs,
        toolsAndTechnologies: toolsTech,
        education: [],
        projects: [],
        certifications: [],
        experience: [],
        unreliableExtractMessage: skills.length === 0 ? 'Unable to extract technical skills from text file.' : undefined,
      };
    } catch (err) {
      console.error('Failed to parse file text client-side:', err);
    }
  }

  return {
    rawResumeText: '',
    detectedSkills: [],
    skillEvidence: {},
    programmingLanguages: [],
    toolsAndTechnologies: [],
    education: [],
    projects: [],
    certifications: [],
    experience: [],
    unreliableExtractMessage: 'Unable to extract text from file. Please paste your resume text directly.',
  };
}

/**
 * PARSE DIRECT RESUME TEXT INPUT
 */
export async function parseResumeText(resumeText: string): Promise<ExtractedResumeData> {
  if (!resumeText || resumeText.trim().length === 0) {
    return {
      rawResumeText: '',
      detectedSkills: [],
      skillEvidence: {},
      programmingLanguages: [],
      toolsAndTechnologies: [],
      education: [],
      projects: [],
      certifications: [],
      experience: [],
    };
  }

  try {
    const res = await fetch('/api/extract-resume-raw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        let uniqueSkills = deduplicateSkills([
          ...(d.detectedSkills || []),
          ...(d.programmingLanguages || []),
          ...(d.toolsAndTechnologies || [])
        ]);

        let evidenceMap = d.skillEvidence || {};
        const rawText = d.rawResumeText || resumeText;

        if (uniqueSkills.length === 0 && rawText.trim().length > 0) {
          const clientExtract = extractSkillsWithEvidenceClient(rawText);
          uniqueSkills = clientExtract.skills;
          evidenceMap = clientExtract.evidenceMap;
        }

        const progLangs = deduplicateSkills(d.programmingLanguages?.length ? d.programmingLanguages : uniqueSkills.filter(s =>
          ['Python', 'SQL', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'C', 'R', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'HTML', 'CSS', 'Bash', 'MATLAB', 'Scala'].includes(s)
        ));
        const toolsTech = deduplicateSkills(d.toolsAndTechnologies?.length ? d.toolsAndTechnologies : uniqueSkills.filter(s => !progLangs.includes(s)));

        return {
          rawResumeText: rawText,
          detectedSkills: uniqueSkills,
          skillEvidence: evidenceMap,
          programmingLanguages: progLangs,
          toolsAndTechnologies: toolsTech,
          education: Array.isArray(d.education) ? d.education : [],
          projects: Array.isArray(d.projects) ? d.projects : [],
          certifications: Array.isArray(d.certifications) ? d.certifications : [],
          experience: Array.isArray(d.experience) ? d.experience : [],
        };
      }
    }
  } catch (err) {
    console.warn('Text parsing API call failed:', err);
  }

  // Pure client extraction fallback
  const { skills, evidenceMap } = extractSkillsWithEvidenceClient(resumeText);
  const progLangs = skills.filter(s =>
    ['Python', 'SQL', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'C', 'R', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'HTML', 'CSS', 'Bash', 'MATLAB', 'Scala'].includes(s)
  );
  const toolsTech = skills.filter(s => !progLangs.includes(s));

  return {
    rawResumeText: resumeText,
    detectedSkills: skills,
    skillEvidence: evidenceMap,
    programmingLanguages: progLangs,
    toolsAndTechnologies: toolsTech,
    education: [],
    projects: [],
    certifications: [],
    experience: [],
  };
}
