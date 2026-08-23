const DOC_LINES: { width: string; bold?: boolean }[] = [
  { width: "62%", bold: true },
  { width: "40%", bold: true },
  { width: "85%" },
  { width: "70%" },
  { width: "92%" },
  { width: "55%" },
  { width: "80%" },
  { width: "65%" },
  { width: "88%" },
  { width: "48%" },
  { width: "75%" },
];

// Same pattern, scaled up, used inside the lens so it reads as a
// zoomed-in view of the same document.
const ZOOM_LINES: { width: string; bold?: boolean }[] = [
  { width: "70%", bold: true },
  { width: "45%", bold: true },
  { width: "90%" },
  { width: "60%" },
  { width: "82%" },
  { width: "50%" },
  { width: "78%" },
];

export default function HeroAnimation() {
  return (
    <div
      className="relative mx-auto h-[320px] w-[280px] select-none sm:h-[360px] sm:w-[320px]"
      aria-hidden="true"
    >
      {/* Resume document */}
      <div className="animate-doc-float absolute left-1/2 top-6 w-[220px] -translate-x-1/2 rounded-2xl border border-white/10 bg-panel p-5 shadow-2xl shadow-black/40 sm:w-[240px]">
        <div className="mb-3 h-3 w-3 rounded-full bg-accent/70" />
        <div className="space-y-2.5">
          {DOC_LINES.map((line, i) => (
            <div
              key={i}
              className={`rounded-full ${
                line.bold ? "h-2.5 bg-zinc-300/70" : "h-1.5 bg-zinc-500/50"
              }`}
              style={{ width: line.width }}
            />
          ))}
        </div>
      </div>

      {/* Magnifying glass, orbiting the document */}
      <div className="animate-magnifier absolute left-0 top-0 h-[104px] w-[104px]">
        <div
          className="animate-magnifier-glow relative h-full w-full rounded-full border-[10px] border-accent bg-ink/90"
          style={{ overflow: "hidden" }}
        >
          {/* Zoomed-in text visible through the lens */}
          <div className="animate-magnify-pan absolute left-0 top-0 w-[260px] space-y-3 p-2">
            {ZOOM_LINES.map((line, i) => (
              <div
                key={i}
                className={`rounded-full ${
                  line.bold ? "h-3.5 bg-zinc-200/80" : "h-2 bg-zinc-400/60"
                }`}
                style={{ width: line.width }}
              />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-transparent" />
        </div>
        {/* Handle */}
        <div className="absolute -bottom-1 -right-1 h-[46px] w-[16px] translate-x-1/3 translate-y-1/3 rotate-45 rounded-full bg-accent" />
      </div>
    </div>
  );
}