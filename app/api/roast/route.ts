import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractResumeText, PdfExtractionError } from "@/lib/pdf";
import { generateResumeRoast, RoastGenerationError } from "@/lib/roast";
import { isPdfFile, isWithinSizeLimit, MAX_FILE_SIZE } from "@/lib/validation";

export const runtime = "nodejs";
export const maxDuration = 60;

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json({ success: false, error: { code, message } }, { status });
}

export async function POST(req: NextRequest) {
  const startedAt = Date.now();

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return errorResponse(400, "INVALID_FILE", "Please upload a PDF.");
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return errorResponse(400, "INVALID_FILE", "Please upload a PDF.");
  }

  if (!isPdfFile(file)) {
    return errorResponse(400, "INVALID_FILE", "Please upload a PDF.");
  }

  if (file.size > MAX_FILE_SIZE) {
    return errorResponse(413, "FILE_TOO_LARGE", "Your resume is larger than 5 MB.");
  }

  if (!isWithinSizeLimit(file)) {
    return errorResponse(400, "INVALID_FILE", "Please upload a PDF.");
  }

  const session = await getServerSession(authOptions);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let resumeText: string;
  try {
    resumeText = await extractResumeText(buffer);
  } catch (err) {
    if (err instanceof PdfExtractionError) {
      const status = 422;
      return errorResponse(status, err.code, err.message);
    }
    return errorResponse(422, "PDF_PARSE_ERROR", "We couldn't read this PDF. Try exporting it again as a standard PDF.");
  }

  let roastResult;
  try {
    roastResult = await generateResumeRoast(resumeText);
  } catch (err) {
    if (err instanceof RoastGenerationError) {
      const statusByCode: Record<string, number> = {
        LLM_TIMEOUT: 502,
        LLM_RATE_LIMIT: 429,
        LLM_ERROR: 502,
        LLM_INVALID_JSON: 422,
      };
      return errorResponse(statusByCode[err.code] ?? 502, err.code, err.message);
    }
    return errorResponse(500, "INTERNAL_ERROR", "Something went wrong. Please try again.");
  }
  // resumeText and prompt/response are intentionally not logged.

  let savedId: string | null = null;
  let saveFailed = false;

  if (session?.user && (session.user as { id?: string }).id) {
    try {
      const saved = await prisma.roast.create({
        data: {
          userId: (session.user as { id: string }).id,
          filename: file.name,
          overallScore: roastResult.overallScore,
          resultJson: roastResult as unknown as object,
        },
      });
      savedId = saved.id;
    } catch {
      saveFailed = true;
    }
  }

  const processingTime = Date.now() - startedAt;
  // Safe, non-sensitive metadata only.
  console.log(
    JSON.stringify({
      event: "roast_generated",
      userId: (session?.user as { id?: string })?.id ?? null,
      fileSize: file.size,
      processingTimeMs: processingTime,
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
