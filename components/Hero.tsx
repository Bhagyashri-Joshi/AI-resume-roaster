import Link from "next/link";
import HeroAnimation from "@/components/HeroAnimation";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-5xl items-center gap-10 px-6 pb-16 pt-20 sm:grid-cols-2">
      <div className="text-center sm:text-left">
        <h1 className="text-4xl font-black leading-tight sm:text-5xl">
          Your resume called. It wants to know why you listed{" "}
          <span className="text-accent">Microsoft Word</span> as a skill.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-zinc-400 sm:mx-0">
          Upload your resume. Get roasted. Get better.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
          <Link
            href="/roast"
            className="rounded-full bg-accent px-6 py-3 font-bold text-ink hover:opacity-90"
          >
            Roast My Resume
          </Link>
          <Link
            href="#example"
            className="rounded-full border border-white/15 px-6 py-3 font-semibold hover:bg-white/5"
          >
            View Example Roast
          </Link>
        </div>
      </div>

      <HeroAnimation />
    </section>
  );
}