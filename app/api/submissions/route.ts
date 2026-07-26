import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/auth-helpers";

const createSubmissionSchema = z.object({
  questionId: z.string().min(1),
  answer: z.string().min(1, "Answer is required"),
});

// POST /api/submissions -> a logged-in member submits an answer
export async function POST(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const submission = await prisma.submission.create({
      data: {
        answer: parsed.data.answer,
        questionId: parsed.data.questionId,
        userId: profile.id, // from the session, NOT the request body
      },
    });
    return NextResponse.json(submission, { status: 201 });
  } catch (e: unknown) {
    if (typeof e === "object" && e !== null && "code" in e) {
      if (e.code === "P2002") {
        return NextResponse.json({ error: "You already answered this question." }, { status: 409 });
      }
      if (e.code === "P2003") {
        return NextResponse.json({ error: "That question does not exist." }, { status: 400 });
      }
    }
    throw e;
  }
}

// GET /api/submissions?status=PENDING -> admin review queue
export async function GET(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (profile.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const statusParam = new URL(request.url).searchParams.get("status");
  const allowed = ["PENDING", "APPROVED", "DECLINED"] as const;
  const status = allowed.find((s) => s === statusParam);

  const submissions = await prisma.submission.findMany({
    where: status ? { status } : undefined,
    include: {
      user: { select: { name: true, email: true } },
      question: { select: { text: true, points: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(submissions);
}