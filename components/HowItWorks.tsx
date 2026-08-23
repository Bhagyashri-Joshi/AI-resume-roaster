const STEPS = [
  { title: "Upload", body: "Drop in your resume as a PDF. Nothing gets stored unless you sign in." },
  { title: "Analyze", body: "Our AI reads it line by line, hunting for vague claims and buzzwords." },
  { title: "Get Roasted", body: "Receive a scored, structured, and painfully funny critique." },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h2 className="text-center text-2xl font-bold">How it works</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <div key={step.title} className="rounded-xl2 border border-white/10 bg-panel p-6">
            <div className="mb-3 text-2xl font-black text-accent">{i + 1}</div>
            <h3 className="font-bold">{step.title}</h3>
            <p className="mt-2 text-sm text-zinc-400">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
