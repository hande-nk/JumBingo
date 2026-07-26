//the shared scoring logic, lifted out of the route
import { prisma } from "@/lib/prisma";

export type IndividualScore = {
  id: string;
  name: string;
  teamId: string | null;
  teamName: string | null;
  points: number;
};

export type TeamScore = { id: string; name: string; points: number };

export async function getLeaderboard() {
  const approved = await prisma.submission.findMany({
    where: { status: "APPROVED" },
    include: {
      question: { select: { points: true } },
      user: {
        select: {
          id: true,
          name: true,
          teamId: true,
          team: { select: { id: true, name: true } },
        },
      },
    },
  });

  const individuals = new Map<string, IndividualScore>();
  for (const s of approved) {
    const u = s.user;
    const entry = individuals.get(u.id) ?? {
      id: u.id,
      name: u.name,
      teamId: u.teamId,
      teamName: u.team?.name ?? null,
      points: 0,
    };
    entry.points += s.question.points;
    individuals.set(u.id, entry);
  }

  const teams = new Map<string, TeamScore>();
  for (const ind of individuals.values()) {
    if (!ind.teamId || !ind.teamName) continue;
    const entry = teams.get(ind.teamId) ?? { id: ind.teamId, name: ind.teamName, points: 0 };
    entry.points += ind.points;
    teams.set(ind.teamId, entry);
  }

  return {
    individuals: [...individuals.values()].sort((a, b) => b.points - a.points),
    teams: [...teams.values()].sort((a, b) => b.points - a.points),
  };
}