import React from 'react';
import { FolderGit2, ArrowUpRight } from 'lucide-react';

interface ProjectsPageProps {
  targetRole: string;
  showToast: (msg: string) => void;
}

const ROLE_PROJECTS: Record<string, Array<{
  title: string;
  description: string;
  skills: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}>> = {
  'Data Scientist': [
    {
      title: 'Customer Churn Prediction Engine',
      description: 'Build an end-to-end classification pipeline predicting 30-day user churn with feature importance and ROC-AUC evaluation.',
      skills: ['Python', 'Pandas', 'Scikit-Learn', 'Classification'],
      difficulty: 'Intermediate'
    },
    {
      title: 'Sales Volume Forecasting Model',
      description: 'Engineer lag features and rolling averages from daily store metrics to forecast next-week sales volume using XGBoost.',
      skills: ['Python', 'XGBoost', 'Feature Engineering', 'Time-Series'],
      difficulty: 'Advanced'
    }
  ],
  'Data Analyst': [
    {
      title: 'E-Commerce Funnel & Cohort Queries',
      description: 'Write PostgreSQL queries with window functions and CTEs to compute monthly recurring revenue and drop-off rates.',
      skills: ['SQL', 'Window Functions', 'Data Analysis'],
      difficulty: 'Beginner'
    },
    {
      title: 'Executive KPI Business Dashboard',
      description: 'Design an interactive Tableau/Power BI dashboard displaying user retention metrics and sales performance.',
      skills: ['Tableau', 'Power BI', 'Business Intelligence'],
      difficulty: 'Intermediate'
    }
  ],
  'AI Engineer': [
    {
      title: 'Async AI API Gateway Microservice',
      description: 'Build a FastAPI service with Pydantic validation proxying parallel requests to Gemini LLM endpoints with retry logic.',
      skills: ['Python', 'FastAPI', 'LLMs', 'APIs'],
      difficulty: 'Intermediate'
    },
    {
      title: 'Enterprise PDF Document RAG Engine',
      description: 'Chunk technical PDF manuals, generate dense vector embeddings, and build a semantic search retriever using Pinecone.',
      skills: ['RAG', 'Vector Databases', 'Embeddings', 'Python'],
      difficulty: 'Advanced'
    }
  ]
};

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ targetRole, showToast }) => {
  const projects = ROLE_PROJECTS[targetRole] || ROLE_PROJECTS['Data Scientist'];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-2">
        <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-medium text-cyan-300">
          <FolderGit2 className="h-3.5 w-3.5 text-cyan-400" />
          <span>Portfolio Projects</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
          Recommended Portfolio Projects for <span className="text-cyan-400">{targetRole}</span>
        </h1>
        <p className="text-xs text-slate-400">
          Hands-on projects designed to demonstrate core competencies to hiring managers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((proj, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-cyan-400 font-mono uppercase bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                  {proj.difficulty}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white font-mono">{proj.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {proj.skills.map((s, sIdx) => (
                  <span key={sIdx} className="rounded-md bg-slate-900 border border-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => showToast(`Started project: ${proj.title}`)}
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-bold text-white transition-colors"
            >
              <span>Start Portfolio Project</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
