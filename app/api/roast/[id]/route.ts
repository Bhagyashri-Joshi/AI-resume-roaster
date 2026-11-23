import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/api";
import { getUserId } from "@/lib/session";

// Viewing a roast is handled by the server-rendered page at /roast/[id];
// this route only exists for deleting one.
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getUserId();
  if (!userId) {
    return errorResponse(401, "UNAUTHORIZED", "Please sign in to manage your roasts.");
  }

  // Scoping by userId means we never reveal whether another user's roast exists.
  const { count } = await prisma.roast.deleteMany({ where: { id: params.id, userId } });
  if (count === 0) {
    return errorResponse(404, "NOT_FOUND", "Roast not found.");
  }

  return NextResponse.json({ success: true });
}
