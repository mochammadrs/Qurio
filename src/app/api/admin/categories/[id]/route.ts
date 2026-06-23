import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const SLUG_REGEX = /^[a-z0-9-]+$/;

function validateCategoryBody(body: Record<string, unknown>, partial = false) {
  const errors: string[] = [];

  if (body.slug !== undefined) {
    if (typeof body.slug !== "string") {
      errors.push("slug must be a string");
    } else if (!SLUG_REGEX.test(body.slug)) {
      errors.push("slug must be lowercase alphanumeric with hyphens only");
    } else if (body.slug.length > 50) {
      errors.push("slug must be at most 50 characters");
    }
  }

  if (body.name !== undefined) {
    if (typeof body.name !== "string") {
      errors.push("name must be a string");
    } else if (body.name.length > 100) {
      errors.push("name must be at most 100 characters");
    }
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

  if (!partial && errors.length === 0) {
    if (!body.slug) errors.push("slug is required");
    if (!body.name) errors.push("name is required");
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

    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { questions: true } } },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch category";
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
    const validationErrors = validateCategoryBody(body, true);

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: `Validation failed: ${validationErrors.join(", ")}` },
        { status: 400 },
      );
    }

    const existing = await prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    if (body.slug && body.slug !== existing.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug: body.slug as string },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "A category with this slug already exists" },
          { status: 409 },
        );
      }
    }

    const data: Record<string, string> = {};
    if (body.slug !== undefined) data.slug = body.slug as string;
    if (body.name !== undefined) data.name = body.name as string;
    if (body.description !== undefined) {
      data.description = body.description as string;
    }
    if (body.emoji !== undefined) {
      data.emoji = body.emoji as string;
    }

    const category = await prisma.category.update({
      where: { id },
      data,
      include: { _count: { select: { questions: true } } },
    });

    return NextResponse.json(category);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update category";
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

    const existing = await prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    const questionCount = await prisma.question.count({
      where: { categoryId: id },
    });

    if (questionCount > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete category with existing questions. Delete questions first.",
        },
        { status: 400 },
      );
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json(
      { message: "Category deleted" },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete category";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
