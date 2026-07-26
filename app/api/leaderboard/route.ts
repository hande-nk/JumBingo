import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/leaderboard";
import { getCurrentProfile } from "@/lib/auth-helpers";

export async function GET() {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json(await getLeaderboard());
}