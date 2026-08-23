export type Severity = "low" | "medium" | "high";

export interface RoastIssue {
  title: string;
  category: string;
  severity: Severity;
  roast: string;
  explanation: string;
  recommendation: string;
}

export interface BulletRoast {
  original: string;
  roast: string;
  improved: string;
  reason: string;
}

export interface CategoryScores {
  content: number;
  impact: number;
  clarity: number;
  ats: number;
  structure: number;
  skills: number;
  professionalism: number;
}

export interface RoastResult {
  overallScore: number;
  summary: string;
  categoryScores: CategoryScores;
  topIssues: RoastIssue[];
  bulletRoasts: BulletRoast[];
  quickWins: string[];
  finalVerdict: string;
}

export interface SavedRoast {
  id: string;
  filename: string;
  overallScore: number;
  createdAt: string;
  result: RoastResult;
}
