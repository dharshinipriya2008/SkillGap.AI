import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Check, 
  UploadCloud, 
  FileText, 
  BrainCircuit, 
  Loader2, 
  ArrowRight,
  GraduationCap,
  Briefcase,
  FolderGit2,
  CheckCircle2,
  RefreshCw,
  BarChart3,
  Cpu,
  Bot,
  Code2,
  Layers,
  MessageSquareCode,
  Eye,
  Cloud,
  Target
} from 'lucide-react';

export const TARGET_ROLE_OPTIONS = [
  { id: 'data-scientist', name: 'Data Scientist', icon: BrainCircuit, desc: 'ML, Statistics & Data Insights' },
  { id: 'data-analyst', name: 'Data Analyst', icon: BarChart3, desc: 'SQL, Business Intelligence & Reporting' },
  { id: 'ai-engineer', name: 'AI Engineer', icon: Cpu, desc: 'LLMs, RAG & Generative AI' },
  { id: 'aiml-engineer', name: 'Machine Learning Engineer', icon: Bot, desc: 'ML Pipelines, Scikit & MLOps' },
  { id: 'software-dev', name: 'Software Developer', icon: Code2, desc: 'Full Stack & Software Systems' },
  { id: 'data-engineer', name: 'Data Engineer', icon: Layers, desc: 'ETL Pipelines, Spark & Warehouses' },
  { id: 'nlp-engineer', name: 'NLP Engineer', icon: MessageSquareCode, desc: 'Text Processing, LLMs & Transformers' },
  { id: 'computer-vision-engineer', name: 'Computer Vision Engineer', icon: Eye, desc: 'OpenCV, PyTorch & Image Recognition' },
  { id: 'cloud-engineer', name: 'Cloud Engineer', icon: Cloud, desc: 'AWS, Azure, Docker & Kubernetes' },
];

export interface ExtractedResumeData {
  rawResumeText?: string;
  detectedSkills: string[];
  skillEvidence?: Record<string, string>;
  programmingLanguages?: string[];
  toolsAndTechnologies?: string[];
  requiredSkills?: string[];
  education: Array<{ degree: string; institution: string; year?: string }>;
  projects: Array<{ title: string; description: string; technologies?: string[] }>;
  certifications: Array<{ name: string; issuer?: string } | string>;
  experience: Array<{ role: string; company: string; duration?: string; description?: string }>;
  unreliableExtractMessage?: string;
  strongSkills?: string[];
  skillsToImprove?: Array<any>;
  missingSkills?: string[];
  skillMatchPct?: number;
  jobReadinessScore?: number;
  skillComparisonTable?: Array<any>;
  recommendations?: Array<any>;
}

interface WelcomeSectionProps {
  userName?: string;
  selectedRoleId: string | null;
  targetRoleName: string;
  onSelectRole: (roleId: string, roleName: string) => void;
  extractedData: ExtractedResumeData | null;
  isExtracting: boolean;
  isAnalyzed: boolean;
  onFileUpload: (file: File) => void;
  onRunAnalysis: () => void;
  onResetResume: () => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  userName = 'Dharshinipriyaa',
  selectedRoleId,
  targetRoleName,
  onSelectRole,
  extractedData,
  isExtracting,
  isAnalyzed,
  onFileUpload,
  onRunAnalysis,
  onResetResume,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-purple-950/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-3">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        
        <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-medium text-cyan-300">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>AI Career Diagnostics Engine</span>
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
          Welcome back, {userName}! <span className="inline-block animate-bounce">👋</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Select your target role below, upload your resume, and generate real AI skill gap diagnostics.
        </p>
      </div>

      {/* CHOOSE YOUR TARGET ROLE GRID SECTION */}
      <div className="rounded-3xl border border-slate-800/80 bg-slate-950/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold border border-cyan-500/40">
              1
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-mono">
                Choose Your Target Role
              </h2>
              <p className="text-xs text-slate-400">Select 1 role from the grid below</p>
            </div>
          </div>

          {selectedRoleId && (
            <span className="inline-flex items-center space-x-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-300 shadow-md shadow-cyan-950/40">
              <Check className="h-3.5 w-3.5 text-cyan-400" />
              <span>Target Role: {targetRoleName}</span>
            </span>
          )}
        </div>

        {/* 9 Selectable Role Cards (3 columns on desktop, 2 on tablet, 1 on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {TARGET_ROLE_OPTIONS.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRoleId === role.id;

            return (
              <button
                key={role.id}
                type="button"
                onClick={() => onSelectRole(role.id, role.name)}
                className={`group relative flex items-start space-x-3.5 rounded-2xl p-4 text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-2 border-cyan-400 bg-gradient-to-br from-cyan-950/60 via-slate-900 to-indigo-950/40 shadow-[0_0_25px_rgba(56,189,248,0.35)] scale-[1.02]'
                    : 'border border-slate-800/90 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90 hover:scale-[1.01] text-slate-300'
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30'
                      : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-cyan-400'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  <div className={`text-xs sm:text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {role.name}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {role.desc}
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-3.5 right-3.5 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400 text-slate-950 shadow-md">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* BEFORE ROLE SELECTION NOTICE */}
      {!selectedRoleId && (
        <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-500">
            <Target className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-slate-300 font-mono">
            Select a target role to continue.
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Choose any 1 of the 9 career tracks above to unlock resume uploading for your selected position.
          </p>
        </div>
      )}

      {/* AFTER ROLE SELECTION: RESUME UPLOAD SECTION */}
      {selectedRoleId && (
        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="flex items-center space-x-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 font-mono text-xs font-bold border border-purple-500/40">
                2
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white font-mono">
                  Upload Resume for <span className="text-cyan-300">{targetRoleName}</span>
                </h2>
                <p className="text-xs text-slate-400">PDF or DOCX format supported (Up to 10MB)</p>
              </div>
            </div>

            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-xl">
              <span>Target Role: <strong className="text-white">{targetRoleName}</strong></span>
            </div>
          </div>

          {/* Upload Box */}
          {!extractedData && !isExtracting && (
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.txt,.doc,.docx"
                className="hidden"
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
                  isDragOver
                    ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
                    : 'border-cyan-500/30 bg-slate-900/60 hover:border-cyan-400 hover:bg-slate-900/90'
                }`}
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-inner mb-4">
                  <UploadCloud className="h-7 w-7" />
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white font-mono">
                  Upload Resume for <span className="text-cyan-300">{targetRoleName}</span>
                </h3>
                <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto">
                  Drag & drop your PDF or DOCX resume here, or click below to browse files.
                </p>

                <div className="mt-5 flex justify-center">
                  <button
                    type="button"
                    className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Upload Resume</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Extracting Loading State */}
          {isExtracting && (
            <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-8 text-center space-y-4 animate-pulse">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/40">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white font-mono">
                  Extracting Resume Information...
                </h3>
                <p className="mt-1 text-[11px] text-slate-400 max-w-md mx-auto">
                  Parsing technical skills, education, projects, and work history for {targetRoleName}.
                </p>
              </div>
            </div>
          )}

          {/* Extracted Resume Details & "Analyze My Skills" Button */}
          {extractedData && !isExtracting && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="flex items-center space-x-2 text-emerald-400 font-mono font-bold text-xs sm:text-sm">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Resume Extracted for {targetRoleName}!</span>
                </div>

                <button
                  onClick={onResetResume}
                  className="flex items-center space-x-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Change Resume</span>
                </button>
              </div>

              {/* Extracted Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* Extracted Skills */}
                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 space-y-2">
                  <div className="flex items-center space-x-2 font-bold text-cyan-300 font-mono">
                    <BrainCircuit className="h-4 w-4 text-cyan-400" />
                    <span>Detected Skills ({extractedData.detectedSkills?.length || 0})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {extractedData.detectedSkills && extractedData.detectedSkills.length > 0 ? (
                      extractedData.detectedSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-200"
                        >
                          {sk}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 italic">No explicit skills detected</span>
                    )}
                  </div>
                </div>

                {/* Extracted Education */}
                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 space-y-2">
                  <div className="flex items-center space-x-2 font-bold text-purple-300 font-mono">
                    <GraduationCap className="h-4 w-4 text-purple-400" />
                    <span>Education</span>
                  </div>
                  <div className="space-y-1.5 text-slate-300">
                    {extractedData.education && extractedData.education.length > 0 ? (
                      extractedData.education.map((edu, idx) => (
                        <div key={idx} className="border-l-2 border-purple-500/50 pl-2 py-0.5">
                          <div className="font-semibold text-white">{edu.degree}</div>
                          <div className="text-[11px] text-slate-400">{edu.institution} {edu.year ? `(${edu.year})` : ''}</div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-500 italic">No education details parsed</span>
                    )}
                  </div>
                </div>

                {/* Extracted Experience */}
                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 space-y-2">
                  <div className="flex items-center space-x-2 font-bold text-indigo-300 font-mono">
                    <Briefcase className="h-4 w-4 text-indigo-400" />
                    <span>Work & Internships</span>
                  </div>
                  <div className="space-y-1.5 text-slate-300">
                    {extractedData.experience && extractedData.experience.length > 0 ? (
                      extractedData.experience.map((exp, idx) => (
                        <div key={idx} className="border-l-2 border-indigo-500/50 pl-2 py-0.5">
                          <div className="font-semibold text-white">{exp.role} <span className="text-slate-400 font-normal">at {exp.company}</span></div>
                          {exp.duration && <div className="text-[10px] text-slate-400">{exp.duration}</div>}
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-500 italic">No formal experience listed</span>
                    )}
                  </div>
                </div>

                {/* Extracted Projects */}
                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 space-y-2">
                  <div className="flex items-center space-x-2 font-bold text-emerald-300 font-mono">
                    <FolderGit2 className="h-4 w-4 text-emerald-400" />
                    <span>Projects</span>
                  </div>
                  <div className="space-y-1.5 text-slate-300">
                    {extractedData.projects && extractedData.projects.length > 0 ? (
                      extractedData.projects.map((proj, idx) => (
                        <div key={idx} className="border-l-2 border-emerald-500/50 pl-2 py-0.5">
                          <div className="font-semibold text-white">{proj.title}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{proj.description}</div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-500 italic">No projects explicitly parsed</span>
                    )}
                  </div>
                </div>

              </div>

              {/* "Analyze My Skills" Button */}
              <div className="pt-2 flex justify-center">
                <button
                  onClick={onRunAnalysis}
                  className="flex items-center space-x-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 px-8 py-4 text-sm font-extrabold text-white shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <Sparkles className="h-5 w-5 text-cyan-200" />
                  <span>Analyze My Skills for {targetRoleName}</span>
                  <ArrowRight className="h-5 w-5 ml-1" />
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
