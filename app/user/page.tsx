//Server Component: profile, points, team
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/auth-helpers";
import { getLeaderboard } from "@/lib/leaderboard";
import { TeamPicker } from "./TeamPicker";

export default async function UserPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const [{ individuals }, teams] = await Promise.all([
    getLeaderboard(),
    prisma.team.findMany({ orderBy: { name: "asc" } }),
  ]);

  const myPoints = individuals.find((i) => i.id === profile.id)?.points ?? 0;
  const myTeam = teams.find((t) => t.id === profile.teamId);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-1">{profile.name}</h1>
        <p className="text-sm text-gray-400 mb-6">{profile.email}</p>

        <div className="rounded-lg border border-gray-700 bg-gray-900 p-4 mb-6 flex items-center justify-between">
          <span className="text-gray-400">Points</span>
          <span className="text-lg font-semibold text-emerald-400">{myPoints}</span>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
          <p className="text-gray-400 mb-3">
            Team: <span className="text-white">{myTeam?.name ?? "Unassigned"}</span>
          </p>
          <TeamPicker teams={teams} currentTeamId={profile.teamId} />
        </div>
      </div>
    </main>
  );
}