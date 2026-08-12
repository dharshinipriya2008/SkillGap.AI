export type SkillCategory = 'Programming' | 'Data Science' | 'Machine Learning' | 'Tools' | 'Soft Skills';

export type SkillLevelStatus = 'Strong' | 'Needs Improvement' | 'Missing';

export interface CategoryProgress {
  category: SkillCategory;
  score: number; // 0 to 100
  totalSkills: number;
  masteredSkills: number;
  iconName: string;
  color: string;
  bgGlow: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  status: SkillLevelStatus;
  proficiency: number; // 0 - 100%
  importance: 'Critical' | 'High' | 'Medium';
  demandGrowth: string; // e.g., "+24% YoY"
  description: string;
}

export interface RoadmapStep {
  id: string;
  stepNumber: number;
  title: string;
  status: 'Mastered' | 'In Progress' | 'Up Next' | 'Locked';
  estimatedTime: string;
  skillsCovered: string[];
  description: string;
  resources: { name: string; url: string; type: 'Course' | 'Docs' | 'Practice' }[];
}

export interface RecommendedProject {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  tags: string[];
  bridgesGaps: string[];
  githubTemplateUrl?: string;
  completed?: boolean;
}

export interface ActivityItem {
  id: string;
  title: string;
  type: 'course' | 'quiz' | 'analysis' | 'project' | 'interview';
  timestamp: string;
  badgeText: string;
  badgeColor: string;
}

export interface TargetRoleProfile {
  roleId: string;
  roleName: string;
  jobReadinessScore: number;
  skillsMatchedCount: number;
  skillsMissingCount: number;
  skillsToImproveCount: number;
  targetSalaryRange: string;
  jobPostingsCount: number;
  categories: CategoryProgress[];
  skills: SkillItem[];
  roadmap: RoadmapStep[];
  projects: RecommendedProject[];
  activities: ActivityItem[];
}
