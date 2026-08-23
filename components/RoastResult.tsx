import ScoreCard from "@/components/ScoreCard";
import CategoryScores from "@/components/CategoryScores";
import RoastIssue from "@/components/RoastIssue";
import FeedbackCard from "@/components/FeedbackCard";
import type { RoastResult as RoastResultType } from "@/types/roast";

export default function RoastResult({ result }: { result: RoastResultType }) {
  return (
    <div className="space-y-8">
      <ScoreCard score={result.overallScore} summary={result.summary} />

      <CategoryScores scores={result.categoryScores} />

      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400">
          Top Problems
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {result.topIssues.map((issue, i) => (
            <RoastIssue key={i} issue={issue} />
          ))}
        </div>
      </section>

      {result.bulletRoasts.length > 0 && (
        <section>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400">
            Bullet Point Roasts
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {result.bulletRoasts.map((bullet, i) => (
              <FeedbackCard key={i} bullet={bullet} />
            ))}
          </div>
        </section>
      )}

      {result.quickWins.length > 0 && (
        <section className="rounded-xl2 border border-white/10 bg-panel p-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-400">
            Quick Wins
          </h3>
          <ul className="space-y-2">
            {result.quickWins.map((win, i) => (
              <li key={i} className="flex gap-2 text-sm text-zinc-200">
                <span className="text-accent">✓</span>
                {win}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl2 border border-accent/30 bg-accent/10 p-6">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
          Final Verdict
        </h3>
        <p className="text-zinc-100">{result.finalVerdict}</p>
      </section>
    </div>
  );
}
