import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ListOrdered, 
  UploadCloud, 
  BookOpen
} from 'lucide-react';
import { ExtractedResumeData } from './WelcomeSection';

interface PersonalizedLearningRoadmapProps {
  targetRole: string;
  targetRoleId?: string | null;
  isAnalyzed: boolean;
  extractedData: ExtractedResumeData | null;
  onNavigate?: (tab: string) => void;
}

export const ROLE_ROADMAP_TOPICS: Record<string, Array<{
  topicName: string;
  whatToLearn: string[];
}>> = {
  'data-scientist': [
    {
      topicName: 'Python',
      whatToLearn: ['Variables, Functions & Control Flow', 'List Comprehensions & Data Structures', 'Virtual Environments & Package Management']
    },
    {
      topicName: 'Statistics',
      whatToLearn: ['Descriptive Statistics & Standard Deviation', 'Probability Distributions (Normal, Binomial)', 'Hypothesis Testing, p-values & Confidence Intervals']
    },
    {
      topicName: 'SQL',
      whatToLearn: ['SELECT, WHERE, GROUP BY & HAVING', 'JOINs across multiple tables', 'Window Functions (ROW_NUMBER, LAG/LEAD) & CTEs']
    },
    {
      topicName: 'Pandas & NumPy',
      whatToLearn: ['DataFrame Indexing & Filtering', 'Handling Missing Data & Imputation', 'Grouping, Aggregation & Pivoting']
    },
    {
      topicName: 'Data Visualization',
      whatToLearn: ['Matplotlib & Seaborn Charting', 'Correlation Heatmaps & Outlier Detection', 'Exploratory Data Analysis (EDA) Best Practices']
    },
    {
      topicName: 'Machine Learning',
      whatToLearn: ['Supervised Learning (Regression & Classification)', 'Unsupervised Clustering (K-Means, PCA)', 'Scikit-Learn Model Pipelines']
    },
    {
      topicName: 'Model Evaluation',
      whatToLearn: ['Cross-Validation Techniques', 'Precision, Recall, F1-Score & ROC-AUC', 'Bias-Variance Tradeoff & Overfitting Prevention']
    },
    {
      topicName: 'Deployment',
      whatToLearn: ['FastAPI REST API Endpoint Creation', 'Docker Containerization for ML Models', 'Model Monitoring & Cloud Endpoint Serving']
    }
  ],

  'data-analyst': [
    {
      topicName: 'Excel',
      whatToLearn: ['Advanced Formulas (XLOOKUP, INDEX/MATCH)', 'Pivot Tables & Slicers', 'Data Formatting & Validation']
    },
    {
      topicName: 'SQL',
      whatToLearn: ['Database Querying & Joins', 'Aggregations & Grouping', 'CTEs & Window Functions']
    },
    {
      topicName: 'Statistics',
      whatToLearn: ['Descriptive Metrics & Percentiles', 'A/B Testing & Sample Sizes', 'Statistical Significance']
    },
    {
      topicName: 'Python/Pandas',
      whatToLearn: ['Data Cleaning & String Operations', 'Parsing CSV & Excel Files', 'Automating Data Preparation']
    },
    {
      topicName: 'Data Visualization',
      whatToLearn: ['Visual Hierarchy & Chart Selection', 'Designing Clear Business Dashboards', 'Storytelling with Data']
    },
    {
      topicName: 'Power BI/Tableau',
      whatToLearn: ['Interactive Dashboard Building', 'Data Modeling & DAX Measures', 'Calculated Fields & Slicers']
    },
    {
      topicName: 'Business Analysis',
      whatToLearn: ['Conversion Funnel Drop-off Analysis', 'User Retention Cohorts', 'Executive KPI Reporting']
    }
  ],

  'ai-engineer': [
    {
      topicName: 'Python',
      whatToLearn: ['Type Hinting & Pydantic Validation', 'Asyncio & Concurrent Execution', 'REST & gRPC Client Scripting']
    },
    {
      topicName: 'Machine Learning',
      whatToLearn: ['Supervised Models & Loss Functions', 'Evaluation Metrics', 'Feature Preparation']
    },
    {
      topicName: 'Deep Learning',
      whatToLearn: ['Neural Network Architectures', 'PyTorch Tensors & Autograd', 'Loss Functions & Optimizers']
    },
    {
      topicName: 'NLP/Computer Vision',
      whatToLearn: ['Tokenization & Embeddings', 'Transformers Architecture', 'Feature Extraction']
    },
    {
      topicName: 'APIs',
      whatToLearn: ['Gemini / OpenAI API Integration', 'FastAPI Microservice Servers', 'Rate Limiting & Error Retries']
    },
    {
      topicName: 'AI Application Development',
      whatToLearn: ['Prompt Engineering & Context Windows', 'RAG Architectures & Vector Stores (Pinecone/Chroma)', 'LangChain / AI Agents & Tool Calling']
    },
    {
      topicName: 'Deployment',
      whatToLearn: ['Dockerizing AI Services', 'Low-Latency Streaming Responses', 'Cloud Deployment']
    }
  ],

  'aiml-engineer': [
    {
      topicName: 'Python & Math',
      whatToLearn: ['NumPy Matrix Operations', 'Linear Algebra & Gradients', 'Vectorized Calculations']
    },
    {
      topicName: 'Machine Learning',
      whatToLearn: ['Decision Trees, Ensembles & XGBoost', 'Dimensionality Reduction (PCA)', 'Cross-Validation & Metric Tuning']
    },
    {
      topicName: 'Deep Learning',
      whatToLearn: ['PyTorch DataLoaders & Custom Datasets', 'Convolutional & Recurrent Nets', 'Transfer Learning']
    },
    {
      topicName: 'Feature Engineering',
      whatToLearn: ['Target Encoding & Scaling', 'Feature Selection Methods', 'Handling Imbalanced Data']
    },
    {
      topicName: 'Model Evaluation',
      whatToLearn: ['Hyperparameter Optimization (GridSearch)', 'Confusion Matrices & ROC Curves', 'Model Overfitting Prevention']
    },
    {
      topicName: 'MLOps',
      whatToLearn: ['Experiment Tracking with MLflow', 'Data & Model Versioning (DVC)', 'Automated ML Pipelines']
    },
    {
      topicName: 'Deployment',
      whatToLearn: ['FastAPI Inference Servers', 'Docker Containerization', 'ONNX Runtime & Low Latency Serving']
    }
  ],

  'software-dev': [
    {
      topicName: 'Data Structures & Algorithms',
      whatToLearn: ['Big O Time & Space Complexity', 'Arrays, Trees, Hash Tables & Graphs', 'Sorting & Searching Algorithms']
    },
    {
      topicName: 'TypeScript/JavaScript',
      whatToLearn: ['Type Safety, Interfaces & Generics', 'Async/Await & Promises', 'OOP SOLID Design Principles']
    },
    {
      topicName: 'Frontend Engineering',
      whatToLearn: ['React Hooks & Component Lifecycle', 'State Management & Context', 'Tailwind CSS Utility Styling']
    },
    {
      topicName: 'Backend Engineering',
      whatToLearn: ['Node.js & Express RESTful APIs', 'Middleware & JWT Authentication', 'Request Validation & Error Handling']
    },
    {
      topicName: 'Databases',
      whatToLearn: ['Relational Data Modeling (PostgreSQL)', 'SQL Queries & Indexing', 'ORM Querying']
    },
    {
      topicName: 'System Design & Testing',
      whatToLearn: ['Unit & Integration Testing (Jest/Vitest)', 'Modular Architecture Design', 'API Rate Limiting & Security']
    },
    {
      topicName: 'Deployment',
      whatToLearn: ['Dockerizing Applications', 'CI/CD Pipelines (GitHub Actions)', 'Production Cloud Hosting']
    }
  ],

  'data-engineer': [
    {
      topicName: 'SQL & Database Architecture',
      whatToLearn: ['Star & Snowflake Schema Design', 'Indexing & Query Optimization', 'Transactions & ACID Compliance']
    },
    {
      topicName: 'Python for Data Engineering',
      whatToLearn: ['Parquet, Avro & JSON File Formats', 'Database Drivers & ORMs', 'ETL Script Automation']
    },
    {
      topicName: 'Big Data Processing',
      whatToLearn: ['Apache Spark & PySpark DataFrames', 'Distributed Joins & Aggregations', 'Spark Performance Tuning']
    },
    {
      topicName: 'Workflow Orchestration',
      whatToLearn: ['Apache Airflow DAG Design', 'Task Scheduling & Dependencies', 'Error Alerts & Retries']
    },
    {
      topicName: 'Cloud Warehousing',
      whatToLearn: ['Snowflake / BigQuery Architecture', 'dbt Data Transformations', 'Columnar Storage Optimization']
    },
    {
      topicName: 'Streaming Data',
      whatToLearn: ['Apache Kafka Event Streaming', 'Real-Time Pipeline Architectures', 'Consumer Groups & Topics']
    }
  ],

  'nlp-engineer': [
    {
      topicName: 'Python & Text Preprocessing',
      whatToLearn: ['Tokenization, Lemmatization & Stemming', 'Regex & Text Cleaning', 'NLTK & spaCy Libraries']
    },
    {
      topicName: 'Embeddings & Vector Search',
      whatToLearn: ['TF-IDF & Word2Vec', 'Cosine Similarity Calculations', 'Vector Space Representation']
    },
    {
      topicName: 'Transformers',
      whatToLearn: ['Self-Attention Mechanism', 'Hugging Face Pipelines & Models', 'BERT & RoBERTa Architectures']
    },
    {
      topicName: 'Fine-Tuning LLMs',
      whatToLearn: ['Open-Source Models (Llama, Mistral)', 'Parameter-Efficient Fine-Tuning (PEFT)', 'LoRA / QLoRA Techniques']
    },
    {
      topicName: 'Deployment & RAG',
      whatToLearn: ['Vector Databases (Qdrant/Pinecone)', 'Retrieval-Augmented Generation', 'FastAPI NLP Inference Deployment']
    }
  ],

  'computer-vision-engineer': [
    {
      topicName: 'Digital Image Processing',
      whatToLearn: ['OpenCV Filtering & Blurring', 'Edge Detection (Canny, Sobel)', 'Contour Extraction & Transformations']
    },
    {
      topicName: 'Deep Learning & CNNs',
      whatToLearn: ['Convolutional Layers & Pooling', 'ResNet & EfficientNet Architectures', 'PyTorch Image Training']
    },
    {
      topicName: 'Object Detection',
      whatToLearn: ['YOLO (v8/v9) Architecture', 'Bounding Box Regression & IoU', 'Instance Segmentation (Mask R-CNN)']
    },
    {
      topicName: 'CUDA & Acceleration',
      whatToLearn: ['PyTorch GPU Memory Management', 'Mixed Precision Training (AMP)', 'CUDA Kernel Basics']
    },
    {
      topicName: 'Deployment',
      whatToLearn: ['TensorRT & ONNX Exporting', 'Model Quantization (FP16/INT8)', 'Low-Latency Camera Feed Processing']
    }
  ],

  'cloud-engineer': [
    {
      topicName: 'Linux & Bash',
      whatToLearn: ['Linux System Administration', 'Bash Shell Automation Scripts', 'Permissions & SSH Key Auth']
    },
    {
      topicName: 'Networking & Cloud',
      whatToLearn: ['AWS / GCP Cloud Services', 'VPC, Subnets & Route Tables', 'IAM Roles & Security Groups']
    },
    {
      topicName: 'Containerization',
      whatToLearn: ['Dockerfile Multi-Stage Optimization', 'Docker Compose Specs', 'Container Vulnerability Scanning']
    },
    {
      topicName: 'Infrastructure as Code',
      whatToLearn: ['Terraform Modules & HCL Syntax', 'State Files & Remote Locks', 'Provisioning Cloud Resources']
    },
    {
      topicName: 'Kubernetes & CI/CD',
      whatToLearn: ['Kubernetes Pods, Services & Ingress', 'Helm Charts', 'GitHub Actions CI/CD Workflows']
    }
  ]
};

export const PersonalizedLearningRoadmap: React.FC<PersonalizedLearningRoadmapProps> = ({
  targetRole,
  targetRoleId,
  isAnalyzed,
  extractedData,
  onNavigate,
}) => {

  if (!isAnalyzed || !extractedData) {
    return (
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-8 sm:p-12 text-center backdrop-blur-xl shadow-2xl space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <BookOpen className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-mono">
            Personalized Learning Roadmap
          </h2>
          <p className="text-sm font-semibold text-cyan-300 font-mono max-w-lg mx-auto">
            Upload and analyze your resume to generate your personalized learning roadmap.
          </p>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Your roadmap will map your current skills against <strong className="text-white">{targetRole}</strong> requirements and construct an ordered learning sequence.
          </p>
        </div>

        {onNavigate && (
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => onNavigate('Dashboard')}
              className="flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all cursor-pointer"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Go to Dashboard & Upload Resume</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  const detectedSkills = [
    ...(extractedData.detectedSkills || []),
    ...(extractedData.programmingLanguages || []),
    ...(extractedData.toolsAndTechnologies || []),
  ];

  const currentSkillsList = Array.from(new Set(detectedSkills));

  const normRoleId = (targetRoleId || 'data-scientist').toLowerCase().replace(/^custom-/, '');
  const masterTopics = ROLE_ROADMAP_TOPICS[normRoleId] || ROLE_ROADMAP_TOPICS['data-scientist'];

  const needToImproveList: string[] = extractedData.skillsToImprove && extractedData.skillsToImprove.length > 0
    ? extractedData.skillsToImprove.map((item: any) => typeof item === 'string' ? item : item.skill || item.name)
    : currentSkillsList.filter(sk => 
        masterTopics.some(top => top.topicName.toLowerCase().includes(sk.toLowerCase()) || sk.toLowerCase().includes(top.topicName.toLowerCase()))
      );

  const needToLearnList: string[] = extractedData.missingSkills && extractedData.missingSkills.length > 0
    ? extractedData.missingSkills
    : masterTopics
        .map((t) => t.topicName)
        .filter((topName) => !currentSkillsList.some((cs) => cs.toLowerCase().includes(topName.toLowerCase()) || topName.toLowerCase().includes(cs.toLowerCase())));

  const learningOrderTopics = masterTopics;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-purple-950/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-3">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        
        <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-medium text-cyan-300">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Personalized Learning Roadmap</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
          What to Learn for <span className="text-cyan-400">{targetRole}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Targeted skill path generated directly from your uploaded resume and <strong className="text-white">{targetRole}</strong> job requirements.
        </p>
      </div>

      {/* 3 SUMMARY CARDS: CURRENT SKILLS, NEED TO IMPROVE, NEED TO LEARN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* CARD 1: CURRENT SKILLS */}
        <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/60 p-5 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2 text-emerald-400 font-mono font-bold text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>CURRENT SKILLS</span>
            </div>
            <span className="rounded-full bg-emerald-950 border border-emerald-800 px-2 py-0.5 text-xs font-extrabold text-emerald-300">
              {currentSkillsList.length}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Skills already detected from your uploaded resume:</p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {currentSkillsList.length > 0 ? (
              currentSkillsList.map((sk, idx) => (
                <span
                  key={idx}
                  className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-200"
                >
                  {sk}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No skills detected</span>
            )}
          </div>
        </div>

        {/* CARD 2: NEED TO IMPROVE */}
        <div className="rounded-2xl border border-amber-500/30 bg-slate-900/60 p-5 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2 text-amber-400 font-mono font-bold text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>NEED TO IMPROVE</span>
            </div>
            <span className="rounded-full bg-amber-950 border border-amber-800 px-2 py-0.5 text-xs font-extrabold text-amber-300">
              {needToImproveList.length}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Found in resume but requiring deeper learning:</p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {needToImproveList.length > 0 ? (
              needToImproveList.map((sk, idx) => (
                <span
                  key={idx}
                  className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-200"
                >
                  {sk}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">None flagged for improvement</span>
            )}
          </div>
        </div>

        {/* CARD 3: NEED TO LEARN */}
        <div className="rounded-2xl border border-rose-500/30 bg-slate-900/60 p-5 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2 text-rose-400 font-mono font-bold text-sm">
              <XCircle className="h-4 w-4" />
              <span>NEED TO LEARN</span>
            </div>
            <span className="rounded-full bg-rose-950 border border-rose-800 px-2 py-0.5 text-xs font-extrabold text-rose-300">
              {needToLearnList.length}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Required for {targetRole} but missing from resume:</p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {needToLearnList.length > 0 ? (
              needToLearnList.map((sk, idx) => (
                <span
                  key={idx}
                  className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[11px] font-semibold text-rose-200"
                >
                  {sk}
                </span>
              ))
            ) : (
              <span className="text-xs text-emerald-400 font-semibold italic">All core skills detected!</span>
            )}
          </div>
        </div>

      </div>

      {/* 4. LEARNING ORDER */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
            <ListOrdered className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-mono">
              LEARNING ORDER
            </h2>
            <p className="text-xs text-slate-400">
              Recommended topic sequence for <strong className="text-cyan-300">{targetRole}</strong>
            </p>
          </div>
        </div>

        {/* Ordered Topic List */}
        <div className="space-y-4">
          {learningOrderTopics.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-3"
            >
              <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold border border-cyan-500/40 shrink-0">
                  {idx + 1}
                </span>
                <h3 className="text-base font-extrabold text-white font-mono">
                  {item.topicName}
                </h3>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-2">
                  What to learn:
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.whatToLearn.map((topic, tIdx) => (
                    <span
                      key={tIdx}
                      className="rounded-lg bg-slate-900 border border-slate-800/90 px-3 py-1.5 text-xs text-slate-200 font-medium"
                    >
                      • {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Take Quiz Button */}
        {onNavigate && (
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => onNavigate('Quiz')}
              className="flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all cursor-pointer"
            >
              <span>Take Quiz for {targetRole} →</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
