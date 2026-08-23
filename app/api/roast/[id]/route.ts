import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json({ success: false, error: { code, message } }, { status });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;

  if (!userId) {
    return errorResponse(401, "UNAUTHORIZED", "Please sign in to view this roast.");
  }

  const { id } = await params;
  const roast = await prisma.roast.findUnique({ where: { id } });

  // Return 404 rather than revealing that another user's roast exists.
  if (!roast || roast.userId !== userId) {
    return errorResponse(404, "NOT_FOUND", "Roast not found.");
  }

  return NextResponse.json({
    success: true,
    roast: {
      id: roast.id,
      filename: roast.filename,
      overallScore: roast.overallScore,
      createdAt: roast.createdAt,
      result: roast.resultJson,
    },
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;

  if (!userId) {
    return errorResponse(401, "UNAUTHORIZED", "Please sign in to manage your roasts.");
  }

  const { id } = await params;
  const roast = await prisma.roast.findUnique({ where: { id } });

  if (!roast || roast.userId !== userId) {
    return errorResponse(404, "NOT_FOUND", "Roast not found.");
  }

  await prisma.roast.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
