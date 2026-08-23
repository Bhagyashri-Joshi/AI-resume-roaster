"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface HistoryItem {
  id: string;
  filename: string;
  overallScore: number;
  createdAt: string;
  summary: string;
}

export default function RoastHistory() {
  const [items, setItems] = useState<HistoryItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          setError(data?.error?.message || "Couldn't load your history.");
          return;
        }
        setItems(data.roasts);
      })
      .catch(() => setError("Couldn't load your history."));
  }, []);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/roast/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => (prev ? prev.filter((item) => item.id !== id) : prev));
      }
    } finally {
      setDeletingId(null);
    }
  }

  if (error) {
    return <p className="text-sm text-red-300">{error}</p>;
  }

  if (!items) {
    return <p className="text-sm text-zinc-400">Loading your roast history...</p>;
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-zinc-400">
        No roasts yet.{" "}
        <Link href="/roast" className="text-accent underline">
          Roast your first resume
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-3 rounded-xl2 border border-white/10 bg-panel p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-semibold">{item.filename}</p>
            <p className="mt-1 text-sm text-zinc-400">{item.summary}</p>
            <p className="mt-1 text-xs text-zinc-500">
              {new Date(item.createdAt).toLocaleDateString()} · Score {item.overallScore}/100
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link
              href={`/roast/${item.id}`}
              className="rounded-full border border-white/15 px-4 py-1.5 text-sm font-semibold hover:bg-white/5"
            >
              View
            </Link>
            <button
              onClick={() => handleDelete(item.id)}
              disabled={deletingId === item.id}
              className="rounded-full border border-red-500/30 px-4 py-1.5 text-sm font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-50"
            >
              {deletingId === item.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
