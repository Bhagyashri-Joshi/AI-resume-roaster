import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/session";
import RoastResult from "@/components/RoastResult";
import LocalDate from "@/components/LocalDate";
import type { RoastResult as RoastResultType } from "@/types/roast";

export default async function RoastDetailPage({ params }: { params: { id: string } }) {
  const userId = await getUserId();
  if (!userId) redirect("/login");

  const roast = await prisma.roast.findFirst({ where: { id: params.id, userId } });
  if (!roast) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm text-zinc-500">{roast.filename}</p>
      <h1 className="mt-1 text-2xl font-black">
        Roasted on <LocalDate iso={roast.createdAt.toISOString()} />
      </h1>
      <div className="mt-8">
        <RoastResult result={roast.resultJson as unknown as RoastResultType} />
      </div>
    </div>
  );
}
