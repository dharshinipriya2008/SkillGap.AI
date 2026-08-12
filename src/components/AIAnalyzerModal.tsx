import React, { useState } from 'react';
import { X, Sparkles, Loader2, CheckCircle2, AlertTriangle, ArrowRight, BrainCircuit, Rocket } from 'lucide-react';

interface AIAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTargetRole: string;
  onApplyAnalysisResults?: (results: any) => void;
}

export const AIAnalyzerModal: React.FC<AIAnalyzerModalProps> = ({
  isOpen,
  onClose,
  currentTargetRole,
  onApplyAnalysisResults,
}) => {
  const [targetRole, setTargetRole] = useState(currentTargetRole || 'Data Scientist');
  const [userSkills, setUserSkills] = useState('Python, SQL, Pandas, NumPy, Statistics, Git');
  const [resumeText, setResumeText] = useState('Computer Science student with experience in Python data analysis and database queries. Looking to enter entry level Data Science roles.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleRunAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          userSkills,
          resumeText,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to analyze skills.');
      }

      setAnalysisResult(json.data);
      if (onApplyAnalysisResults) {
        onApplyAnalysisResults(json.data);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong with AI Analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-xl bg-slate-800 p-2 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/20">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-mono">Gemini AI Skill Gap Scan</h2>
            <p className="text-xs text-slate-400">Evaluate your current skills against live market demands for any tech role</p>
          </div>
        </div>

        {/* Form Inputs or Results */}
        {!analysisResult ? (
          <div className="mt-6 space-y-4">
            
            {/* Target Role input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Target Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="Data Scientist">Data Scientist</option>
                <option value="AI / Machine Learning Engineer">AI / Machine Learning Engineer</option>
                <option value="Full Stack Engineer">Full Stack Engineer</option>
                <option value="DevOps Engineer">DevOps & Cloud Engineer</option>
                <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
              </select>
            </div>

            {/* Current Skills comma separated */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Your Current Skills (Comma Separated)
              </label>
              <input
                type="text"
                value={userSkills}
                onChange={(e) => setUserSkills(e.target.value)}
                placeholder="e.g. Python, React, SQL, Docker, Machine Learning"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Resume or Bio snippet */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Resume Summary / Bio Snippet
              </label>
              <textarea
                rows={3}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste key bullet points from your resume or course projects..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300 flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                onClick={handleRunAnalysis}
                disabled={loading}
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 py-3.5 text-sm font-extrabold text-white shadow-xl hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-cyan-200" />
                    <span>Analyzing Profile with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 text-cyan-200" />
                    <span>Generate AI Gap Report</span>
                  </>
                )}
              </button>
            </div>

          </div>
        ) : (
          /* Results View */
          <div className="mt-6 space-y-5 max-h-[70vh] overflow-y-auto pr-1">
            
            {/* Score & Summary */}
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  AI Match Analysis: {targetRole}
                </span>
                <p className="mt-1 text-xs text-slate-200 leading-relaxed">
                  {analysisResult.summary}
                </p>
              </div>
              <div className="ml-4 flex flex-col items-center justify-center rounded-2xl bg-slate-950 p-4 border border-slate-800">
                <span className="text-3xl font-extrabold text-cyan-400 font-mono">
                  {analysisResult.readinessScore || 75}%
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Ready</span>
              </div>
            </div>

            {/* Missing Skills detected */}
            {analysisResult.missingSkills && (
              <div>
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">
                  Key Missing Skills Identified:
                </h4>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {analysisResult.missingSkills.map((m: any, i: number) => (
                    <div key={i} className="rounded-xl border border-rose-500/20 bg-slate-950 p-3 text-xs">
                      <div className="font-bold text-slate-200 flex items-center justify-between">
                        <span>{m.name}</span>
                        <span className="text-[10px] text-rose-400 bg-rose-950 px-1.5 py-0.5 rounded border border-rose-800">
                          {m.importance}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400">{m.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Projects */}
            {analysisResult.recommendedProjects && (
              <div>
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                  Recommended Project to Close Gap:
                </h4>
                {analysisResult.recommendedProjects.slice(0, 2).map((p: any, i: number) => (
                  <div key={i} className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs mb-2">
                    <div className="font-bold text-white flex items-center justify-between">
                      <span>{p.title}</span>
                      <span className="text-[10px] text-cyan-300 font-mono">{p.difficulty}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-300">{p.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setAnalysisResult(null)}
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800"
              >
                Analyze Another Profile
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-xl bg-cyan-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400"
              >
                Done
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
