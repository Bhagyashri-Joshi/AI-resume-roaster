import Link from "next/link";
import RoastResult from "@/components/RoastResult";
import { exampleRoast } from "@/lib/exampleRoast";
import { btnPrimary } from "@/components/ui";

export default function ExampleRoastPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">Example roast</p>
        <h1 className="mt-2 text-3xl font-black">A sample resume, thoroughly toasted</h1>
        <p className="mt-2 text-zinc-400">This is what your feedback could look like after an analysis.</p>
      </div>

      <RoastResult result={exampleRoast} />

      <div className="mt-8 text-center">
        <Link href="/roast" className={`inline-block ${btnPrimary}`}>
          Roast My Resume
        </Link>
      </div>
    </div>
  );
}
