import { MAX_FILE_SIZE } from "@/lib/constants";

// Used by both the upload UI and the /api/roast route so the rules never drift apart.
export function isPdfFile(file: File): boolean {
  const nameOk = file.name.toLowerCase().endsWith(".pdf");
  const typeOk = file.type === "application/pdf" || file.type === "";
  return nameOk && typeOk;
}

export function isWithinSizeLimit(file: File): boolean {
  return file.size > 0 && file.size <= MAX_FILE_SIZE;
}
