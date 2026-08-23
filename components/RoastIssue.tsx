import type { RoastIssue as RoastIssueType } from "@/types/roast";

const SEVERITY_STYLES: Record<RoastIssueType["severity"], string> = {
  high: "bg-red-500/15 text-red-300 border-red-500/30",
  medium: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  low: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

export default function RoastIssue({ issue }: { issue: RoastIssueType }) {
  return (
    <div className="rounded-xl2 border border-white/10 bg-panel p-5">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase ${SEVERITY_STYLES[issue.severity]}`}
        >
          {issue.severity}
        </span>
        <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-xs text-zinc-300">
          {issue.category}
        </span>
      </div>
      <h4 className="text-base font-bold">{issue.title}</h4>
      <p className="mt-2 italic text-accent2">&ldquo;{issue.roast}&rdquo;</p>
      <p className="mt-2 text-sm text-zinc-300">{issue.explanation}</p>
      <p className="mt-3 rounded-lg bg-white/5 px-3 py-2 text-sm text-zinc-200">
        <span className="font-semibold text-accent">Fix it: </span>
        {issue.recommendation}
      </p>
    </div>
  );
}
