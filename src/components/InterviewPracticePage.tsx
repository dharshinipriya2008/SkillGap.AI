import React from 'react';
import { MessageSquareCode } from 'lucide-react';

interface InterviewPracticePageProps {
  targetRole: string;
  showToast: (msg: string) => void;
}

const ROLE_QUESTIONS: Record<string, Array<{ question: string; category: string; difficulty: string }>> = {
  'Data Scientist': [
    { question: 'What is the difference between L1 and L2 regularization, and how do they impact feature weights?', category: 'Machine Learning', difficulty: 'Intermediate' },
    { question: 'How do you handle severe class imbalance in a customer churn prediction dataset?', category: 'Data Science', difficulty: 'Intermediate' }
  ],
  'Data Analyst': [
    { question: 'Explain the difference between WHERE and HAVING clauses in SQL queries.', category: 'SQL', difficulty: 'Beginner' },
    { question: 'How do you calculate statistical significance in an A/B test?', category: 'Analytics', difficulty: 'Intermediate' }
  ],
  'AI Engineer': [
    { question: 'What distance metrics are most effective for vector search similarity in high-dimensional embedding spaces?', category: 'Vector Search', difficulty: 'Intermediate' },
    { question: 'Explain how RAG retrieval prevents model hallucinations.', category: 'LLMs', difficulty: 'Advanced' }
  ]
};

export const InterviewPracticePage: React.FC<InterviewPracticePageProps> = ({ targetRole, showToast }) => {
  const questions = ROLE_QUESTIONS[targetRole] || ROLE_QUESTIONS['Data Scientist'];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-2">
        <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-medium text-cyan-300">
          <MessageSquareCode className="h-3.5 w-3.5 text-cyan-400" />
          <span>Interview Practice</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
          Technical Interview Practice for <span className="text-cyan-400">{targetRole}</span>
        </h1>
        <p className="text-xs text-slate-400">
          Key technical interview questions commonly asked by senior hiring engineers.
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-cyan-400 font-mono uppercase bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                {q.category} • {q.difficulty}
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-white font-mono">Q{idx + 1}: {q.question}</h3>
            
            <button
              type="button"
              onClick={() => showToast('Practice answer recorded!')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
            >
              <span>Practice Answer →</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
