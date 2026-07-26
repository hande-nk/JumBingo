//It queries all questions ordered by board position and returns them as JSON.
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/auth-helpers";

const createQuestionSchema = z.object({
  text: z.string().min(1, "Question text is required"),
  category: z.enum(["TECHNICAL", "SOCIAL"]),
  points: z.number().int().positive(),
});

export async function GET() {
  const questions = await prisma.question.findMany({ orderBy: { boardIndex: "asc" } });
  return NextResponse.json(questions);
}

export async function POST(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  if (profile.role !== "ADMIN") return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = createQuestionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Append to the end of the board.
  const last = await prisma.question.findFirst({
    orderBy: { boardIndex: "desc" },
    select: { boardIndex: true },
  });
  const boardIndex = (last?.boardIndex ?? -1) + 1;

  const question = await prisma.question.create({
    data: { ...parsed.data, boardIndex },
  });
  return NextResponse.json(question, { status: 201 });
}