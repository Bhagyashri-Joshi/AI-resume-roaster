"use client";

import { useRef, useState } from "react";

export default function UploadDropzone({ onFileSelected }: { onFileSelected: (file: File) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (files && files.length > 0) onFileSelected(files[0]);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl2 border-2 border-dashed p-12 text-center transition-colors ${
        isDragging ? "border-accent bg-accent/10" : "border-white/15 bg-panel hover:border-white/30"
      }`}
    >
      <div className="text-4xl">📄</div>
      <p className="font-semibold text-zinc-100">Drop your resume PDF here</p>
      <p className="text-sm text-zinc-400">or click to browse — PDF only, up to 5 MB</p>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
