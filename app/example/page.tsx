"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingRoast from "@/components/LoadingRoast";
import RoastResult from "@/components/RoastResult";
import type { RoastResult as RoastResultType } from "@/types/roast";

export default function ExampleRoastPage() {
  const [roast, setRoast] = useState<RoastResultType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadExample() {
      try {
        const response = await fetch("/api/example");
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error("We couldn't load the example roast.");
        }
        if (!cancelled) {
          setRoast(data.roast);
        }
      } catch {
        if (!cancelled) {
          setError("We couldn't load the example roast. Please try again.");
        }
      }
    }

    loadExample();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">Example roast</p>
        <h1 className="mt-2 text-3xl font-black">A sample resume, thoroughly toasted</h1>
        <p className="mt-2 text-zinc-400">This is what your feedback could look like after an analysis.</p>
      </div>

      {error && (
        <div className="space-y-4">
          <ErrorMessage message={error} />
          <button
            onClick={() => window.location.reload()}
            className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold hover:bg-white/5"
          >
            Try again
          </button>
        </div>
      )}
      {!error && !roast && <LoadingRoast />}
      {roast && (
        <>
          <RoastResult result={roast} />
          <div className="mt-8 text-center">
            <Link
              href="/roast"
              className="inline-block rounded-full bg-accent px-6 py-3 font-bold text-ink hover:opacity-90"
            >
              Roast My Resume
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
