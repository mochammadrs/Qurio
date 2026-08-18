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
    const { categoryId, totalQuestions, answers } = body;

    const missingFields: string[] = [];
    if (!categoryId) missingFields.push("categoryId");
    if (!totalQuestions) missingFields.push("totalQuestions");
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      missingFields.push("answers");
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 },
      );
    }

    const questionIds = answers.map((a: { questionId: string }) => a.questionId);
    const dbQuestions = await prisma.question.findMany({
      where: { id: { in: questionIds } },
      select: { id: true, correctAnswer: true },
    });

    const questionMap = new Map(dbQuestions.map((q) => [q.id, q.correctAnswer]));
    let correctAnswers = 0;

    const validatedAnswers = answers.map((a: { questionId: string; selectedAnswer: number; timeSpent?: number }) => {
      const correctAnswer = questionMap.get(a.questionId);
      const isCorrect = correctAnswer !== undefined && a.selectedAnswer === correctAnswer;
      if (isCorrect) correctAnswers++;
      const timeSpent =
        typeof a.timeSpent === "number" && Number.isFinite(a.timeSpent) && a.timeSpent >= 0
          ? Math.round(a.timeSpent)
          : 0;
      return {
        questionId: a.questionId,
        selectedAnswer: a.selectedAnswer,
        correctAnswer: correctAnswer ?? -1,
        isCorrect,
        timeSpent,
      };
    });

    const score = correctAnswers * 10;
    const wrongAnswers = totalQuestions - correctAnswers;
    const percentage = Math.round((score / (totalQuestions * 10)) * 100);

    let grade: "A" | "B" | "C";
    if (percentage >= 80) grade = "A";
    else if (percentage >= 60) grade = "B";
    else grade = "C";

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
        answers: {
          create: validatedAnswers,
        },
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
