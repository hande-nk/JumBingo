"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteQuestionButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function del() {
    if (!confirm("Delete this question and all its answers?")) return;
    setBusy(true);
    const res = await fetch(`/api/questions/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else setBusy(false);
  }

  return (
    <button
      onClick={del}
      disabled={busy}
      className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
    >
      {busy ? "Deleting..." : "Delete"}
    </button>
  );
}