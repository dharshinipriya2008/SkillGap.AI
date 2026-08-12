import React, { useState } from 'react';
import { 
  Target, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Code2, 
  GraduationCap, 
  FolderGit2, 
  Trash2, 
  RefreshCw,
  RotateCcw,
  Briefcase,
  Award
} from 'lucide-react';
import { ExtractedResumeData, TARGET_ROLE_OPTIONS } from './WelcomeSection';

interface StepWizardFlowProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  selectedRoleId: string | null;
  targetRoleName: string;
  onSelectRole: (roleId: string, roleName?: string) => void;
  extractedData: ExtractedResumeData | null;
  isExtracting: boolean;
  isAnalyzed: boolean;
  onFileUpload: (file: File) => void;
  onTextUpload?: (text: string) => void;
  onRunAnalysis: () => void;
  onResetResume: () => void;
  onStartNewAnalysis: () => void;
  onNavigateTab: (tab: string) => void;
}

export const StepWizardFlow: React.FC<StepWizardFlowProps> = ({
  currentStep,
  setCurrentStep,
  selectedRoleId,
  targetRoleName,
  onSelectRole,
  extractedData,
  isExtracting,
  isAnalyzed,
  onFileUpload,
  onTextUpload,
  onRunAnalysis,
  onResetResume,
  onStartNewAnalysis,
  onNavigateTab,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
  const [pastedText, setPastedText] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      onFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFileName(file.name);
      onFileUpload(file);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* DASHBOARD HEADER & START NEW ANALYSIS BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl shadow-xl">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold text-white font-mono flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            <span>Skill Gap & Career Analysis Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400">
            Benchmark your technical skills against target roles, identify gaps, and generate roadmaps.
          </p>
        </div>

        <button
          type="button"
          onClick={onStartNewAnalysis}
          className="flex items-center space-x-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 px-4 py-2.5 text-xs font-bold text-cyan-300 hover:text-white transition-all shadow-md cursor-pointer shrink-0"
        >
          <RotateCcw className="h-4 w-4 text-cyan-400" />
          <span>Start New Analysis</span>
        </button>
      </div>

      {/* FLOW STEP PROGRESS INDICATOR */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between overflow-x-auto gap-2 text-xs font-mono">
          
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl transition-all ${
            currentStep === 1 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 
            currentStep > 1 ? 'text-emerald-400 font-bold' : 'text-slate-500'
          }`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
              currentStep > 1 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
            }`}>1</span>
            <span>Target Role</span>
          </div>

          <span className="text-slate-700">→</span>

          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl transition-all ${
            currentStep === 2 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 
            currentStep > 2 ? 'text-emerald-400 font-bold' : 'text-slate-500'
          }`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
              currentStep > 2 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
            }`}>2</span>
            <span>Upload Resume</span>
          </div>

          <span className="text-slate-700">→</span>

          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl transition-all ${
            currentStep === 3 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 
            currentStep > 3 || isAnalyzed ? 'text-emerald-400 font-bold' : 'text-slate-500'
          }`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
              currentStep > 3 || isAnalyzed ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
            }`}>3</span>
            <span>Analyze Resume</span>
          </div>

          <span className="text-slate-700">→</span>

          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl transition-all ${
            isAnalyzed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold' : 'text-slate-500'
          }`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
              isAnalyzed ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
            }`}>4</span>
            <span>Dashboard Summary</span>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* STEP 1 — TARGET ROLE */}
      {/* ========================================================= */}
      {currentStep === 1 && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 animate-fadeIn">
          <div className="space-y-2 border-b border-slate-800 pb-4">
            <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              <Target className="h-3.5 w-3.5 text-cyan-400" />
              <span>STEP 1 OF 3</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white font-mono">
              Set Your Target Role
            </h2>
            <p className="text-xs text-slate-400">
              Select the position you are aiming for to benchmark your resume skills.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TARGET_ROLE_OPTIONS.map((role) => {
              const isSelected = selectedRoleId === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => onSelectRole(role.id, role.name)}
                  className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-950/40 scale-[1.02]'
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-white font-mono">{role.name}</span>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-cyan-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{role.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="button"
              disabled={!targetRoleName}
              onClick={() => setCurrentStep(2)}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3 text-xs font-extrabold text-white shadow-lg hover:scale-105 active:scale-95 disabled:opacity-40 transition-all cursor-pointer"
            >
              <span>Continue to Resume Upload</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 2 — UPLOAD RESUME */}
      {/* ========================================================= */}
      {currentStep === 2 && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 animate-fadeIn">
          <div className="space-y-2 border-b border-slate-800 pb-4">
            <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              <UploadCloud className="h-3.5 w-3.5 text-cyan-400" />
              <span>STEP 2 OF 3</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white font-mono">
              Upload Your Resume
            </h2>
            <p className="text-xs text-slate-400">
              Upload your PDF or DOCX resume to analyze your skills, education, projects, and certifications for <strong className="text-cyan-300">{targetRoleName}</strong>.
            </p>
          </div>

          {!extractedData && !isExtracting && (
            <div className="flex border-b border-slate-800 space-x-6 text-xs font-mono">
              <button
                type="button"
                onClick={() => setInputMode('file')}
                className={`pb-3 font-bold border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
                  inputMode === 'file'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <UploadCloud className="h-4 w-4" />
                <span>Upload File (.pdf, .docx)</span>
              </button>

              <button
                type="button"
                onClick={() => setInputMode('text')}
                className={`pb-3 font-bold border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
                  inputMode === 'text'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Paste Resume Text</span>
              </button>
            </div>
          )}

          {!extractedData && !isExtracting && inputMode === 'file' && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all ${
                dragActive ? 'border-cyan-400 bg-cyan-950/20' : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
              }`}
            >
              <input
                type="file"
                id="resume-file-input"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-4">
                <UploadCloud className="h-7 w-7" />
              </div>

              <h3 className="text-base font-bold text-white font-mono">
                {uploadedFileName ? `Selected: ${uploadedFileName}` : 'Drag and drop your resume file here'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Supports PDF, DOCX, or TXT formats
              </p>

              <label
                htmlFor="resume-file-input"
                className="mt-5 inline-flex items-center space-x-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-extrabold text-slate-950 hover:bg-cyan-400 cursor-pointer transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>Upload Resume</span>
              </label>
            </div>
          )}

          {!extractedData && !isExtracting && inputMode === 'text' && (
            <div className="space-y-4">
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste your full resume text here (e.g. Skills, Education, Projects, Work Experience)..."
                rows={8}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs font-mono text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={!pastedText.trim()}
                  onClick={() => onTextUpload && onTextUpload(pastedText)}
                  className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-2.5 text-xs font-extrabold text-white shadow-lg hover:scale-105 disabled:opacity-40 transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Parse Resume Text</span>
                </button>
              </div>
            </div>
          )}

          {isExtracting && (
            <div className="rounded-3xl border border-cyan-500/40 bg-cyan-950/20 p-8 text-center space-y-4">
              <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin mx-auto" />
              <h3 className="text-base font-bold text-white font-mono">Parsing Resume Content...</h3>
              <p className="text-xs text-slate-400">Extracting technical skills, education, projects & experience</p>
            </div>
          )}

          {extractedData && (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-6 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-mono">Resume Uploaded Successfully</h3>
                <p className="text-xs text-slate-300 mt-1">Ready to extract structured information</p>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 text-xs font-extrabold text-slate-950 shadow-lg hover:scale-105 transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Analyze Resume Content</span>
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-xs font-semibold text-slate-400 hover:text-white"
            >
              ← Back to Target Role
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ========================================================= */}
      {/* STEP 3 — RESUME ANALYSIS & VERIFICATION */}
      {/* ========================================================= */}
      {currentStep === 3 && extractedData && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>STEP 3 OF 3</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white font-mono">
                Extracted Resume Details
              </h2>
              <p className="text-xs text-slate-400">
                Extracted strictly from your uploaded resume without synthetic additions. Please verify before running Skill Analysis.
              </p>
            </div>

            <button
              type="button"
              onClick={onResetResume}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1 border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 rounded-xl w-fit cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Re-upload Resume</span>
            </button>
          </div>

          {/* EXTRACTED METADATA GRID — ALL 5 SECTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            
            {/* 1. Technical Skills & Tools */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 md:col-span-2">
              <div className="font-bold text-cyan-400 font-mono flex items-center space-x-2">
                <Code2 className="h-4 w-4" />
                <span>Technical Skills & Tools</span>
              </div>
              {(() => {
                const skills = Array.from(new Set([
                  ...(extractedData.detectedSkills || []),
                  ...(extractedData.programmingLanguages || []),
                  ...(extractedData.toolsAndTechnologies || [])
                ]));
                if (skills.length > 0) {
                  return (
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((s, idx) => (
                        <span key={idx} className="rounded-md bg-slate-900 border border-slate-800 px-2.5 py-1 text-slate-200 font-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  );
                }
                return (
                  <p className="text-xs text-slate-500 italic bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/50">
                    Unable to reliably extract this section. Please re-upload the resume.
                  </p>
                );
              })()}
            </div>

            {/* 2. Education */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
              <div className="font-bold text-cyan-400 font-mono flex items-center space-x-2">
                <GraduationCap className="h-4 w-4" />
                <span>Education</span>
              </div>
              {extractedData.education && extractedData.education.length > 0 ? (
                <div className="space-y-1.5 text-slate-300">
                  {extractedData.education.map((e, idx) => (
                    <div key={idx} className="border-b border-slate-800/60 pb-1.5 last:border-0">
                      <span className="font-bold text-white block">{e.degree}</span>
                      <span className="text-slate-400 text-[11px]">{e.institution} {e.year ? `(${e.year})` : ''}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/50">
                  Unable to reliably extract this section. Please re-upload the resume.
                </p>
              )}
            </div>

            {/* 3. Work Experience */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
              <div className="font-bold text-cyan-400 font-mono flex items-center space-x-2">
                <Briefcase className="h-4 w-4" />
                <span>Work Experience</span>
              </div>
              {extractedData.experience && extractedData.experience.length > 0 ? (
                <div className="space-y-1.5 text-slate-300">
                  {extractedData.experience.map((exp, idx) => (
                    <div key={idx} className="border-b border-slate-800/60 pb-1.5 last:border-0">
                      <span className="font-bold text-white block">{exp.role}</span>
                      <span className="text-slate-400 text-[11px]">{exp.company} {exp.duration ? `(${exp.duration})` : ''}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/50">
                  Unable to reliably extract this section. Please re-upload the resume.
                </p>
              )}
            </div>

            {/* 4. Projects */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
              <div className="font-bold text-cyan-400 font-mono flex items-center space-x-2">
                <FolderGit2 className="h-4 w-4" />
                <span>Extracted Projects</span>
              </div>
              {extractedData.projects && extractedData.projects.length > 0 ? (
                <div className="space-y-2 text-slate-300">
                  {extractedData.projects.map((p, idx) => (
                    <div key={idx} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                      <span className="font-bold text-white block">{p.title}</span>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{p.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/50">
                  Unable to reliably extract this section. Please re-upload the resume.
                </p>
              )}
            </div>

            {/* 5. Certifications */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
              <div className="font-bold text-cyan-400 font-mono flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span>Certifications</span>
              </div>
              {extractedData.certifications && extractedData.certifications.length > 0 ? (
                <div className="space-y-1.5 text-slate-300">
                  {extractedData.certifications.map((c, idx) => {
                    const certName = typeof c === 'string' ? c : c.name;
                    const issuer = typeof c === 'object' && c.issuer ? c.issuer : null;
                    return (
                      <div key={idx} className="bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs">
                        <span className="font-semibold text-white">{certName}</span>
                        {issuer && <span className="text-slate-400 text-[10px] block">{issuer}</span>}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/50">
                  Unable to reliably extract this section. Please re-upload the resume.
                </p>
              )}
            </div>

          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
            >
              ← Back to Upload
            </button>

            <button
              type="button"
              onClick={() => {
                onRunAnalysis();
                setCurrentStep(4);
              }}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3 text-xs font-extrabold text-white shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Analyze Skills for {targetRoleName}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 6 — DASHBOARD CLEAN SUMMARY (WHEN ANALYSIS COMPLETE) */}
      {/* ========================================================= */}
      {(currentStep === 4 || isAnalyzed) && extractedData && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 animate-fadeIn">
          
          <div className="border-b border-slate-800 pb-4">
            <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300 mb-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Dashboard Overview</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white font-mono">
              Role & Resume Status Summary
            </h2>
            <p className="text-xs text-slate-400">
              Clean high-level breakdown of your career analysis for <strong className="text-cyan-300">{targetRoleName}</strong>.
            </p>
          </div>

          {/* CLEAN SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Target Role */}
            <div className="rounded-2xl border border-cyan-500/30 bg-slate-950/60 p-5 space-y-2">
              <span className="text-[10px] font-bold text-cyan-400 font-mono uppercase">Target Role</span>
              <div className="text-xl font-extrabold text-white font-mono">{targetRoleName}</div>
              <span className="inline-block text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                Active Benchmark
              </span>
            </div>

            {/* Resume Status */}
            <div className="rounded-2xl border border-emerald-500/30 bg-slate-950/60 p-5 space-y-2">
              <span className="text-[10px] font-bold text-emerald-400 font-mono uppercase">Resume Status</span>
              <div className="text-xl font-extrabold text-white font-mono">Analyzed</div>
              <span className="inline-block text-[10px] font-semibold text-slate-300 bg-slate-900 px-2 py-0.5 rounded-md">
                Verified Facts
              </span>
            </div>

            {/* Skills Found */}
            <div className="rounded-2xl border border-indigo-500/30 bg-slate-950/60 p-5 space-y-2">
              <span className="text-[10px] font-bold text-indigo-400 font-mono uppercase">Skills Found</span>
              <div className="text-xl font-extrabold text-white font-mono">
                {[...(extractedData.detectedSkills || []), ...(extractedData.programmingLanguages || [])].length} Skills
              </div>
              <span className="inline-block text-[10px] font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                Extracted
              </span>
            </div>

          </div>

          {/* ACTION NAVIGATION BUTTONS */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={onStartNewAnalysis}
              className="flex items-center space-x-2 text-xs font-bold text-rose-400 hover:text-rose-300 border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-rose-400" />
              <span>Start New Analysis</span>
            </button>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onNavigateTab('Skill Analysis')}
                className="flex-1 sm:flex-initial rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-3 text-xs font-bold text-white transition-colors"
              >
                View Skill Analysis
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('Learning Roadmap')}
                className="flex-1 sm:flex-initial rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg hover:scale-105 transition-all"
              >
                View Learning Roadmap
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
