import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const SLUG_REGEX = /^[a-z0-9-]+$/;

function validateCategoryBody(body: Record<string, unknown>) {
  const errors: string[] = [];

  if (!body.slug || typeof body.slug !== "string") {
    errors.push("slug is required");
  } else if (!SLUG_REGEX.test(body.slug)) {
    errors.push("slug must be lowercase alphanumeric with hyphens only");
  } else if (body.slug.length > 50) {
    errors.push("slug must be at most 50 characters");
  }

  if (!body.name || typeof body.name !== "string") {
    errors.push("name is required");
  } else if (body.name.length > 100) {
    errors.push("name must be at most 100 characters");
  }

  if (
    body.description !== undefined &&
    body.description !== null &&
    typeof body.description !== "string"
  ) {
    errors.push("description must be a string");
  } else if (
    typeof body.description === "string" &&
    body.description.length > 500
  ) {
    errors.push("description must be at most 500 characters");
  }

  if (
    body.emoji !== undefined &&
    body.emoji !== null &&
    typeof body.emoji !== "string"
  ) {
    errors.push("emoji must be a string");
  } else if (typeof body.emoji === "string" && body.emoji.length > 10) {
    errors.push("emoji must be at most 10 characters");
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

    const categories = await prisma.category.findMany({
      include: { _count: { select: { questions: true } } },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch categories";
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
    const validationErrors = validateCategoryBody(body);

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: `Validation failed: ${validationErrors.join(", ")}` },
        { status: 400 },
      );
    }

    const slug = body.slug as string;
    const existing = await prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 409 },
      );
    }

    const category = await prisma.category.create({
      data: {
        slug,
        name: body.name as string,
        description: (body.description as string) ?? "",
        emoji: (body.emoji as string) ?? "",
      },
      include: { _count: { select: { questions: true } } },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create category";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
