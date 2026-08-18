import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id;

    const allTimeTop = await prisma.score.findMany({
      where: {
        percentage: 100,
      },
      orderBy: { score: "desc" },
      take: 10,
      include: {
        user: { select: { name: true, image: true } },
        category: { select: { name: true, emoji: true } },
      },
    });

    const topScores = await prisma.score.findMany({
      orderBy: [{ score: "desc" }, { percentage: "desc" }, { completedAt: "desc" }],
      take: 10,
      include: {
        user: { select: { name: true, image: true } },
        category: { select: { name: true, emoji: true } },
      },
    });

    let userRank: { rank: number; score: number; percentage: number; grade: string } | null = null;
    if (currentUserId) {
      const userBest = await prisma.score.findFirst({
        where: { userId: currentUserId },
        orderBy: [{ score: "desc" }, { percentage: "desc" }],
      });
      if (userBest) {
        const betterCount = await prisma.score.count({
          where: {
            OR: [
              { score: { gt: userBest.score } },
              {
                score: userBest.score,
                percentage: { gt: userBest.percentage },
              },
            ],
          },
        });
        userRank = {
          rank: betterCount + 1,
          score: userBest.score,
          percentage: Number(userBest.percentage),
          grade: userBest.grade,
        };
      }
    }

    return NextResponse.json({ topScores, perfectScores: allTimeTop, userRank });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch leaderboard";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
