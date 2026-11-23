import { card, sectionLabel } from "@/components/ui";
import type { CategoryScores as CategoryScoresType } from "@/types/roast";

const LABELS: Record<keyof CategoryScoresType, string> = {
  content: "Content",
  impact: "Impact",
  clarity: "Clarity",
  ats: "ATS Compatibility",
  structure: "Structure",
  skills: "Skills",
  professionalism: "Professionalism",
};

export default function CategoryScores({ scores }: { scores: CategoryScoresType }) {
  return (
    <div className={`${card} p-6`}>
      <h3 className={`mb-4 ${sectionLabel}`}>Category Scores</h3>
      <div className="space-y-4">
        {(Object.keys(LABELS) as (keyof CategoryScoresType)[]).map((key) => (
          <div key={key}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-zinc-300">{LABELS[key]}</span>
              <span className="font-semibold">{scores[key]}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${scores[key]}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
