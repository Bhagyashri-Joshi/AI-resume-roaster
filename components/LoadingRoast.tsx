"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Uploading your resume...",
  "Reading between the lines...",
  "Finding corporate buzzwords...",
  "Counting how many times you said 'synergy'...",
  "Preparing the roast...",
];

export default function LoadingRoast() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl2 border border-white/10 bg-panel p-12 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-accent" />
      <p className="text-zinc-300">{MESSAGES[index]}</p>
    </div>
  );
}
