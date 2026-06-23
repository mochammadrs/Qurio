import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const scores = await prisma.score.findMany({
      where: { userId: session.user.id },
      include: { category: true },
      orderBy: { completedAt: "desc" },
    });

    return NextResponse.json({ scores });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch scores";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { categoryId, score, totalQuestions, correctAnswers, wrongAnswers, percentage, grade } = body;

    const missingFields: string[] = [];
    if (!categoryId) missingFields.push("categoryId");
    if (score === undefined || score === null) missingFields.push("score");
    if (!totalQuestions) missingFields.push("totalQuestions");
    if (correctAnswers === undefined || correctAnswers === null)
      missingFields.push("correctAnswers");
    if (wrongAnswers === undefined || wrongAnswers === null)
      missingFields.push("wrongAnswers");
    if (percentage === undefined || percentage === null)
      missingFields.push("percentage");
    if (!grade) missingFields.push("grade");

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 },
      );
    }

    const created = await prisma.score.create({
      data: {
        userId: session.user.id,
        categoryId,
        score,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        percentage,
        grade,
      },
      include: { category: true },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save score";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
