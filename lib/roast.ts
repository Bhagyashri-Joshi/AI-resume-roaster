import { completeChat, LlmProviderError } from "@/lib/llm";
import { GENERIC_ERROR_MESSAGE } from "@/lib/constants";
import { calculateOverallScore, safeParseRoastJson } from "@/lib/validation";
import type { RoastResult } from "@/types/roast";

// ---------------------------------------------------------------------------
// Four-layer prompt: Context -> Instruction -> Format -> Example
// ---------------------------------------------------------------------------

const CONTEXT_LAYER = `You are an expert resume reviewer with a sharp, witty sense of humor.
You analyze resumes for clarity, impact, ATS compatibility, professionalism, and hiring effectiveness.
Your humor should target the resume's content and choices, never the person. Never insult the candidate,
never make discriminatory comments, never attack protected characteristics, and never give unsafe or
illegal advice.`;

const INSTRUCTION_LAYER = `Analyze the resume text provided by the user. Identify:
- weak bullet points
- vague claims
- missing metrics or quantification
- unnecessary or filler content
- ATS (applicant tracking system) risks
- skill issues (generic, missing, or unprioritized skills)
- formatting/content problems
- grammar issues
- opportunities for improvement

Be specific to THIS resume. Do not give generic advice like "use stronger action verbs" without
pointing to the exact text that has the problem. Do not invent facts about the candidate that are
not present in the resume text.`;

const FORMAT_LAYER = `Return ONLY valid JSON. Do not include markdown formatting, do not include
\`\`\`json code fences, and do not include any commentary, preamble, or explanation outside the JSON object.

The JSON must match this exact schema:

{
  "summary": string,
  "categoryScores": {
    "content": number (0-100),
    "impact": number (0-100),
    "clarity": number (0-100),
    "ats": number (0-100),
    "structure": number (0-100),
    "skills": number (0-100),
    "professionalism": number (0-100)
  },
  "topIssues": [
    {
      "title": string,
      "category": string,
      "severity": "low" | "medium" | "high",
      "roast": string,
      "explanation": string,
      "recommendation": string
    }
  ] (3 to 7 items, prioritized by severity),
  "bulletRoasts": [
    {
      "original": string,
      "roast": string,
      "improved": string,
      "reason": string
    }
  ] (2 to 5 items, drawn from the weakest bullets in the resume),
  "quickWins": string[] (3 to 6 short actionable items),
  "finalVerdict": string (2-3 sentences, funny but constructive)
}

Do not include an "overallScore" field -- the backend calculates it from categoryScores.`;

const EXAMPLE_LAYER = `Example of a valid response (structure only, do not copy the content):

{
  "summary": "Your resume isn't terrible. It's just currently applying for jobs with the confidence of a potato.",
  "categoryScores": {
    "content": 76,
    "impact": 61,
    "clarity": 84,
    "ats": 69,
    "structure": 82,
    "skills": 70,
    "professionalism": 88
  },
  "topIssues": [
    {
      "title": "Bullet points describe duties, not achievements",
      "category": "Content",
      "severity": "high",
      "roast": "This bullet point contains 47 words and somehow manages to say absolutely nothing. Impressive efficiency in the wrong direction.",
      "explanation": "Most bullets list responsibilities without showing outcomes or scale.",
      "recommendation": "Rewrite each bullet as: action verb + what you built + measurable result."
    }
  ],
  "bulletRoasts": [
    {
      "original": "Worked on web applications.",
      "roast": "Ah yes, 'worked on web applications' -- technically true, spiritually useless.",
      "improved": "Built and deployed 3 React applications used by 500+ monthly users.",
      "reason": "Adds scope, technology, and measurable impact."
    }
  ],
  "quickWins": [
    "Add metrics to at least 3 bullet points.",
    "Remove the objective statement, it's 2005-coded."
  ],
  "finalVerdict": "Solid bones, weak muscle. Add numbers and specificity and this resume gets a callback."
}`;

const SYSTEM_PROMPT = [CONTEXT_LAYER, INSTRUCTION_LAYER, FORMAT_LAYER, EXAMPLE_LAYER].join("\n\n");

function buildUserPrompt(resumeText: string): string {
  return `Here is the resume text to analyze:\n\n"""\n${resumeText}\n"""`;
}

async function requestRoastCompletion(resumeText: string): Promise<string> {
  return completeChat([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: buildUserPrompt(resumeText) },
  ]);
}

/**
 * generateResumeRoast(resumeText)
 *
 * Calls the LLM provider, extracts JSON from the response, validates it
 * against the Zod schema, and computes the final weighted score
 * server-side rather than trusting a model-provided overall score.
 *
 * Retries once on invalid/malformed output before surfacing a
 * controlled error.
 */
export async function generateResumeRoast(resumeText: string): Promise<RoastResult> {
  let lastError: LlmProviderError | null = null;

  for (let attempt = 1; attempt <= 2; attempt++) {
    let raw: string;
    try {
      raw = await requestRoastCompletion(resumeText);
    } catch (err) {
      if (err instanceof LlmProviderError) {
        // Timeouts and rate limits are not worth retrying immediately.
        if (err.code === "LLM_TIMEOUT" || err.code === "LLM_RATE_LIMIT") throw err;
        lastError = err;
      } else {
        lastError = new LlmProviderError("LLM_ERROR", GENERIC_ERROR_MESSAGE);
      }
      continue;
    }

    const parsed = safeParseRoastJson(raw);
    if (!parsed.success) {
      lastError = new LlmProviderError(
        "LLM_INVALID_JSON",
        "Something went wrong while generating your roast. Please try again."
      );
      continue;
    }

    return {
      overallScore: calculateOverallScore(parsed.data.categoryScores),
      ...parsed.data,
    };
  }

  throw lastError ?? new LlmProviderError("LLM_ERROR", GENERIC_ERROR_MESSAGE);
}
