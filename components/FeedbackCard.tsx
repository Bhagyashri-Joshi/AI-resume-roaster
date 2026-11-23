import { card } from "@/components/ui";
import type { BulletRoast } from "@/types/roast";

export default function FeedbackCard({ bullet }: { bullet: BulletRoast }) {
  return (
    <div className={`${card} p-5`}>
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Original</p>
      <p className="mt-1 text-sm text-zinc-300 line-through decoration-red-400/60">{bullet.original}</p>

      <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">Roast</p>
      <p className="mt-1 italic text-accent2">&ldquo;{bullet.roast}&rdquo;</p>

      <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">Improved</p>
      <p className="mt-1 text-sm font-medium text-emerald-300">{bullet.improved}</p>

      <p className="mt-2 text-xs text-zinc-400">{bullet.reason}</p>
    </div>
  );
}
