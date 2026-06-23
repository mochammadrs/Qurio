import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const VALID_DIFFICULTIES = ["easy", "medium", "hard"];

function validateQuestionBody(body: Record<string, unknown>, partial = false) {
  const errors: string[] = [];

  if (body.categoryId !== undefined && typeof body.categoryId !== "string") {
    errors.push("categoryId must be a string");
  }

  if (body.question !== undefined) {
    if (typeof body.question !== "string") {
      errors.push("question must be a string");
    } else if (body.question.length > 500) {
      errors.push("question must be at most 500 characters");
    }
  }

  if (body.options !== undefined) {
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
  }

  if (body.correctAnswer !== undefined) {
    if (
      typeof body.correctAnswer !== "number" ||
      !Number.isInteger(body.correctAnswer) ||
      body.correctAnswer < 0 ||
      body.correctAnswer > 3
    ) {
      errors.push("correctAnswer must be an integer between 0 and 3");
    }
  }

  if (
    body.difficulty !== undefined &&
    body.difficulty !== null &&
    !VALID_DIFFICULTIES.includes(body.difficulty as string)
  ) {
    errors.push("difficulty must be one of: easy, medium, hard");
  }

  if (!partial && errors.length === 0) {
    if (!body.categoryId) errors.push("categoryId is required");
    if (!body.question) errors.push("question is required");
    if (!body.options) errors.push("options is required");
    if (body.correctAnswer === undefined || body.correctAnswer === null) {
      errors.push("correctAnswer is required");
    }
  }

  return errors;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const question = await prisma.question.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch question";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const validationErrors = validateQuestionBody(body, true);

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: `Validation failed: ${validationErrors.join(", ")}` },
        { status: 400 },
      );
    }

    const existing = await prisma.question.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    const data: Record<string, unknown> = {};
    if (body.categoryId !== undefined) data.categoryId = body.categoryId;
    if (body.question !== undefined) data.question = body.question;
    if (body.options !== undefined) data.options = body.options;
    if (body.correctAnswer !== undefined) data.correctAnswer = body.correctAnswer;
    if (body.difficulty !== undefined) data.difficulty = body.difficulty;

    const question = await prisma.question.update({
      where: { id },
      data: data as {
        categoryId?: string;
        question?: string;
        options?: string[];
        correctAnswer?: number;
        difficulty?: string;
      },
      include: { category: true },
    });

    return NextResponse.json(question);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update question";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const existing = await prisma.question.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    await prisma.question.delete({ where: { id } });

    return NextResponse.json(
      { message: "Question deleted" },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete question";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
