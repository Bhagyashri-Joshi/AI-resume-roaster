import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import RoastHistory from "@/components/RoastHistory";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;

  if (!userId) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-black">Roast History</h1>
      <p className="mt-2 text-zinc-400">All your past roasts, newest first.</p>
      <div className="mt-8">
        <RoastHistory />
      </div>
    </div>
  );
}
