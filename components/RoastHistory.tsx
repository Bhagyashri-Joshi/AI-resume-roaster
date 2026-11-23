"use client";

import Link from "next/link";
import { useState } from "react";
import LocalDate from "@/components/LocalDate";
import { card } from "@/components/ui";
import type { HistoryItem } from "@/types/roast";

export default function RoastHistory({ initialItems }: { initialItems: HistoryItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/roast/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error();
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError("Couldn't delete that roast. Please try again.");
    } finally {
      setDeletingId(null);
    }
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
      {error && <p className="text-sm text-red-300">{error}</p>}
      {items.map((item) => (
        <div
          key={item.id}
          className={`${card} flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between`}
        >
          <div>
            <p className="font-semibold">{item.filename}</p>
            <p className="mt-1 text-sm text-zinc-400">{item.summary}</p>
            <p className="mt-1 text-xs text-zinc-500">
              <LocalDate iso={item.createdAt} /> · Score {item.overallScore}/100
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
