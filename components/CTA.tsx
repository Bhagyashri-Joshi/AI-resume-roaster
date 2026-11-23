import Link from "next/link";
import { btnPrimary } from "@/components/ui";

export default function CTA() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 text-center">
      <div className="rounded-xl2 border border-accent/30 bg-accent/10 p-10">
        <h2 className="text-2xl font-bold">Ready to find out the truth?</h2>
        <p className="mt-2 text-zinc-300">It only takes a minute, and it&apos;s free.</p>
        <Link
          href="/roast"
          className={`mt-6 inline-block ${btnPrimary}`}
        >
          Roast My Resume
        </Link>
      </div>
    </section>
  );
}
