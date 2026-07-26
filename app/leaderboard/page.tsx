//the rankings view, computing directly
import { getLeaderboard } from "@/lib/leaderboard";
import { getGameState } from "@/lib/game";
import Link from "next/link";

export default async function LeaderboardPage() {
  const [{ individuals, teams }, game] = await Promise.all([
    getLeaderboard(),
    getGameState(),
  ]);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        {game.gameOver && game.winner && (
          <div className="rounded-lg border border-emerald-500 bg-emerald-950 p-4 mb-6">
            <p className="font-semibold text-emerald-300">
              Bingo! The game has ended — {game.winner.name} wins with {game.winner.points} points.
            </p>
            <p className="text-sm text-emerald-200/80 mt-1">
              {game.bingoTeams.map((t) => t.name).join(", ")} completed a bingo line
              {game.bingoTeams.some((t) => t.id === game.winner!.id)
                ? "."
                : ", but the highest-scoring team takes the win."}
            </p>
          </div>
        )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <Link
          href="/main"
          className="text-sm text-gray-300 hover:text-white rounded-md border border-gray-700 px-3 py-1"
        >
          ← Back to board
        </Link>
      </div>

        <section className="mb-8">
          <h2 className="text-sm uppercase tracking-wide text-gray-400 mb-3">Teams</h2>
          <ol className="flex flex-col gap-2">
            {teams.map((t, i) => (
              <li key={t.id} className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-900 px-4 py-3">
                <span>
                  <span className="text-gray-500 mr-3">{i + 1}</span>
                  {t.name}
                  {game.bingoTeams.some((b) => b.id === t.id) && (
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-200">Bingo</span>
                  )}
                </span>
                <span className="font-semibold">{t.points} pts</span>
              </li>
            ))}
            {teams.length === 0 && <p className="text-gray-500 text-sm">No scores yet.</p>}
          </ol>
        </section>

        <section>
          <h2 className="text-sm uppercase tracking-wide text-gray-400 mb-3">Individuals</h2>
          <ol className="flex flex-col gap-2">
            {individuals.map((u, i) => (
              <li key={u.id} className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-900 px-4 py-3">
                <span>
                  <span className="text-gray-500 mr-3">{i + 1}</span>
                  {u.name}
                  {u.teamName ? <span className="text-gray-500 text-sm"> · {u.teamName}</span> : null}
                </span>
                <span className="font-semibold">{u.points} pts</span>
              </li>
            ))}
            {individuals.length === 0 && <p className="text-gray-500 text-sm">No scores yet.</p>}
          </ol>
        </section>
      </div>
    </main>
  );
}