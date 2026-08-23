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

export const RoastResultSchema = z.object({
  overallScore: z.number().min(0).max(100).optional(),
  summary: z.string().min(1),
  categoryScores: CategoryScoresSchema,
  topIssues: z.array(RoastIssueSchema).min(1).max(10),
  bulletRoasts: z.array(BulletRoastSchema).default([]),
  quickWins: z.array(z.string()).default([]),
  finalVerdict: z.string().min(1),
});

export type ValidatedRoastResult = z.infer<typeof RoastResultSchema>;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const MIN_EXTRACTED_TEXT_LENGTH = 200;

export function isPdfFile(file: File): boolean {
  const nameOk = file.name.toLowerCase().endsWith(".pdf");
  const typeOk = file.type === "application/pdf" || file.type === "";
  return nameOk && typeOk;
}

export function isWithinSizeLimit(file: File): boolean {
  return file.size > 0 && file.size <= MAX_FILE_SIZE;
}

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
  const cleaned = stripCodeFences(raw);
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return { success: false as const, error: "INVALID_JSON" as const };
  }
  const result = RoastResultSchema.safeParse(parsed);
  if (!result.success) {
    return { success: false as const, error: "SCHEMA_INVALID" as const };
  }
  return { success: true as const, data: result.data };
}

const CATEGORY_WEIGHTS = {
  content: 0.25,
  impact: 0.2,
  clarity: 0.15,
  ats: 0.15,
  structure: 0.1,
  skills: 0.1,
  professionalism: 0.05,
} as const;

export function calculateOverallScore(categoryScores: z.infer<typeof CategoryScoresSchema>): number {
  const weighted =
    categoryScores.content * CATEGORY_WEIGHTS.content +
    categoryScores.impact * CATEGORY_WEIGHTS.impact +
    categoryScores.clarity * CATEGORY_WEIGHTS.clarity +
    categoryScores.ats * CATEGORY_WEIGHTS.ats +
    categoryScores.structure * CATEGORY_WEIGHTS.structure +
    categoryScores.skills * CATEGORY_WEIGHTS.skills +
    categoryScores.professionalism * CATEGORY_WEIGHTS.professionalism;

  return Math.max(0, Math.min(100, Math.round(weighted)));
}
