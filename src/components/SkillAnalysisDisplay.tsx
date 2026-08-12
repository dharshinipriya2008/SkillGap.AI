import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  TrendingUp, 
  Award, 
  Target, 
  ListChecks, 
  Plus, 
  ArrowUpRight,
  BrainCircuit,
  Lightbulb
} from 'lucide-react';
import { ExtractedResumeData } from './WelcomeSection';

interface SkillAnalysisDisplayProps {
  targetRoleName: string;
  extractedData: ExtractedResumeData;
  onAddSkillToRoadmap?: (skillName: string) => void;
}

// Fallback required skills benchmark for target roles
const TARGET_ROLE_BENCHMARKS: Record<string, string[]> = {
  'Data Scientist': [
    'Python', 'SQL', 'Statistics & Probability', 'Pandas & NumPy', 
    'Machine Learning', 'Data Visualization', 'Exploratory Data Analysis (EDA)', 
    'Scikit-Learn', 'Feature Engineering'
  ],
  'Data Analyst': [
    'SQL', 'Excel & Pivot Tables', 'Tableau', 'Power BI', 
    'Python', 'Data Cleaning', 'ETL Pipelines', 'A/B Testing'
  ],
  'AI Engineer': [
    'Python', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Large Language Models (LLMs)', 
    'Retrieval-Augmented Generation (RAG)', 'Prompt Engineering', 'Vector Databases', 
    'REST APIs', 'FastAPI', 'MLOps'
  ],
  'Machine Learning Engineer': [
    'Python', 'Scikit-Learn', 'PyTorch', 'Feature Engineering', 
    'MLOps', 'Docker', 'FastAPI', 'REST APIs'
  ],
  'Software Developer': [
    'Python', 'Java', 'C++', 'TypeScript', 'JavaScript', 
    'React', 'Node.js', 'Express', 'Git & GitHub', 'REST APIs', 'SQL', 'PostgreSQL'
  ],
  'Data Engineer': [
    'SQL', 'Python', 'Apache Spark', 
    'Airflow', 'Snowflake', 'BigQuery', 'ETL Pipelines', 
    'Docker'
  ],
  'NLP Engineer': [
    'Python', 'Hugging Face', 'Transformers', 'PyTorch', 'NLTK', 'spaCy', 
    'Vector Databases', 'Natural Language Processing (NLP)'
  ],
  'Computer Vision Engineer': [
    'Python', 'OpenCV', 'PyTorch', 'Computer Vision', 
    'Deep Learning'
  ],
  'Cloud Engineer': [
    'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 
    'Linux', 'CI/CD'
  ]
};

export const SkillAnalysisDisplay: React.FC<SkillAnalysisDisplayProps> = ({
  targetRoleName,
  extractedData,
  onAddSkillToRoadmap,
}) => {
  // Get required benchmark skills for selected target role
  const requiredSkillsForRole = extractedData.requiredSkills && extractedData.requiredSkills.length > 0
    ? extractedData.requiredSkills
    : (TARGET_ROLE_BENCHMARKS[targetRoleName] || TARGET_ROLE_BENCHMARKS['Data Scientist']);

  const skillEvidence = extractedData.skillEvidence || {};
  const rawResumeText = extractedData.rawResumeText || '';

  // Extract candidate skills strictly from resume
  const skillsIHave = Array.from(
    new Set([
      ...(extractedData.detectedSkills || []),
      ...(extractedData.programmingLanguages || []),
      ...(extractedData.toolsAndTechnologies || [])
    ])
  );

  // 2. SKILLS TO LEARN: Required by Target Role BUT NOT explicitly present in candidate's resume text.
  // CRITICAL RULE: Unmatched role skills go ONLY to "Skills to Learn"
  const skillsToLearnList: string[] = requiredSkillsForRole.filter(req => 
    !skillsIHave.some(sk => sk.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(sk.toLowerCase()))
  );

  // 3. SKILLS TO IMPROVE: Candidate skills present in resume (with evidence) that overlap with target role expectations
  const skillsToImproveList = skillsIHave
    .filter(sk => requiredSkillsForRole.some(req => req.toLowerCase().includes(sk.toLowerCase()) || sk.toLowerCase().includes(req.toLowerCase())))
    .map(sk => ({
      skill: sk,
      reason: `Found in resume text; deepen mastery for ${targetRoleName}`
    }));

  // Calculate Matched Skills count
  const matchedSkills = skillsIHave.filter(sk =>
    requiredSkillsForRole.some(req => req.toLowerCase().includes(sk.toLowerCase()) || sk.toLowerCase().includes(req.toLowerCase()))
  );

  // Skill Match %
  const skillMatchPct = Math.min(100, Math.round((matchedSkills.length / Math.max(1, requiredSkillsForRole.length)) * 100));

  // Job Readiness Score
  const jobReadinessScore = Math.min(100, Math.round(skillMatchPct * 0.85 + (extractedData.experience?.length ? 15 : 0)));

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. TOP HERO READINESS & MATCH CARDS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* Readiness Score Card (7 cols) */}
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl lg:col-span-7">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white font-mono">
                  Target Role Analysis: <span className="text-cyan-400">{targetRoleName}</span>
                </h3>
                <p className="text-xs text-slate-400">Strictly evaluated from explicitly mentioned resume skills</p>
              </div>
            </div>

            <span className="rounded-full bg-emerald-950/80 border border-emerald-800 px-3 py-1 text-xs font-bold text-emerald-400 flex items-center space-x-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Exact Evidence Mode</span>
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 items-center">
            {/* Job Readiness Score Gauge */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="relative flex items-center justify-center">
                <svg className="h-32 w-32 -rotate-90">
                  <circle cx="64" cy="64" r="50" className="text-slate-800" strokeWidth="10" stroke="currentColor" fill="transparent" />
                  <circle 
                    cx="64" cy="64" r="50" 
                    className="text-cyan-400 transition-all duration-1000 ease-out" 
                    strokeWidth="10" 
                    strokeDasharray={2 * Math.PI * 50} 
                    strokeDashoffset={(2 * Math.PI * 50) - (jobReadinessScore / 100) * (2 * Math.PI * 50)} 
                    strokeLinecap="round" 
                    stroke="url(#cyanGlowGrad)" 
                    fill="transparent" 
                  />
                  <defs>
                    <linearGradient id="cyanGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-white font-mono">{jobReadinessScore}%</span>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-cyan-400">Readiness</span>
                </div>
              </div>
              <div className="mt-2 text-[11px] text-slate-300 font-semibold text-center">
                Job Readiness Score
              </div>
            </div>

            {/* Skill Match % Card */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="relative flex items-center justify-center">
                <svg className="h-32 w-32 -rotate-90">
                  <circle cx="64" cy="64" r="50" className="text-slate-800" strokeWidth="10" stroke="currentColor" fill="transparent" />
                  <circle 
                    cx="64" cy="64" r="50" 
                    className="text-indigo-400 transition-all duration-1000 ease-out" 
                    strokeWidth="10" 
                    strokeDasharray={2 * Math.PI * 50} 
                    strokeDashoffset={(2 * Math.PI * 50) - (skillMatchPct / 100) * (2 * Math.PI * 50)} 
                    strokeLinecap="round" 
                    stroke="url(#indigoGlowGrad)" 
                    fill="transparent" 
                  />
                  <defs>
                    <linearGradient id="indigoGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-white font-mono">{skillMatchPct}%</span>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-400">Skill Match</span>
                </div>
              </div>
              <div className="mt-2 text-[11px] text-slate-300 font-semibold text-center">
                Role Requirement Match
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Summary & Insights Card (5 cols) */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-xl shadow-2xl lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 font-bold text-amber-300 font-mono text-sm border-b border-slate-800 pb-3">
              <Lightbulb className="h-4 w-4 text-amber-400" />
              <span>Diagnostic Summary for {targetRoleName}</span>
            </div>

            <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start space-x-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Skills I Have ({skillsIHave.length}):</strong> {skillsIHave.length > 0 ? (
                    <span className="text-white font-mono">{skillsIHave.join(', ')}</span>
                  ) : (
                    <span className="text-slate-400 italic">No explicit technical skills found in uploaded resume.</span>
                  )}
                </span>
              </li>
              <li className="flex items-start space-x-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Skills to Learn ({skillsToLearnList.length}):</strong> {skillsToLearnList.length > 0 ? (
                    <span className="text-rose-300 font-mono">{skillsToLearnList.slice(0, 4).join(', ')}{skillsToLearnList.length > 4 ? ` (+${skillsToLearnList.length - 4} more)` : ''}</span>
                  ) : (
                    <span className="text-emerald-300 font-semibold">All required skills present in resume!</span>
                  )}
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Uploaded Resume Text</span>
            <span className="text-cyan-400 font-semibold">{matchedSkills.length} / {requiredSkillsForRole.length} Required Skills Matched</span>
          </div>
        </div>

      </div>

      {/* 2. THE 4 SKILL CATEGORY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* CARD 1: SKILLS I HAVE */}
        <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/60 p-5 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2 text-emerald-400 font-mono font-bold text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>Skills I Have</span>
            </div>
            <span className="rounded-full bg-emerald-950 border border-emerald-800 px-2 py-0.5 text-xs font-extrabold text-emerald-300">
              {skillsIHave.length}
            </span>
          </div>

          <div className="space-y-2 min-h-[140px]">
            {skillsIHave.length > 0 ? (
              skillsIHave.map((skill, idx) => {
                const isRoleReq = requiredSkillsForRole.some(req => req.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(req.toLowerCase()));
                const evidence = skillEvidence[skill];
                return (
                  <div key={idx} className="flex flex-col rounded-xl bg-slate-950/60 p-2.5 border border-slate-800/80 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{skill}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isRoleReq ? 'text-emerald-400 bg-emerald-500/10' : 'text-cyan-400 bg-cyan-500/10'
                      }`}>
                        {isRoleReq ? 'Role Matched' : 'Verified'}
                      </span>
                    </div>
                    {evidence && (
                      <div className="text-[10px] text-slate-400 font-mono line-clamp-2 bg-slate-900/80 p-1.5 rounded-lg border border-slate-800/50">
                        <span className="text-cyan-400 font-bold">Evidence: </span>"{evidence}"
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <span className="text-xs text-slate-500 italic block pt-4">No explicit skills found in uploaded resume.</span>
            )}
          </div>
        </div>

        {/* CARD 2: SKILLS TO IMPROVE */}
        <div className="rounded-2xl border border-amber-500/30 bg-slate-900/60 p-5 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2 text-amber-400 font-mono font-bold text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>Skills to Improve</span>
            </div>
            <span className="rounded-full bg-amber-950 border border-amber-800 px-2 py-0.5 text-xs font-extrabold text-amber-300">
              {skillsToImproveList.length}
            </span>
          </div>

          <div className="space-y-1.5 min-h-[140px]">
            {skillsToImproveList.length > 0 ? (
              skillsToImproveList.map((item, idx) => {
                const skillName = typeof item === 'string' ? item : (item as any).skill || (item as any).name;
                const reason = typeof item === 'object' && (item as any).reason ? (item as any).reason : `Build higher depth for ${targetRoleName}`;
                return (
                  <div key={idx} className="flex flex-col rounded-xl bg-slate-950/60 p-2 border border-slate-800/80 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{skillName}</span>
                      <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">Practice</span>
                    </div>
                    <span className="text-[10px] text-slate-400 line-clamp-1">{reason}</span>
                  </div>
                );
              })
            ) : (
              <span className="text-xs text-slate-500 italic block pt-4">No skills flagged for improvement.</span>
            )}
          </div>
        </div>

        {/* CARD 3: SKILLS TO LEARN */}
        <div className="rounded-2xl border border-rose-500/30 bg-slate-900/60 p-5 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2 text-rose-400 font-mono font-bold text-sm">
              <XCircle className="h-4 w-4" />
              <span>Skills to Learn</span>
            </div>
            <span className="rounded-full bg-rose-950 border border-rose-800 px-2 py-0.5 text-xs font-extrabold text-rose-300">
              {skillsToLearnList.length}
            </span>
          </div>

          <div className="space-y-1.5 min-h-[140px]">
            {skillsToLearnList.length > 0 ? (
              skillsToLearnList.map((skill, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl bg-slate-950/60 p-2 border border-slate-800/80 text-xs">
                  <span className="font-semibold text-rose-200">{skill}</span>
                  {onAddSkillToRoadmap && (
                    <button
                      type="button"
                      onClick={() => onAddSkillToRoadmap(skill)}
                      className="text-[10px] text-cyan-400 hover:text-white font-bold bg-cyan-500/10 hover:bg-cyan-500/30 px-2 py-0.5 rounded-md flex items-center space-x-0.5 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Roadmap</span>
                    </button>
                  )}
                </div>
              ))
            ) : (
              <span className="text-xs text-emerald-400 font-semibold italic block pt-4">All required role skills found in resume!</span>
            )}
          </div>
        </div>

        {/* CARD 4: REQUIRED ROLE SKILLS */}
        <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/60 p-5 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono font-bold text-sm">
              <Target className="h-4 w-4" />
              <span>Target Role Requirements</span>
            </div>
            <span className="rounded-full bg-cyan-950 border border-cyan-800 px-2 py-0.5 text-xs font-extrabold text-cyan-300">
              {requiredSkillsForRole.length}
            </span>
          </div>

          <div className="space-y-1.5 min-h-[140px]">
            {requiredSkillsForRole.map((reqSkill, idx) => {
              const isFoundInResume = skillsIHave.some(s => s.toLowerCase().includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(s.toLowerCase()));
              return (
                <div key={idx} className="flex items-center justify-between rounded-xl bg-slate-950/60 p-2 border border-slate-800/80 text-xs">
                  <span className="font-semibold text-slate-200">{reqSkill}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isFoundInResume ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                  }`}>
                    {isFoundInResume ? 'In Resume' : 'To Learn'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 3. DETAILED SKILL COMPARISON TABLE */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
            <ListChecks className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">Explicit Skill Comparison Table</h3>
            <p className="text-xs text-slate-400">Comparing Uploaded Resume Skills vs. {targetRoleName} Requirements</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 font-mono">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Skill</th>
                <th className="px-4 py-3">Source & Evidence</th>
                <th className="px-4 py-3">Explicit Status</th>
                <th className="px-4 py-3 rounded-r-xl text-right">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {requiredSkillsForRole.map((reqSkill, idx) => {
                const matchedSkillName = skillsIHave.find(s => s.toLowerCase().includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(s.toLowerCase()));
                const isFound = Boolean(matchedSkillName);
                const evidence = matchedSkillName ? skillEvidence[matchedSkillName] : null;

                return (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-bold text-white">{reqSkill}</td>
                    <td className="px-4 py-3 text-slate-400 max-w-xs">
                      {isFound ? (
                        <div className="space-y-0.5">
                          <span className="text-emerald-300 font-semibold">Uploaded Resume</span>
                          {evidence && <p className="text-[10px] text-slate-400 font-mono line-clamp-1">"{evidence}"</p>}
                        </div>
                      ) : (
                        <span>Target Role Requirement</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold">
                      {isFound ? (
                        <span className="text-emerald-400 flex items-center space-x-1">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                          <span>Explicitly Mentioned</span>
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center space-x-1">
                          <XCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>Not in Resume</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${
                        isFound ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {isFound ? 'Skills I Have' : 'Skills to Learn'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
