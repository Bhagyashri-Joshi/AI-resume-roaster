import { MIN_EXTRACTED_TEXT_LENGTH } from "@/lib/validation";

export class PdfExtractionError extends Error {
  code: "PDF_PARSE_ERROR" | "EMPTY_RESUME" | "SCANNED_PDF";
  constructor(code: "PDF_PARSE_ERROR" | "EMPTY_RESUME" | "SCANNED_PDF", message: string) {
    super(message);
    this.code = code;
  }
}

function normalizeWhitespace(raw: string): string {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}

/**
 * Extracts and normalizes text from a PDF buffer.
 * Does not aggressively rewrite content -- the LLM needs to see
 * the resume close to as-authored.
 */
export async function extractResumeText(buffer: Buffer): Promise<string> {
  // pdf-parse ships a debug entry point that tries to read a local test
  // file when required at the package root, so we import its lib build
  // directly to avoid that side effect in serverless environments.
  const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;

  let text: string;
  try {
    const result = await pdfParse(buffer);
    text = result.text ?? "";
  } catch (err) {
    throw new PdfExtractionError("PDF_PARSE_ERROR", "We couldn't read this PDF. Try exporting it again as a standard PDF.");
  }

  const normalized = normalizeWhitespace(text);

  if (normalized.length === 0) {
    throw new PdfExtractionError(
      "SCANNED_PDF",
      "We couldn't extract readable text from this PDF. Try uploading a text-based PDF."
    );
  }

  if (normalized.length < MIN_EXTRACTED_TEXT_LENGTH) {
    throw new PdfExtractionError(
      "EMPTY_RESUME",
      "This resume doesn't have enough readable content to analyze."
    );
  }

  return normalized;
}
