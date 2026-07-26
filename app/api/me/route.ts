//a member joins or leaves a team
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/auth-helpers";

const updateMeSchema = z.object({
  teamId: z.string().nullable(), // a team id to join, or null to leave
});

// PATCH /api/me -> the current member joins (teamId) or leaves (null) a team
export async function PATCH(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateMeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.user.update({
      where: { id: profile.id }, // only ever your own record
      data: { teamId: parsed.data.teamId },
    });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    if (typeof e === "object" && e !== null && "code" in e && e.code === "P2003") {
      return NextResponse.json({ error: "That team does not exist." }, { status: 400 });
    }
    throw e;
  }
}