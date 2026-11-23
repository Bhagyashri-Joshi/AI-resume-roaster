import type { z } from "zod";
import type {
  BulletRoastSchema,
  CategoryScoresSchema,
  RoastIssueSchema,
  RoastResultSchema,
} from "@/lib/validation";

// Types are derived from the Zod schemas so there is a single source of truth.
export type RoastIssue = z.infer<typeof RoastIssueSchema>;
export type Severity = RoastIssue["severity"];
export type BulletRoast = z.infer<typeof BulletRoastSchema>;
export type CategoryScores = z.infer<typeof CategoryScoresSchema>;
export type RoastResult = z.infer<typeof RoastResultSchema>;

/** One row of the history list. */
export interface HistoryItem {
  id: string;
  filename: string;
  overallScore: number;
  createdAt: string; // ISO string
  summary: string;
}
