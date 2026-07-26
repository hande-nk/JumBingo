import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/auth-helpers";

const reviewSchema = z.object({
  status: z.enum(["APPROVED", "DECLINED"]),
});

// PATCH /api/submissions/:id -> admin approves or declines
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (profile.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const submission = await prisma.submission.update({
      where: { id },
      data: { status: parsed.data.status },
    });
    return NextResponse.json(submission);
  } catch (e: unknown) {
    if (typeof e === "object" && e !== null && "code" in e && e.code === "P2025") {
      return NextResponse.json({ error: "Submission not found." }, { status: 404 });
    }
    throw e;
  }
}