import ResumeUploader from "@/components/ResumeUploader";

export default function RoastPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-center text-3xl font-black">Roast My Resume</h1>
      <p className="mt-2 text-center text-zinc-400">
        Upload a PDF resume (max 5 MB). Sign in first if you want to save the result.
      </p>
      <div className="mt-10">
        <ResumeUploader />
      </div>
    </div>
  );
}
