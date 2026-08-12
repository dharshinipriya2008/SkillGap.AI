import React, { useState } from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  HelpCircle, 
  Play, 
  Award,
  Terminal,
  X,
  Send,
  Lock
} from 'lucide-react';

export interface ChallengeItem {
  id: string;
  title: string;
  problemStatement: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skillTested: string;
  expectedOutput: string;
  stageName: string;
  stageNumber: number;
  unlocked: boolean;
  technicalQuestions: Array<{
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
}

const ROLE_CHALLENGES: Record<string, ChallengeItem[]> = {
  'data-scientist': [
    {
      id: 'ds-ch-1',
      title: 'Automated Data Cleaning & Outlier Challenge',
      problemStatement: 'Clean a raw CSV dataset containing missing values in income, duplicate user IDs, and negative age values. Produce a tidy Pandas DataFrame.',
      difficulty: 'Beginner',
      skillTested: 'Pandas & Data Cleaning',
      expectedOutput: 'Cleaned DataFrame with 0 nulls, valid non-negative ages, and summary stats exported to CSV.',
      stageName: 'Data Foundations & Python',
      stageNumber: 1,
      unlocked: true,
      technicalQuestions: [
        {
          id: 'ds-q-1',
          question: 'In Pandas, which method is best suited to replace missing numerical values with the median of a column?',
          options: ['df.dropna()', 'df.fillna(df["col"].median())', 'df.replace(0)', 'df.isna().sum()'],
          correctIndex: 1,
          explanation: 'fillna() with the calculated median imputes missing values cleanly without dropping rows.'
        },
        {
          id: 'ds-q-2',
          question: 'How do you detect statistical outliers in a skewed continuous feature before model training?',
          options: ['Check standard deviation only', 'Interquartile Range (IQR = Q3 - Q1)', 'Multiply by 100', 'One-Hot Encoding'],
          correctIndex: 1,
          explanation: 'The Interquartile Range (IQR) method identifies data points beyond Q1 - 1.5*IQR or Q3 + 1.5*IQR.'
        }
      ]
    },
    {
      id: 'ds-ch-2',
      title: 'Customer Churn Prediction Model',
      problemStatement: 'Train a Scikit-Learn Logistic Regression & Random Forest classifier on customer usage metrics to predict 30-day user churn.',
      difficulty: 'Intermediate',
      skillTested: 'Machine Learning & Classification',
      expectedOutput: 'Trained model achieving >85% ROC-AUC score on holdout test set with feature importance plot.',
      stageName: 'Machine Learning & Scikit-Learn',
      stageNumber: 2,
      unlocked: true,
      technicalQuestions: [
        {
          id: 'ds-q-3',
          question: 'When dealing with imbalanced churn datasets (e.g., 95% active, 5% churned), which metric is most reliable?',
          options: ['Raw Accuracy', 'Precision-Recall AUC / F1-Score', 'Mean Squared Error', 'R2 Score'],
          correctIndex: 1,
          explanation: 'Raw accuracy is misleading for imbalanced datasets because predicting all active users yields 95% accuracy; F1 and PR-AUC measure true minority performance.'
        }
      ]
    }
  ],

  'data-analyst': [
    {
      id: 'da-ch-1',
      title: 'SQL Sales Revenue & Customer Cohort Query',
      problemStatement: 'Write a PostgreSQL query using CTEs and window functions to calculate monthly recurring revenue (MRR) per user cohort.',
      difficulty: 'Beginner',
      skillTested: 'SQL Window Functions & CTEs',
      expectedOutput: 'Table showing Cohort Month, Total Active Users, Total Revenue, and % Month-over-Month Growth.',
      stageName: 'SQL & Database Queries',
      stageNumber: 1,
      unlocked: true,
      technicalQuestions: [
        {
          id: 'da-q-1',
          question: 'Which SQL window function assigns a unique sequential integer to rows partitioned by user group?',
          options: ['COUNT()', 'ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY date)', 'DENSE_RANK()', 'LEAD()'],
          correctIndex: 1,
          explanation: 'ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...) assigns sequential integers per partition.'
        }
      ]
    }
  ],

  'ai-engineer': [
    {
      id: 'ai-ch-1',
      title: 'Build an Asynchronous AI API Proxy Engine',
      problemStatement: 'Create a FastAPI microservice with Pydantic validation that proxies requests to LLM endpoints with exponential backoff retries.',
      difficulty: 'Beginner',
      skillTested: 'FastAPI & Async Python',
      expectedOutput: 'Running FastAPI server at localhost:8000 returning structured JSON LLM responses.',
      stageName: 'Python & Async APIs',
      stageNumber: 1,
      unlocked: true,
      technicalQuestions: [
        {
          id: 'ai-q-1',
          question: 'In Python asyncio, what keyword is required before invoking a non-blocking asynchronous function?',
          options: ['then', 'await', 'defer', 'yield'],
          correctIndex: 1,
          explanation: 'The `await` keyword pauses execution of the coroutine until the async task completes without blocking the main event loop.'
        }
      ]
    }
  ]
};

interface SkillChallengeSectionProps {
  targetRoleId: string | null;
  targetRoleName: string;
  showToast: (msg: string) => void;
}

export const SkillChallengeSection: React.FC<SkillChallengeSectionProps> = ({
  targetRoleId,
  targetRoleName,
  showToast,
}) => {
  const normRoleId = (targetRoleId || 'data-scientist').toLowerCase().replace(/^custom-/, '');
  const challenges: ChallengeItem[] = ROLE_CHALLENGES[normRoleId] || ROLE_CHALLENGES['data-scientist'];

  const [activeModalChallenge, setActiveModalChallenge] = useState<ChallengeItem | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({});

  const handleStartChallenge = (ch: ChallengeItem) => {
    setActiveModalChallenge(ch);
    setSelectedAnswers({});
    setSubmittedAnswers({});
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitQuestion = (questionId: string) => {
    setSubmittedAnswers((prev) => ({ ...prev, [questionId]: true }));
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-medium text-cyan-300 mb-2">
            <Trophy className="h-3.5 w-3.5 text-cyan-400" />
            <span>Post-Roadmap Skill Challenges</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-mono">
            Practical Skill Challenges for <span className="text-cyan-400">{targetRoleName}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Validate learning stage mastery with real-world problem statements and dynamic technical questions
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
          <Award className="h-4 w-4" />
          <span>{challenges.filter((c) => c.unlocked).length} Challenges Unlocked</span>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {challenges.map((ch) => (
          <div
            key={ch.id}
            className={`relative flex flex-col justify-between rounded-2xl border p-5 backdrop-blur-xl transition-all ${
              ch.unlocked
                ? 'border-cyan-500/30 bg-slate-900/80 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-950/40'
                : 'border-slate-800/80 bg-slate-950/40 opacity-70'
            }`}
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <span className="text-[10px] font-bold font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-full uppercase">
                  Stage {ch.stageNumber}: {ch.stageName}
                </span>

                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                    ch.difficulty === 'Beginner'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : ch.difficulty === 'Intermediate'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {ch.difficulty}
                </span>
              </div>

              {/* Title & Problem Statement */}
              <h3 className="text-sm font-extrabold text-white font-mono flex items-center space-x-2">
                <Terminal className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>{ch.title}</span>
              </h3>

              <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                {ch.problemStatement}
              </p>

              {/* Details List */}
              <div className="mt-4 space-y-2 text-[11px] bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Skill Tested:</span>
                  <span className="font-bold text-cyan-300">{ch.skillTested}</span>
                </div>

                <div className="border-t border-slate-800/60 pt-1.5">
                  <span className="text-slate-400 font-medium block mb-0.5">Expected Output:</span>
                  <span className="text-slate-300 italic">{ch.expectedOutput}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-5 pt-3 border-t border-slate-800">
              {ch.unlocked ? (
                <button
                  type="button"
                  onClick={() => handleStartChallenge(ch)}
                  className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-md hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Start Challenge & Technical Quiz</span>
                </button>
              ) : (
                <div className="flex items-center justify-center space-x-2 rounded-xl bg-slate-800/50 px-4 py-2.5 text-xs font-semibold text-slate-500">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Complete Previous Stage to Unlock</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CHALLENGE MODAL WITH TECHNICAL QUIZ */}
      {activeModalChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-cyan-500/40 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold font-mono text-cyan-400 uppercase tracking-wider">
                  Practical Skill Challenge
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white font-mono mt-1">
                  {activeModalChallenge.title}
                </h3>
              </div>

              <button
                onClick={() => setActiveModalChallenge(null)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Problem Statement Box */}
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 space-y-2">
              <div className="text-xs font-bold text-cyan-300 font-mono uppercase tracking-wider">
                Problem Statement
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {activeModalChallenge.problemStatement}
              </p>
              <div className="pt-2 text-xs text-slate-400 font-mono">
                <strong>Expected Output:</strong> {activeModalChallenge.expectedOutput}
              </div>
            </div>

            {/* Technical Questions Section */}
            <div className="space-y-5">
              <div className="flex items-center space-x-2 text-sm font-bold text-white font-mono border-b border-slate-800 pb-2">
                <HelpCircle className="h-4 w-4 text-purple-400" />
                <span>Technical Knowledge Check ({activeModalChallenge.technicalQuestions.length} Questions)</span>
              </div>

              {activeModalChallenge.technicalQuestions.map((q, qIdx) => {
                const selectedOpt = selectedAnswers[q.id];
                const isSubmitted = submittedAnswers[q.id];

                return (
                  <div key={q.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                    <div className="text-xs sm:text-sm font-semibold text-slate-200">
                      Q{qIdx + 1}: {q.question}
                    </div>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedOpt === optIdx;
                        const isCorrect = optIdx === q.correctIndex;

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium text-left transition-all ${
                              isSubmitted
                                ? isCorrect
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : isSelected
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                  : 'bg-slate-900/40 text-slate-500 border border-slate-800'
                                : isSelected
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                                : 'bg-slate-900/60 text-slate-300 border border-slate-800/80 hover:bg-slate-800'
                            }`}
                          >
                            <span>{opt}</span>
                            {isSubmitted && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {!isSubmitted && (
                      <button
                        type="button"
                        disabled={selectedOpt === undefined}
                        onClick={() => handleSubmitQuestion(q.id)}
                        className="flex items-center space-x-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1.5 text-xs font-bold hover:bg-cyan-500/30 disabled:opacity-40 transition-colors"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Submit Answer</span>
                      </button>
                    )}

                    {isSubmitted && (
                      <div className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800 mt-2">
                        <strong className="text-cyan-400 font-mono">Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  showToast('Challenge completed! Progress updated.');
                  setActiveModalChallenge(null);
                }}
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:scale-105 transition-all"
              >
                Close & Save Progress
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
