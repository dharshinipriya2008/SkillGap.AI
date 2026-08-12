import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ChevronDown, 
  ArrowRight, 
  Target, 
  BrainCircuit, 
  Loader2, 
  MessageSquareCode,
  Map,
  Check,
  GraduationCap,
  FolderGit2,
  Award,
  Briefcase,
  Layers,
  BarChart3
} from 'lucide-react';

interface SkillAnalysisPageProps {
  targetRole: string;
  onSelectRole: (roleId: string) => void;
  onNavigate: (tab: string) => void;
  showToast: (msg: string) => void;
}

interface EducationItem {
  degree: string;
  institution: string;
  year?: string;
}

interface ProjectItem {
  title: string;
  description: string;
  technologies?: string[];
}

interface CertificationItem {
  name: string;
  issuer?: string;
}

interface ExperienceItem {
  role: string;
  company: string;
  duration?: string;
  description?: string;
}

interface ComparisonItem {
  skill: string;
  category: string;
  requiredLevel: 'Basic' | 'Intermediate' | 'Advanced';
  currentLevel: 'None' | 'Beginner' | 'Basic' | 'Intermediate' | 'Advanced';
  requiredPct: number;
  currentPct: number;
  status: 'Strong' | 'Improve' | 'Missing';
}

interface RecommendationItem {
  priority?: string;
  title: string;
  description: string;
}

interface ExtractedAnalysisData {
  detectedSkills: string[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  experience: ExperienceItem[];
  strongSkills: string[];
  skillsToImprove: Array<{ skill: string; currentLevel?: string; targetLevel?: string } | string>;
  missingSkills: string[];
  skillMatchPct: number;
  jobReadinessScore: number;
  skillComparisonTable: ComparisonItem[];
  recommendations: RecommendationItem[];
}

export const SkillAnalysisPage: React.FC<SkillAnalysisPageProps> = ({
  targetRole,
  onSelectRole,
  onNavigate,
  showToast,
}) => {
  // Start with no resume uploaded by default
  const [resumeFile, setResumeFile] = useState<{
    file?: File;
    name: string;
    size: string;
    dataUrl?: string;
    text?: string;
    mimeType?: string;
  } | null>(null);

  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [analyzedRole, setAnalyzedRole] = useState(targetRole || 'Data Scientist');
  const [analysisData, setAnalysisData] = useState<ExtractedAnalysisData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const roleOptions = [
    { id: 'data-scientist', label: 'Data Scientist' },
    { id: 'data-analyst', label: 'Data Analyst' },
    { id: 'ai-engineer', label: 'AI Engineer' },
    { id: 'aiml-engineer', label: 'Machine Learning Engineer' },
    { id: 'software-dev', label: 'Software Developer' },
  ];

  // Run Gemini analysis on uploaded resume data
  const processAndAnalyzeFile = async (
    fileInfo: { name: string; size: string; dataUrl?: string; text?: string; mimeType?: string },
    selectedRole: string
  ) => {
    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/parse-and-analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: selectedRole,
          fileData: fileInfo.dataUrl,
          fileType: fileInfo.mimeType,
          fileName: fileInfo.name,
          resumeText: fileInfo.text,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to extract skills from resume.');
      }

      setAnalysisData(json.data);
      showToast(`Skills extracted and analyzed for ${selectedRole}!`);
    } catch (err: any) {
      console.error('Error analyzing resume:', err);
      setErrorMsg(err.message || 'An error occurred while parsing resume.');
      showToast('Error analyzing resume. Please try uploading again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (file: File) => {
    const formattedSize = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
    const reader = new FileReader();

    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const fileInfo = {
          file,
          name: file.name,
          size: formattedSize,
          text,
          mimeType: file.type || 'text/plain',
        };
        setResumeFile(fileInfo);
        processAndAnalyzeFile(fileInfo, analyzedRole);
      };
      reader.readAsText(file);
    } else {
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const fileInfo = {
          file,
          name: file.name,
          size: formattedSize,
          dataUrl,
          mimeType: file.type || 'application/pdf',
        };
        setResumeFile(fileInfo);
        processAndAnalyzeFile(fileInfo, analyzedRole);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
    setAnalysisData(null);
    setErrorMsg(null);
    showToast('Resume removed. Upload a new resume to analyze.');
  };

  const handleRoleChange = (roleLabel: string, roleId: string) => {
    setAnalyzedRole(roleLabel);
    onSelectRole(roleId);
    setRoleDropdownOpen(false);
    showToast(`Updated analysis target to ${roleLabel}`);

    if (resumeFile) {
      processAndAnalyzeFile(resumeFile, roleLabel);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300 mb-2">
            <BrainCircuit className="h-3.5 w-3.5 text-cyan-400" />
            <span>AI Resume Extraction & Diagnostics</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Skill Analysis
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Discover your strengths and identify the skills you need to improve.
          </p>
        </div>

        {/* Target Job Role Dropdown */}
        <div className="relative mt-4 sm:mt-0">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center space-x-2 rounded-xl border border-purple-500/30 bg-slate-900/80 px-4 py-2.5 text-sm font-semibold text-purple-400 shadow-lg hover:border-purple-400 hover:bg-slate-900 transition-all duration-200"
          >
            <Target className="h-4 w-4 text-purple-400" />
            <span>Target Role: <span className="text-white">{analyzedRole}</span></span>
            <ChevronDown className="h-4 w-4 text-purple-400/80" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/10 bg-[#0B0F1A]/95 p-2 shadow-2xl backdrop-blur-2xl z-50">
              <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Target Position
              </div>
              {roleOptions.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleChange(role.label, role.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    analyzedRole === role.label
                      ? 'bg-slate-800/80 text-cyan-400 border border-cyan-400/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{role.label}</span>
                  {analyzedRole === role.label && <Check className="h-4 w-4 text-cyan-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Resume Upload Section */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Upload your Resume</h2>
            <p className="text-xs text-slate-400">PDF or DOCX format supported (Up to 10MB)</p>
          </div>
        </div>

        {!resumeFile ? (
          /* Drag and drop upload box */
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
              isDragOver
                ? 'border-cyan-400 bg-cyan-500/10'
                : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-cyan-400 mb-3">
              <FileText className="h-7 w-7" />
            </div>
            <h3 className="text-sm font-bold text-white">Upload your Resume</h3>
            <p className="text-xs text-slate-400 mt-1">PDF or DOCX</p>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              accept=".pdf,.docx,.doc,.txt"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-5 py-2.5 text-xs font-semibold transition-all"
            >
              Choose Resume
            </button>
          </div>
        ) : (
          /* Uploaded File Status Box */
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-5">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-sm">{resumeFile.name}</span>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                    Uploaded & Extracted
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{resumeFile.size} • Last processed just now</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleRemoveResume}
                className="flex items-center space-x-1 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white px-3 py-2 text-xs font-medium border border-slate-700 transition-all"
              >
                <X className="h-4 w-4" />
                <span>Remove</span>
              </button>

              <button
                onClick={() => resumeFile && processAndAnalyzeFile(resumeFile, analyzedRole)}
                disabled={isAnalyzing}
                className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] px-5 py-2 text-xs font-bold text-white transition-all disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Analyze Resume</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* No Resume Uploaded State Message */}
      {!resumeFile && (
        <div className="rounded-3xl border border-dashed border-cyan-500/30 bg-slate-900/60 p-8 text-center backdrop-blur-md shadow-2xl space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <BarChart3 className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Please upload your resume to analyze your skills.</h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
            Upload your resume above to automatically extract your detected skills, education, projects, certifications, and work experience, and view a personalized gap analysis for <span className="text-cyan-300 font-semibold">{analyzedRole}</span>.
          </p>
        </div>
      )}

      {/* Loading Spinner during analysis */}
      {isAnalyzing && (
        <div className="rounded-3xl border border-cyan-500/30 bg-slate-900/80 p-8 text-center backdrop-blur-md shadow-2xl flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Extracting & Analyzing Resume Content...</h3>
          <p className="text-xs text-slate-400">Extracting skills, education, projects, and certifications using Gemini AI</p>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/40 p-4 text-xs text-rose-300 flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 3. Extracted Resume Profile Details & Analysis Results */}
      {resumeFile && analysisData && !isAnalyzing && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Extracted Profile Sections (Skills, Education, Projects, Certifications, Experience) */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="h-5 w-5 text-cyan-400" />
                <h2 className="text-lg font-bold text-white">Extracted Resume Profile</h2>
              </div>
              <span className="text-xs text-slate-400">Parsed directly from uploaded resume</span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              
              {/* Detected Skills */}
              <div className="space-y-2 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  <Layers className="h-4 w-4" />
                  <span>Detected Skills ({analysisData.detectedSkills?.length || 0})</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {analysisData.detectedSkills?.length > 0 ? (
                    analysisData.detectedSkills.map((skill, i) => (
                      <span key={i} className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 text-xs font-medium text-cyan-300">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">No skills explicitly detected in document</span>
                  )}
                </div>
              </div>

              {/* Education */}
              <div className="space-y-2 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center space-x-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                  <GraduationCap className="h-4 w-4" />
                  <span>Education</span>
                </div>
                <div className="space-y-2 pt-1">
                  {analysisData.education?.length > 0 ? (
                    analysisData.education.map((edu, i) => (
                      <div key={i} className="text-xs border-l-2 border-purple-500/40 pl-3 py-0.5">
                        <div className="font-bold text-white">{edu.degree}</div>
                        <div className="text-slate-400">{edu.institution} {edu.year && `(${edu.year})`}</div>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">No education entries found</span>
                  )}
                </div>
              </div>

              {/* Projects */}
              <div className="space-y-2 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <FolderGit2 className="h-4 w-4" />
                  <span>Projects</span>
                </div>
                <div className="space-y-2 pt-1">
                  {analysisData.projects?.length > 0 ? (
                    analysisData.projects.map((proj, i) => (
                      <div key={i} className="text-xs border-l-2 border-emerald-500/40 pl-3 py-0.5">
                        <div className="font-bold text-white">{proj.title}</div>
                        <div className="text-slate-300 text-[11px] mt-0.5">{proj.description}</div>
                        {proj.technologies && proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {proj.technologies.map((t, idx) => (
                              <span key={idx} className="bg-emerald-500/10 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">No projects explicitly found</span>
                  )}
                </div>
              </div>

              {/* Experience & Certifications */}
              <div className="space-y-4">
                {/* Certifications */}
                <div className="space-y-2 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <Award className="h-4 w-4" />
                    <span>Certifications</span>
                  </div>
                  <div className="space-y-1 pt-1">
                    {analysisData.certifications?.length > 0 ? (
                      analysisData.certifications.map((cert: any, i: number) => (
                        <div key={i} className="text-xs text-slate-200 flex items-center space-x-1.5">
                          <Check className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          <span>{typeof cert === 'string' ? cert : `${cert.name} ${cert.issuer ? `(${cert.issuer})` : ''}`}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">No certifications listed</span>
                    )}
                  </div>
                </div>

                {/* Experience */}
                <div className="space-y-2 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    <Briefcase className="h-4 w-4" />
                    <span>Work & Internship Experience</span>
                  </div>
                  <div className="space-y-2 pt-1">
                    {analysisData.experience?.length > 0 ? (
                      analysisData.experience.map((exp, i) => (
                        <div key={i} className="text-xs border-l-2 border-cyan-500/40 pl-3 py-0.5">
                          <div className="font-bold text-white">{exp.role} <span className="text-slate-400 font-normal">at {exp.company}</span></div>
                          {exp.duration && <div className="text-[10px] text-slate-400">{exp.duration}</div>}
                          {exp.description && <div className="text-[11px] text-slate-300 mt-0.5">{exp.description}</div>}
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">No work experience listed</span>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* 4. Analysis Results Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Overall Match */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <span className="text-xs text-slate-400 font-semibold uppercase">Skill Match %</span>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-white">{analysisData.skillMatchPct || 72}%</span>
                <span className="text-xs text-cyan-400 font-semibold">Matched</span>
              </div>
              <p className="mt-1 text-[11px] text-cyan-300">Target Role: {analyzedRole}</p>
            </div>

            {/* Job Readiness Score */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <span className="text-xs text-purple-400 font-semibold uppercase">Job Readiness Score</span>
              <div className="mt-2 text-3xl font-bold text-purple-400">{analysisData.jobReadinessScore || 70}/100</div>
              <p className="mt-1 text-[11px] text-slate-400">Based on resume analysis</p>
            </div>

            {/* Strong Skills */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <span className="text-xs text-emerald-400 font-semibold uppercase flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Strong Skills
              </span>
              <div className="mt-2 text-3xl font-bold text-white">{analysisData.strongSkills?.length || 0}</div>
              <p className="mt-1 text-[11px] text-slate-400">Met for {analyzedRole}</p>
            </div>

            {/* Skills to Improve & Missing Skills */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <span className="text-xs text-amber-400 font-semibold uppercase flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> Missing / To Improve
              </span>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-amber-400">{analysisData.skillsToImprove?.length || 0}</span>
                <span className="text-xs text-red-400">/ {analysisData.missingSkills?.length || 0} missing</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">Required gaps for {analyzedRole}</p>
            </div>
          </div>

          {/* 5. Skill Comparison Table */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Skill Matrix Comparison</h2>
                <p className="text-xs text-slate-400">Requirements for <span className="text-cyan-300 font-semibold">{analyzedRole}</span> vs your extracted resume skills</p>
              </div>
              <span className="text-xs text-slate-400">{analysisData.skillComparisonTable?.length || 0} Evaluated Skills</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-900/40">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Skill</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Required Level</th>
                    <th className="py-3 px-4 font-semibold">Current Level</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {analysisData.skillComparisonTable?.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{row.skill}</td>
                      <td className="py-3.5 px-4 text-slate-400">{row.category}</td>
                      <td className="py-3.5 px-4">
                        <span className="rounded bg-slate-800 px-2 py-0.5 font-medium text-slate-300">
                          {row.requiredLevel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-200">{row.currentLevel}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                            row.status === 'Strong'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : row.status === 'Improve'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {row.status === 'Strong' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {row.status === 'Improve' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {row.status === 'Missing' && <XCircle className="h-3 w-3 mr-1" />}
                          <span>{row.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. Skill Gap Visualization */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Skill Gap Visualization</h2>
              <p className="text-xs text-slate-400">Market requirement level vs your extracted resume proficiency</p>
            </div>

            <div className="space-y-4">
              {analysisData.skillComparisonTable?.map((item, idx) => (
                <div key={idx} className="space-y-1.5 bg-slate-800/30 p-3.5 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{item.skill}</span>
                    <div className="flex items-center space-x-3 text-[11px]">
                      <span className="text-slate-400">Req: <strong className="text-slate-200">{item.requiredPct || 80}%</strong></span>
                      <span className="text-cyan-400">Resume Level: <strong>{item.currentPct || 0}%</strong></span>
                    </div>
                  </div>

                  {/* Layered Progress Bar */}
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-900">
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-slate-700/60 rounded-full"
                      style={{ width: `${item.requiredPct || 80}%` }}
                    />
                    <div
                      className={`relative h-full rounded-full transition-all duration-700 ${
                        item.status === 'Strong'
                          ? 'bg-emerald-400'
                          : item.status === 'Improve'
                          ? 'bg-amber-400'
                          : 'bg-red-400'
                      }`}
                      style={{ width: `${item.currentPct || 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7. AI Actionable Recommendations */}
          {analysisData.recommendations && analysisData.recommendations.length > 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <BrainCircuit className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">AI Recommendations</h2>
                  <p className="text-xs text-slate-400">Personalized steps based on missing and improvable skills for {analyzedRole}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {analysisData.recommendations.map((rec: any, i: number) => (
                  <div key={i} className="rounded-2xl border border-white/5 bg-slate-800/40 p-4 space-y-1.5">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase bg-cyan-500/10 px-2 py-0.5 rounded">
                      Recommendation #{i + 1}
                    </span>
                    <h3 className="text-xs font-bold text-white mt-1">
                      {typeof rec === 'string' ? rec : rec.title}
                    </h3>
                    {typeof rec !== 'string' && rec.description && (
                      <p className="text-[11px] text-slate-400">{rec.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. Page CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
            <button
              onClick={() => onNavigate('Interview Practice')}
              className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquareCode className="h-4 w-4 text-cyan-400" />
              <span>Practice Interview</span>
            </button>

            <button
              onClick={() => onNavigate('Learning Roadmap')}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Map className="h-4 w-4 text-white" />
              <span>Generate Learning Roadmap</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
