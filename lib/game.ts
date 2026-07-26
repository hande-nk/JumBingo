import { prisma } from "@/lib/prisma";
import { getLeaderboard, type TeamScore } from "@/lib/leaderboard";

const COLS = 4;

// Winning lines for an N-cell board packed into COLS columns:
// every complete row, and every 4-tall vertical run.
function buildLines(n: number): number[][] {
  const rows = Math.ceil(n / COLS);
  const lines: number[][] = [];

  for (let r = 0; r < rows; r++) {
    const line = [0, 1, 2, 3].map((c) => r * COLS + c);
    if (line.every((i) => i < n)) lines.push(line);
  }
  for (let c = 0; c < COLS; c++) {
    for (let top = 0; top + 4 <= rows; top++) {
      const line = [0, 1, 2, 3].map((k) => (top + k) * COLS + c);
      if (line.every((i) => i < n)) lines.push(line);
    }
  }
  return lines;
}

export type GameState = {
  gameOver: boolean;
  bingoTeams: { id: string; name: string }[];
  winner: TeamScore | null;
};

export async function getGameState(): Promise<GameState> {
  // Board order -> each question's visual position (0-based).
  const questions = await prisma.question.findMany({
    orderBy: { boardIndex: "asc" },
    select: { id: true },
  });
  const positionOf = new Map(questions.map((q, i) => [q.id, i]));
  const lines = buildLines(questions.length);

  const approved = await prisma.submission.findMany({
    where: { status: "APPROVED" },
    include: {
      user: { select: { team: { select: { id: true, name: true } } } },
      question: { select: { id: true } },
    },
  });

  const covered = new Map<string, Set<number>>();
  const names = new Map<string, string>();
  for (const s of approved) {
    const team = s.user.team;
    if (!team) continue;
    const pos = positionOf.get(s.question.id);
    if (pos === undefined) continue;
    names.set(team.id, team.name);
    if (!covered.has(team.id)) covered.set(team.id, new Set());
    covered.get(team.id)!.add(pos);
  }

  const bingoTeams: { id: string; name: string }[] = [];
  for (const [teamId, cells] of covered) {
    if (lines.some((line) => line.every((idx) => cells.has(idx)))) {
      bingoTeams.push({ id: teamId, name: names.get(teamId) ?? "Unknown" });
    }
  }

  const gameOver = bingoTeams.length > 0;
  const { teams } = await getLeaderboard();
  const winner = gameOver ? teams[0] ?? null : null;

  return { gameOver, bingoTeams, winner };
}