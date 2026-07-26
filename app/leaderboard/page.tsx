//the rankings view, computing directly
import { getLeaderboard } from "@/lib/leaderboard";

export default async function LeaderboardPage() {
  const { individuals, teams } = await getLeaderboard();

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Leaderboard</h1>

        <section className="mb-8">
          <h2 className="text-sm uppercase tracking-wide text-gray-400 mb-3">Teams</h2>
          <ol className="flex flex-col gap-2">
            {teams.map((t, i) => (
              <li key={t.id} className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-900 px-4 py-3">
                <span><span className="text-gray-500 mr-3">{i + 1}</span>{t.name}</span>
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