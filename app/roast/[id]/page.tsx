import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RoastResult from "@/components/RoastResult";
import type { RoastResult as RoastResultType } from "@/types/roast";

export default async function RoastDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;

  if (!userId) {
    redirect("/login");
  }

  const { id } = await params;
  const roast = await prisma.roast.findUnique({ where: { id } });

  if (!roast || roast.userId !== userId) {
    notFound();
  }

  const result = roast!.resultJson as unknown as RoastResultType;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm text-zinc-500">{roast!.filename}</p>
      <h1 className="mt-1 text-2xl font-black">
        Roasted on {new Date(roast!.createdAt).toLocaleDateString()}
      </h1>
      <div className="mt-8">
        <RoastResult result={result} />
      </div>
    </div>
  );
}
