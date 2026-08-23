declare module "pdf-parse/lib/pdf-parse.js" {
  interface PdfParseResult {
    text: string;
    numpages?: number;
    numrender?: number;
    info?: Record<string, unknown>;
    metadata?: Record<string, unknown> | null;
    version?: string;
  }

  function pdfParse(data: Buffer): Promise<PdfParseResult>;

  export default pdfParse;
}