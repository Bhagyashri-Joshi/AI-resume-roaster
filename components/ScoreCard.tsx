import ScoreCircle from "@/components/ScoreCircle";

export default function ScoreCard({ score, summary }: { score: number; summary: string }) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-xl2 border border-white/10 bg-panel p-8 text-center sm:flex-row sm:text-left">
      <ScoreCircle score={score} />
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Overall Score</p>
        <p className="mt-2 text-lg text-zinc-200">{summary}</p>
      </div>
    </div>
  );
}
