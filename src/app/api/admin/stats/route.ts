import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [
      totalUsers,
      totalQuestions,
      totalScores,
      avgResult,
      gradeRows,
      categoryStats,
      recentScores,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.question.count(),
      prisma.score.count(),
      prisma.score.aggregate({ _avg: { percentage: true, score: true } }),
      prisma.score.groupBy({
        by: ["grade"],
        _count: { id: true },
      }),
      prisma.category.findMany({
        include: {
          _count: { select: { questions: true, scores: true } },
          scores: { select: { percentage: true } },
        },
        orderBy: { name: "asc" },
      }),
      prisma.score.findMany({
        take: 10,
        orderBy: { completedAt: "desc" },
        include: {
          user: { select: { name: true, image: true } },
          category: { select: { name: true, slug: true } },
        },
      }),
    ]);

    const gradeDistribution = gradeRows.reduce(
      (acc, row) => {
        acc[row.grade] = row._count.id;
        return acc;
      },
      {} as Record<string, number>,
    );

    const categoryBreakdown = categoryStats.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      questionCount: cat._count.questions,
      gameCount: cat._count.scores,
      avgPercentage:
        cat.scores.length > 0
          ? Math.round(
              cat.scores.reduce((sum, s) => sum + s.percentage, 0) /
                cat.scores.length,
            )
          : 0,
    }));

    return NextResponse.json({
      totals: {
        users: totalUsers,
        questions: totalQuestions,
        games: totalScores,
        avgScore: Math.round(avgResult._avg.score ?? 0),
        avgPercentage: Math.round(avgResult._avg.percentage ?? 0),
      },
      gradeDistribution,
      categoryBreakdown,
      recentScores: recentScores.map((s) => ({
        id: s.id,
        userName: s.user.name ?? "Anonymous",
        userImage: s.user.image,
        categoryName: s.category.name,
        categorySlug: s.category.slug,
        score: s.score,
        percentage: s.percentage,
        grade: s.grade,
        completedAt: s.completedAt.toISOString(),
      })),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
