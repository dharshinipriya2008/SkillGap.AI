import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ExtractedResumeData, TARGET_ROLE_OPTIONS } from './components/WelcomeSection';
import { StepWizardFlow } from './components/StepWizardFlow';
import { SkillAnalysisDisplay } from './components/SkillAnalysisDisplay';
import { PersonalizedLearningRoadmap } from './components/PersonalizedLearningRoadmap';
import { QuizPage } from './components/QuizPage';
import { ProjectsPage } from './components/ProjectsPage';
import { InterviewPracticePage } from './components/InterviewPracticePage';
import { AIAnalyzerModal } from './components/AIAnalyzerModal';
import { parseResumeFile } from './utils/resumeParser';

import { Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [targetRoleId, setTargetRoleId] = useState<string | null>(null);
  const [targetRoleName, setTargetRoleName] = useState<string>('Data Scientist');
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Dashboard Resume & Analysis Flow State
  const [extractedResumeData, setExtractedResumeData] = useState<ExtractedResumeData | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Helper to switch target role dynamically
  const handleSelectRole = (roleId: string, roleName?: string) => {
    setTargetRoleId(roleId);
    const matchedRole = TARGET_ROLE_OPTIONS.find((r) => r.id === roleId);
    const newRoleName = roleName || matchedRole?.name || 'Data Scientist';
    setTargetRoleName(newRoleName);
    showToast(`Target role updated to ${newRoleName}`);
  };

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 3000);
  };

  // Resume Extraction File Handler - strictly parses explicitly mentioned content from file
  const handleFileUpload = async (file: File) => {
    setIsExtracting(true);
    showToast(`Parsing explicitly mentioned skills from ${file.name}...`);

    try {
      const parsed = await parseResumeFile(file);
      setIsExtracting(false);
      setExtractedResumeData(parsed);
      setCurrentStep(3);

      const skillCount = parsed.detectedSkills ? parsed.detectedSkills.length : 0;
      if (skillCount > 0) {
        showToast(`Extracted ${skillCount} explicit skill${skillCount > 1 ? 's' : ''} from resume!`);
      } else {
        showToast('Resume processed. No explicit technical skills detected in file text.');
      }
    } catch (err) {
      console.error('Error parsing resume:', err);
      setIsExtracting(false);
      showToast('Error parsing uploaded resume file.');
    }
  };

  // Run full skill gap analysis when user clicks "Analyze My Skills"
  const handleRunAnalysis = () => {
    if (!extractedResumeData) return;
    setIsAnalyzed(true);
    setCurrentStep(4);
    showToast(`Skill Analysis unlocked for ${targetRoleName}!`);
  };

  const handleResetResume = () => {
    setExtractedResumeData(null);
    setIsAnalyzed(false);
    setCurrentStep(1);
    showToast('Reset uploaded resume data.');
  };

  // Start a completely fresh analysis session
  const handleStartNewAnalysis = () => {
    setExtractedResumeData(null);
    setIsExtracting(false);
    setIsAnalyzed(false);
    setTargetRoleId(null);
    setTargetRoleName('Data Scientist');
    setCurrentStep(1);
    setActiveTab('Dashboard');
    showToast('Analysis session reset! Select a new target role to begin.');
  };

  const handleApplyAIResults = (results: any) => {
    showToast('AI Skill Diagnosis applied to your profile!');
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col justify-between">
      <div>
        {/* Toast Notification */}
        {notificationToast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 rounded-2xl border border-cyan-500/40 bg-slate-900/95 px-4 py-3 text-xs font-bold text-cyan-300 shadow-2xl backdrop-blur-xl animate-bounce">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>{notificationToast}</span>
          </div>
        )}

        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedRoleId={targetRoleId}
          targetRoleName={targetRoleName}
          onSelectRole={handleSelectRole}
        />

        {/* Main Container */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Dashboard View */}
          {activeTab === 'Dashboard' && (
            <section id="wizard-flow-section">
              <StepWizardFlow
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                selectedRoleId={targetRoleId}
                targetRoleName={targetRoleName || 'Data Scientist'}
                onSelectRole={handleSelectRole}
                extractedData={extractedResumeData}
                isExtracting={isExtracting}
                isAnalyzed={isAnalyzed}
                onFileUpload={handleFileUpload}
                onRunAnalysis={handleRunAnalysis}
                onResetResume={handleResetResume}
                onStartNewAnalysis={handleStartNewAnalysis}
                onNavigateTab={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </section>
          )}

          {/* Skill Analysis Page View */}
          {activeTab === 'Skill Analysis' && (
            <section id="skill-analysis-page">
              {extractedResumeData ? (
                <SkillAnalysisDisplay
                  targetRoleName={targetRoleName || 'Data Scientist'}
                  extractedData={extractedResumeData}
                />
              ) : (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-center backdrop-blur-xl space-y-3">
                  <h3 className="text-lg font-bold text-white font-mono">No Resume Analyzed Yet</h3>
                  <p className="text-xs text-slate-400">Upload and analyze your resume on the Dashboard to view your skill analysis.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('Dashboard')}
                    className="rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors"
                  >
                    Go to Dashboard & Upload Resume
                  </button>
                </div>
              )}
            </section>
          )}

          {/* Learning Roadmap Page */}
          {activeTab === 'Learning Roadmap' && (
            <section id="roadmap-page-section">
              <PersonalizedLearningRoadmap
                targetRoleId={targetRoleId}
                targetRole={targetRoleName || 'Data Scientist'}
                isAnalyzed={isAnalyzed}
                extractedData={extractedResumeData}
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </section>
          )}

          {/* Quiz Page */}
          {activeTab === 'Quiz' && (
            <section id="quiz-page-section">
              <QuizPage
                targetRole={targetRoleName || 'Data Scientist'}
                targetRoleId={targetRoleId}
                isAnalyzed={isAnalyzed}
                extractedData={extractedResumeData}
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                showToast={showToast}
              />
            </section>
          )}

          {/* Projects Tab */}
          {activeTab === 'Projects' && (
            <section id="projects-page-section">
              <ProjectsPage
                targetRole={targetRoleName || 'Data Scientist'}
                showToast={showToast}
              />
            </section>
          )}

          {/* Interview Practice Tab */}
          {activeTab === 'Interview Practice' && (
            <section id="interview-page-section">
              <InterviewPracticePage
                targetRole={targetRoleName || 'Data Scientist'}
                showToast={showToast}
              />
            </section>
          )}

        </main>
      </div>

      {/* Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-mono font-bold text-slate-300">SkillGap.AI</span>
            <span>— Career Skill Analyzer</span>
          </div>
          <div>
            Personalized Career & Resume Intelligence
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AIAnalyzerModal
        isOpen={isAnalyzerOpen}
        onClose={() => setIsAnalyzerOpen(false)}
        currentTargetRole={targetRoleName}
        onApplyAnalysisResults={handleApplyAIResults}
      />

    </div>
  );
}
