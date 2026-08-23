"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UploadDropzone from "@/components/UploadDropzone";
import LoadingRoast from "@/components/LoadingRoast";
import ErrorMessage from "@/components/ErrorMessage";
import RoastResult from "@/components/RoastResult";
import type { RoastResult as RoastResultType } from "@/types/roast";

type State = "idle" | "uploading" | "success" | "error";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function ResumeUploader() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RoastResultType | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const router = useRouter();

  async function handleFile(file: File) {
    setError(null);

    if (!file.name.toLowerCase().endsWith(".pdf") || (file.type && file.type !== "application/pdf")) {
      setError("Please upload a PDF.");
      setState("error");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Your resume is larger than 5 MB.");
      setState("error");
      return;
    }

    setState("uploading");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/roast", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data?.error?.message || "The roast machine is temporarily out of sarcasm. Please try again.");
        setState("error");
        return;
      }

      setResult(data.roast);
      setSavedId(data.roast.id);
      setState("success");
    } catch {
      setError("The roast machine is temporarily out of sarcasm. Please try again.");
      setState("error");
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
              setError(null);
            }}
            className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold hover:bg-white/5"
          >
            Roast Another Resume
          </button>
          {savedId && (
            <button
              onClick={() => router.push(`/roast/${savedId}`)}
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-ink hover:opacity-90"
            >
              View Saved Roast
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {state === "error" && error && <ErrorMessage message={error} />}
      <UploadDropzone onFileSelected={handleFile} disabled={(state as State) === "uploading"} />
    </div>
  );
}
