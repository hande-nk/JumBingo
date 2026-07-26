//It queries all questions ordered by board position and returns them as JSON.
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/auth-helpers";

const createQuestionSchema = z.object({
  text: z.string().min(1, "Question text is required"),
  category: z.enum(["TECHNICAL", "SOCIAL"]),
  points: z.number().int().positive(),
  boardIndex: z.number().int().min(0).max(15),
});

// GET /api/questions -> the 4x4 board, in order
export async function GET() {
  const questions = await prisma.question.findMany({
    orderBy: { boardIndex: "asc" },
  });
  return NextResponse.json(questions);
}

// POST /api/questions -> create a question (admin only)
export async function POST(request: Request) {
  // 1. Authenticate + authorize (server-side, from the database)
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (profile.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  // 2. Validate the input
  const body = await request.json().catch(() => null);
  const parsed = createQuestionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // 3. Write, handling the unique-board-position constraint
  try {
    const question = await prisma.question.create({ data: parsed.data });
    return NextResponse.json(question, { status: 201 });
  } catch (e: unknown) {
    if (typeof e === "object" && e !== null && "code" in e && e.code === "P2002") {
      return NextResponse.json(
        { error: "That board position is already taken." },
        { status: 409 }
      );
    }
    throw e;
  }
}