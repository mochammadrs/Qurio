import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const VALID_DIFFICULTIES = ["easy", "medium", "hard"];

function validateQuestionBody(body: Record<string, unknown>) {
  const errors: string[] = [];

  if (!body.categoryId || typeof body.categoryId !== "string") {
    errors.push("categoryId is required");
  }

  if (!body.question || typeof body.question !== "string") {
    errors.push("question is required");
  } else if (body.question.length > 500) {
    errors.push("question must be at most 500 characters");
  }

  if (!Array.isArray(body.options)) {
    errors.push("options must be an array");
  } else if (body.options.length !== 4) {
    errors.push("options must contain exactly 4 items");
  } else {
    body.options.forEach((opt, i) => {
      if (typeof opt !== "string" || opt.trim() === "") {
        errors.push(`options[${i}] must be a non-empty string`);
      }
    });
  }

  if (
    body.correctAnswer === undefined ||
    body.correctAnswer === null ||
    typeof body.correctAnswer !== "number" ||
    !Number.isInteger(body.correctAnswer) ||
    body.correctAnswer < 0 ||
    body.correctAnswer > 3
  ) {
    errors.push("correctAnswer must be an integer between 0 and 3");
  }

  if (
    body.difficulty !== undefined &&
    body.difficulty !== null &&
    !VALID_DIFFICULTIES.includes(body.difficulty as string)
  ) {
    errors.push("difficulty must be one of: easy, medium, hard");
  }

  return errors;
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const questions = await prisma.question.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ questions });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch questions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validationErrors = validateQuestionBody(body);

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: `Validation failed: ${validationErrors.join(", ")}` },
        { status: 400 },
      );
    }

    const data: Record<string, unknown> = {
      categoryId: body.categoryId,
      question: body.question,
      options: body.options,
      correctAnswer: body.correctAnswer,
    };

    if (body.difficulty !== undefined && body.difficulty !== null) {
      data.difficulty = body.difficulty;
    }

    const question = await prisma.question.create({
      data: data as {
        categoryId: string;
        question: string;
        options: string[];
        correctAnswer: number;
        difficulty?: string;
      },
      include: { category: true },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create question";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
