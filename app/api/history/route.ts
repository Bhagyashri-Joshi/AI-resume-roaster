import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;

  if (!userId) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Please sign in." } },
      { status: 401 }
    );
  }

  const roasts = await prisma.roast.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      filename: true,
      overallScore: true,
      createdAt: true,
      resultJson: true,
    },
  });

  return NextResponse.json({
    success: true,
    roasts: roasts.map((r) => ({
      id: r.id,
      filename: r.filename,
      overallScore: r.overallScore,
      createdAt: r.createdAt,
      summary:
        typeof r.resultJson === "object" &&
        r.resultJson !== null &&
        "summary" in r.resultJson
          ? (r.resultJson as { summary?: string }).summary
          : "",
    })),
  });
}
