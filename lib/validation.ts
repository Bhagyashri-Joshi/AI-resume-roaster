import { z } from "zod";

export const CategoryScoresSchema = z.object({
  content: z.number().min(0).max(100),
  impact: z.number().min(0).max(100),
  clarity: z.number().min(0).max(100),
  ats: z.number().min(0).max(100),
  structure: z.number().min(0).max(100),
  skills: z.number().min(0).max(100),
  professionalism: z.number().min(0).max(100),
});

export const RoastIssueSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  severity: z.enum(["low", "medium", "high"]),
  roast: z.string().min(1),
  explanation: z.string().min(1),
  recommendation: z.string().min(1),
});

export const BulletRoastSchema = z.object({
  original: z.string().min(1),
  roast: z.string().min(1),
  improved: z.string().min(1),
  reason: z.string().min(1),
});

/** What we expect from the model. It never supplies overallScore; the backend computes it. */
export const RoastAnalysisSchema = z.object({
  summary: z.string().min(1),
  categoryScores: CategoryScoresSchema,
  topIssues: z.array(RoastIssueSchema).min(1).max(10),
  bulletRoasts: z.array(BulletRoastSchema).default([]),
  quickWins: z.array(z.string()).default([]),
  finalVerdict: z.string().min(1),
});

/** The full result stored in the database and returned to the client. */
export const RoastResultSchema = RoastAnalysisSchema.extend({
  overallScore: z.number().min(0).max(100),
});

/**
 * Strips markdown code fences the model may wrap around JSON output,
 * e.g. ```json { ... } ``` -> { ... }
 */
export function stripCodeFences(raw: string): string {
  const trimmed = raw.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenceMatch) return fenceMatch[1].trim();
  return trimmed;
}

export function safeParseRoastJson(raw: string) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(stripCodeFences(raw));
  } catch {
    return { success: false as const, error: "INVALID_JSON" as const };
  }
  const result = RoastAnalysisSchema.safeParse(parsed);
  if (!result.success) {
    return { success: false as const, error: "SCHEMA_INVALID" as const };
  }
  return { success: true as const, data: result.data };
}

type CategoryScores = z.infer<typeof CategoryScoresSchema>;

// Typed as Record<keyof CategoryScores, number> so adding/removing a category
// without updating the weights is a compile error.
const CATEGORY_WEIGHTS: Record<keyof CategoryScores, number> = {
  content: 0.25,
  impact: 0.2,
  clarity: 0.15,
  ats: 0.15,
  structure: 0.1,
  skills: 0.1,
  professionalism: 0.05,
};

export function calculateOverallScore(categoryScores: CategoryScores): number {
  const weighted = (Object.keys(CATEGORY_WEIGHTS) as (keyof CategoryScores)[]).reduce(
    (sum, key) => sum + categoryScores[key] * CATEGORY_WEIGHTS[key],
    0
  );
  return Math.max(0, Math.min(100, Math.round(weighted)));
}
