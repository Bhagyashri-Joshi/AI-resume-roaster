export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="rounded-xl2 border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200">
      {message}
    </div>
  );
}
