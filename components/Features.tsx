import { card } from "@/components/ui";

const FEATURES = [
  "Specific feedback based on your actual resume",
  "Prioritized problems, not generic advice",
  "Funny, memorable commentary",
  "Concrete rewritten bullet examples",
  "Structured score across 7 categories",
  "Save and revisit past roasts with Google sign-in",
];

export default function Features() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h2 className="text-center text-2xl font-bold">What you get</h2>
      <ul className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <li key={f} className={`${card} flex items-start gap-2 p-4 text-sm text-zinc-200`}>
            <span className="text-accent">✓</span>
            {f}
          </li>
        ))}
      </ul>
    </section>
  );
}
