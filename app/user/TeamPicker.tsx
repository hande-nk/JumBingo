//Client Component: join/leave buttons
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Team = { id: string; name: string };

export function TeamPicker({
  teams,
  currentTeamId,
}: {
  teams: Team[];
  currentTeamId: string | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setTeam(teamId: string | null) {
    setBusy(true);
    const res = await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamId }),
    });
    if (res.ok) router.refresh();
    else setBusy(false);
  }

  return (
    <div className="flex flex-col gap-2">
      {teams.map((t) => (
        <button
          key={t.id}
          onClick={() => setTeam(t.id)}
          disabled={busy || t.id === currentTeamId}
          className="text-left rounded-md border border-gray-700 px-3 py-2 text-sm hover:border-gray-400 disabled:opacity-40"
        >
          {t.id === currentTeamId ? `✓ ${t.name}` : `Join ${t.name}`}
        </button>
      ))}
      {currentTeamId && (
        <button
          onClick={() => setTeam(null)}
          disabled={busy}
          className="text-left rounded-md border border-red-500 text-red-400 px-3 py-2 text-sm disabled:opacity-40"
        >
          Leave team
        </button>
      )}
    </div>
  );
}