import { prisma } from "@/lib/prisma";
import { getLeaderboard, type TeamScore } from "@/lib/leaderboard";

// The 4x4 board indexed 0-15:
//  0  1  2  3
//  4  5  6  7
//  8  9 10 11
// 12 13 14 15
const LINES: number[][] = [
  [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15], // rows
  [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15], // columns
  [0, 5, 10, 15], [3, 6, 9, 12], // diagonals
];

export type GameState = {
  gameOver: boolean;
  bingoTeams: { id: string; name: string }[];
  winner: TeamScore | null;
};

export async function getGameState(): Promise<GameState> {
  const approved = await prisma.submission.findMany({
    where: { status: "APPROVED" },
    include: {
      user: { select: { team: { select: { id: true, name: true } } } },
      question: { select: { boardIndex: true } },
    },
  });

  // For each team, the set of board cells it has covered.
  const covered = new Map<string, Set<number>>();
  const names = new Map<string, string>();
  for (const s of approved) {
    const team = s.user.team;
    if (!team) continue; // unassigned members don't advance a team
    names.set(team.id, team.name);
    if (!covered.has(team.id)) covered.set(team.id, new Set());
    covered.get(team.id)!.add(s.question.boardIndex);
  }

  // A team has bingo if any line is fully covered.
  const bingoTeams: { id: string; name: string }[] = [];
  for (const [teamId, cells] of covered) {
    if (LINES.some((line) => line.every((idx) => cells.has(idx)))) {
      bingoTeams.push({ id: teamId, name: names.get(teamId) ?? "Unknown" });
    }
  }

  const gameOver = bingoTeams.length > 0;

  // Winner rule from the 1-pager: bingo ends the game, but the highest-scoring
  // team wins (not necessarily the one who got the line).
  const { teams } = await getLeaderboard();
  const winner = gameOver ? teams[0] ?? null : null;

  return { gameOver, bingoTeams, winner };
}