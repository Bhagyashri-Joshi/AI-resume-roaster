import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/session";
import RoastHistory from "@/components/RoastHistory";
import type { HistoryItem } from "@/types/roast";

const HISTORY_LIMIT = 100;

export default async function HistoryPage() {
  const userId = await getUserId();
  if (!userId) redirect("/login");

  const roasts = await prisma.roast.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: HISTORY_LIMIT,
    select: { id: true, filename: true, overallScore: true, createdAt: true, resultJson: true },
  });

  const items: HistoryItem[] = roasts.map((r) => ({
    id: r.id,
    filename: r.filename,
    overallScore: r.overallScore,
    createdAt: r.createdAt.toISOString(),
    summary: (r.resultJson as { summary?: string } | null)?.summary ?? "",
  }));

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-black">Roast History</h1>
      <p className="mt-2 text-zinc-400">All your past roasts, newest first.</p>
      <div className="mt-8">
        <RoastHistory initialItems={items} />
      </div>
    </div>
  );
}
