"use client";

import { useState } from "react";
import Link from "next/link";
import UploadDropzone from "@/components/UploadDropzone";
import LoadingRoast from "@/components/LoadingRoast";
import ErrorMessage from "@/components/ErrorMessage";
import RoastResult from "@/components/RoastResult";
import { btnOutlineSm, btnPrimarySm } from "@/components/ui";
import { GENERIC_ERROR_MESSAGE, MAX_FILE_SIZE } from "@/lib/constants";
import { isPdfFile } from "@/lib/file";
import type { RoastResult as RoastResultType } from "@/types/roast";

type State = "idle" | "uploading" | "success" | "error";
// The API adds the saved row's id (null when signed out or the save failed).
type RoastResponse = RoastResultType & { id: string | null };

export default function ResumeUploader() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RoastResponse | null>(null);

  function fail(message: string) {
    setError(message);
    setState("error");
  }

  async function handleFile(file: File) {
    setError(null);

    if (!isPdfFile(file)) return fail("Please upload a PDF.");
    if (file.size > MAX_FILE_SIZE) return fail("Your resume is larger than 5 MB.");

    setState("uploading");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/roast", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return fail(data?.error?.message || GENERIC_ERROR_MESSAGE);
      }

      setResult(data.roast);
      setState("success");
    } catch {
      fail(GENERIC_ERROR_MESSAGE);
    }
  }

  if (state === "uploading") {
    return <LoadingRoast />;
  }

  if (state === "success" && result) {
    return (
      <div className="space-y-6">
        <RoastResult result={result} />
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              setState("idle");
              setResult(null);
            }}
            className={btnOutlineSm}
          >
            Roast Another Resume
          </button>
          {result.id && (
            <Link href={`/roast/${result.id}`} className={btnPrimarySm}>
              View Saved Roast
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {state === "error" && error && <ErrorMessage message={error} />}
      <UploadDropzone onFileSelected={handleFile} />
    </div>
  );
}
