import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/api";
import { getUserId } from "@/lib/session";
import { extractResumeText, PdfExtractionError } from "@/lib/pdf";
import { generateResumeRoast } from "@/lib/roast";
import { LlmProviderError, type LlmErrorCode } from "@/lib/llm";
import { isPdfFile } from "@/lib/file";
import { MAX_FILE_SIZE } from "@/lib/constants";

export const runtime = "nodejs";
export const maxDuration = 60;

const LLM_STATUS: Record<LlmErrorCode, number> = {
  LLM_TIMEOUT: 502,
  LLM_RATE_LIMIT: 429,
  LLM_ERROR: 502,
  LLM_INVALID_JSON: 422,
};

export async function POST(req: NextRequest) {
  const startedAt = Date.now();

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return errorResponse(400, "INVALID_FILE", "Please upload a PDF.");
  }

  const file = formData.get("file");
  if (!(file instanceof File) || !isPdfFile(file) || file.size === 0) {
    return errorResponse(400, "INVALID_FILE", "Please upload a PDF.");
  }

  if (file.size > MAX_FILE_SIZE) {
    return errorResponse(413, "FILE_TOO_LARGE", "Your resume is larger than 5 MB.");
  }

  const userId = await getUserId();
  const buffer = Buffer.from(await file.arrayBuffer());

  let resumeText: string;
  try {
    resumeText = await extractResumeText(buffer);
  } catch (err) {
    if (err instanceof PdfExtractionError) {
      return errorResponse(422, err.code, err.message);
    }
    return errorResponse(500, "INTERNAL_ERROR", "Something went wrong. Please try again.");
  }

  let roastResult;
  try {
    roastResult = await generateResumeRoast(resumeText);
  } catch (err) {
    if (err instanceof LlmProviderError) {
      return errorResponse(LLM_STATUS[err.code], err.code, err.message);
    }
    return errorResponse(500, "INTERNAL_ERROR", "Something went wrong. Please try again.");
  }
  // resumeText and prompt/response are intentionally not logged.

  let savedId: string | null = null;
  let saveFailed = false;

  if (userId) {
    try {
      const saved = await prisma.roast.create({
        data: {
          userId,
          filename: file.name,
          overallScore: roastResult.overallScore,
          resultJson: roastResult,
        },
      });
      savedId = saved.id;
    } catch {
      saveFailed = true;
    }
  }

  // Safe, non-sensitive metadata only.
  console.log(
    JSON.stringify({
      event: "roast_generated",
      userId,
      fileSize: file.size,
      processingTimeMs: Date.now() - startedAt,
      saved: Boolean(savedId),
    })
  );

  return NextResponse.json({
    success: true,
    saveWarning: saveFailed
      ? "Your roast was generated, but we couldn't save it to your history."
      : undefined,
    roast: {
      id: savedId,
      ...roastResult,
    },
  });
}
