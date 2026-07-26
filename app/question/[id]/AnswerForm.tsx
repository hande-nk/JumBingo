"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AnswerForm({ questionId }: { questionId: string }) {
  const router = useRouter();
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, answer }),
    });

    if (res.ok) {
      router.push("/main");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="answer" className="text-sm text-gray-400">Your answer</label>
      <textarea
        id="answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        required
        rows={4}
        placeholder="Type your answer here"
        className="rounded-lg bg-gray-900 border border-gray-700 p-3 text-sm"
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-emerald-500 text-black font-medium py-2 disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit answer"}
      </button>
      <p className="text-xs text-gray-500">An admin will review your answer before points are awarded.</p>
    </form>
  );
}